pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Minion1500LP {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    IERC20 public MinionInstance;
    address MinionAddress = 0x1f1402A0Ce2d989c881A3120F77434c352D02564;
    address[] internal stakeholders;
    mapping(address => uint256) internal minionStakes; // Stakeholder's Minion stake(s)
    mapping(address => uint256) internal ethStakes; // Stakeholder's Ether stake(s)
    uint256 public minionTotalStakes;
    uint256 public ethTotalStakes;
    uint256 internal harvestReserve = 15000000000000;
    uint256 public minionToWeiRate = 10000000;
    
    event AddStake(address sender, uint256 minionAmount, uint256 ethAmount);
    event WithdrawStake(address receiver, uint256 minionAmount, uint256 ethAmount);
    event HarvestInterest(address stakeholder, uint256 minionAmount);
    
    constructor() public {
        MinionInstance = ERC20(MinionAddress);
    }
    
    function isStakeholder(address _address)
        internal
        view
        returns (bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }
    
    function addStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) stakeholders.push(_stakeholder);
    }
    
    function removeStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if (_isStakeholder) {
            // Replace the current found stakeholder with the last stakeholder
            stakeholders[s] = stakeholders[stakeholders.length - 1];

            // Remove the last stakeholder
            stakeholders.pop();
        }
    }
    
    function getStakeholders()
        public
        view
        returns (address[] memory _stakeholders)
    {
        _stakeholders = stakeholders;
        return _stakeholders;
    }
    
    function stakeOfMinion(address _stakeholder) public view returns (uint256) {
        return minionStakes[_stakeholder];
    }
    
    function stakeOfEth(address _stakeholder) public view returns (uint256) {
        return ethStakes[_stakeholder];
    }
    
    function addStake(address _stakeholder, uint256 _amount) public payable returns (bool _success) {
        _success = (_amount > 0);
        require(_success, "[AddStake failure] - Minion amount cannot be 0");
        
        _success = (msg.value > 0);
        require(_success, "[AddStake failure] - ETH amount cannot be 0");
        
        uint256 _minionToWeiAddRatio = SafeMath.div(msg.value, _amount);
        _success = (_minionToWeiAddRatio == minionToWeiRate);
        require(_success, "[AddStake failure] - Minion to Wei rate not allowed");
        
        uint256 _weiToMinionAddRatio = SafeMath.mul(_amount, minionToWeiRate);
        _success = (_weiToMinionAddRatio == msg.value);
        require(_success, "[AddStake failure] - Wei to Minion rate not allowed");
        
        _success = (MinionInstance.transferFrom(_stakeholder, address(this), _amount));
        require(_success, "[AddStake failure] - Stake amount not being credited to contract balance");
        
        if (minionStakes[_stakeholder] == 0) {
            minionStakes[_stakeholder] = _amount;   // Create new Minion stake for sender
        }else{
            minionStakes[_stakeholder] = SafeMath.add(minionStakes[_stakeholder], _amount); // Add amount to existing Minion stake
        }
        
        minionTotalStakes = SafeMath.add(minionTotalStakes, _amount);
        
        if(ethStakes[_stakeholder] == 0) {
            ethStakes[_stakeholder] = msg.value;    // Create new ETH stake for sender
        }else{
            ethStakes[_stakeholder] = SafeMath.add(ethStakes[_stakeholder], msg.value);   // Add amount to existing ETH stake 
        }
        
        ethTotalStakes = SafeMath.add(ethTotalStakes, msg.value);
        
        (bool _isStakeholder, uint256 _s) = isStakeholder(_stakeholder);
        
        if(!_isStakeholder) {
            addStakeholder(_stakeholder);
        }
        
        emit AddStake(_stakeholder, _amount, msg.value);
        
        return _success;
    }
    
    function withdrawStake(address payable _stakeholder, uint256 _minionAmount, uint256 _ethAmount)
        public returns (bool _success)
    {
        uint256 _minionBalanceOfContract = MinionInstance.balanceOf(address(this));
        
        uint256 _minionToWeiWithdrawalRatio = SafeMath.div(_ethAmount, _minionAmount);
        _success = (_minionToWeiWithdrawalRatio == minionToWeiRate);
        require(_success, "[WithdrawStake failure] - Minion to Wei rate not allowed");
        
        uint256 _weiToMinionWithdrawalRatio = SafeMath.mul(_minionAmount, minionToWeiRate);
        _success = (_weiToMinionWithdrawalRatio == _ethAmount);
        require(_success, "[WithdrawStake failure] - Wei to Minion rate not allowed");
        
        _success = (_minionBalanceOfContract >= _minionAmount);
        require(_success, "[WithdrawStake failure] - Insufficient Minion balance in contract");
        
        _success = (address(this).balance >= _ethAmount);
        require(_success, "[WithdrawStake failure] - Insufficient ETH balance in contract");
        
        _success = (minionStakes[_stakeholder] >= _minionAmount);
        require(_success, "[WithdrawStake failure] - Insufficient Minion stake");
        
        _success = (ethStakes[_stakeholder] >= _ethAmount);
        require(_success, "[WithdrawStake failure] - Insufficient ETH stake");
        
        uint256 _minionBalanceAfterWithdrawal = SafeMath.sub(_minionBalanceOfContract, _minionAmount);
        _success = (_minionBalanceAfterWithdrawal >= harvestReserve);
        require(_success, "[WithdrawStake failure] - Withdrawal causing deduction of harvest reserve");
        
        _success = MinionInstance.transfer(_stakeholder, _minionAmount);
        require(_success, "[WithdrawStake failure] - Minion not being transferred to stakeholder's balance");
        
        _stakeholder.transfer(_ethAmount);

        // Subtract Minion stakes of stakeholder
        minionStakes[_stakeholder] = SafeMath.sub(minionStakes[_stakeholder], _minionAmount);
        minionTotalStakes = SafeMath.sub(minionTotalStakes, _minionAmount);
        
        // Subtract ETH stakes of stakeholder
        ethStakes[_stakeholder] = SafeMath.sub(ethStakes[_stakeholder], _ethAmount);
        ethTotalStakes = SafeMath.sub(ethTotalStakes, _ethAmount);

        if (minionStakes[_stakeholder] <= 0 && ethStakes[_stakeholder] <= 0) {
            removeStakeholder(_stakeholder);
        }

        emit WithdrawStake(_stakeholder, _minionAmount, _ethAmount);
        
        return _success;
    }
    
    function harvestInterest(address _stakeholder, uint256 _amount) public returns (bool _success) {
        uint256 _balanceOfContract = MinionInstance.balanceOf(address(this));
        _success = (_balanceOfContract >= _amount);
        require(_success, "[HarvestInterest failure] - Insufficient balance in MinionLP contract");

        _success = (_amount > 0);
        require(_success, "[HarvestInterest failure] - Cannot harvest 0 Minion");

        (bool _isStakeholder, uint256 _s) = isStakeholder(_stakeholder);
        _success = _isStakeholder;
        require(_success, "[HarvestInterest failure] - Requester is not our stakeholder");
        
        _success = (harvestReserve >= _amount);
        require(_success, "[HarvestInterest failure] - Insufficient harvest reserve");

        _success = MinionInstance.transfer(_stakeholder, _amount);
        require(_success, "[HarvestInterest failure] - Transfer failed");
        
        harvestReserve = SafeMath.sub(harvestReserve, _amount);

        emit HarvestInterest(_stakeholder, _amount);

        return _success;
    }
}