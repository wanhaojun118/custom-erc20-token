pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Banana2500LP {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    IERC20 public BananaInstance;
    address[] internal stakeholders;
    mapping(address => uint256) internal bananaStakes; // Stakeholder's Banana stake(s)
    mapping(address => uint256) internal ethStakes; // Stakeholder's Ether stake(s)
    uint256 public bananaTotalStakes;
    uint256 public ethTotalStakes;
    uint256 internal harvestReserve = 250000000000000000;
    uint256 public bananaToWeiRate = 1;
    
    event AddStake(address sender, uint256 bananaAmount, uint256 ethAmount);
    event WithdrawStake(address receiver, uint256 bananaAmount, uint256 ethAmount);
    event HarvestInterest(address stakeholder, uint256 bananaAmount);
    
    constructor(address _bananaAddress) public {
        BananaInstance = ERC20(_bananaAddress);
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
    
    function stakeOfBanana(address _stakeholder) public view returns (uint256) {
        return bananaStakes[_stakeholder];
    }
    
    function stakeOfEth(address _stakeholder) public view returns (uint256) {
        return ethStakes[_stakeholder];
    }
    
    function addStake(address _stakeholder, uint256 _amount) public payable returns (bool) {
        bool _success = (_amount > 0);
        require(_success, "[AddStake failure] - Banana amount cannot be 0");
        
        _success = (msg.value > 0);
        require(_success, "[AddStake failure] - ETH amount cannot be 0");
        
        uint256 _bananaToWeiAddRatio = SafeMath.div(msg.value, _amount);
        _success = (_bananaToWeiAddRatio == bananaToWeiRate);
        require(_success, "[AddStake failure] - Banana to Wei rate not allowed");
        
        uint256 _weiToBananaAddRatio = SafeMath.mul(_amount, bananaToWeiRate);
        _success = (_weiToBananaAddRatio == msg.value);
        require(_success, "[AddStake failure] - Wei to Banana rate not allowed");
        
        _success = (BananaInstance.transferFrom(_stakeholder, address(this), _amount));
        require(_success, "[AddStake failure] - Stake amount not being credited to contract balance");
        
        if (bananaStakes[_stakeholder] == 0) {
            bananaStakes[_stakeholder] = _amount;   // Create new Banana stake for sender
        }else{
            bananaStakes[_stakeholder] = SafeMath.add(bananaStakes[_stakeholder], _amount); // Add amount to existing Banana stake
        }
        
        bananaTotalStakes = SafeMath.add(bananaTotalStakes, _amount);
        
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
    
    function withdrawStake(address payable _stakeholder, uint256 _bananaAmount, uint256 _ethAmount)
        public returns (bool _success)
    {
        uint256 _bananaBalanceOfContract = BananaInstance.balanceOf(address(this));
        
        uint256 _bananaToWeiWithdrawalRatio = SafeMath.div(_ethAmount, _bananaAmount);
        _success = (_bananaToWeiWithdrawalRatio == bananaToWeiRate);
        require(_success, "[WithdrawStake failure] - Banana to Wei rate not allowed");
        
        uint256 _weiToBananaWithdrawalRatio = SafeMath.mul(_bananaAmount, bananaToWeiRate);
        _success = (_weiToBananaWithdrawalRatio == _ethAmount);
        require(_success, "[WithdrawStake failure] - Wei to Banana rate not allowed");
        
        _success = (_bananaBalanceOfContract >= _bananaAmount);
        require(_success, "[WithdrawStake failure] - Insufficient Banana balance in contract");
        
        _success = (address(this).balance >= _ethAmount);
        require(_success, "[WithdrawStake failure] - Insufficient ETH balance in contract");
        
        _success = (bananaStakes[_stakeholder] >= _bananaAmount);
        require(_success, "[WithdrawStake failure] - Insufficient Banana stake");
        
        _success = (ethStakes[_stakeholder] >= _ethAmount);
        require(_success, "[WithdrawStake failure] - Insufficient ETH stake");
        
        uint256 _bananaBalanceAfterWithdrawal = SafeMath.sub(_bananaBalanceOfContract, _bananaAmount);
        _success = (_bananaBalanceAfterWithdrawal >= harvestReserve);
        require(_success, "[WithdrawStake failure] - Withdrawal causing deduction of harvest reserve");
        
        _success = BananaInstance.transfer(_stakeholder, _bananaAmount);
        require(_success, "[WithdrawStake failure] - Banana not being transferred to stakeholder's balance");
        
        _stakeholder.transfer(_ethAmount);

        // Subtract Banana stakes of stakeholder
        bananaStakes[_stakeholder] = SafeMath.sub(bananaStakes[_stakeholder], _bananaAmount);
        bananaTotalStakes = SafeMath.sub(bananaTotalStakes, _bananaAmount);
        
        // Subtract ETH stakes of stakeholder
        ethStakes[_stakeholder] = SafeMath.sub(ethStakes[_stakeholder], _ethAmount);
        ethTotalStakes = SafeMath.sub(ethTotalStakes, _ethAmount);

        if (bananaStakes[_stakeholder] <= 0 && ethStakes[_stakeholder] <= 0) {
            removeStakeholder(_stakeholder);
        }

        emit WithdrawStake(_stakeholder, _bananaAmount, _ethAmount);
        
        return _success;
    }
    
    function harvestInterest(address _stakeholder, uint256 _amount) public returns (bool _success) {
        uint256 _balanceOfContract = BananaInstance.balanceOf(address(this));
        _success = (_balanceOfContract >= _amount);
        require(_success, "[HarvestInterest failure] - Insufficient balance in BananaLP contract");

        _success = (_amount > 0);
        require(_success, "[HarvestInterest failure] - Cannot harvest 0 Banana");

        (bool _isStakeholder, uint256 _s) = isStakeholder(_stakeholder);
        _success = _isStakeholder;
        require(_success, "[HarvestInterest failure] - Requester is not our stakeholder");
        
        _success = (harvestReserve >= _amount);
        require(_success, "[HarvestInterest failure] - Insufficient harvest reserve");

        _success = BananaInstance.transfer(_stakeholder, _amount);
        require(_success, "[HarvestInterest failure] - Transfer failed");
        
        harvestReserve = SafeMath.sub(harvestReserve, _amount);

        emit HarvestInterest(_stakeholder, _amount);

        return _success;
    }
}