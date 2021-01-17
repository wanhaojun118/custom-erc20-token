pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Compound500Staking {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    IERC20 public CompoundInstance;
    address CompoundAddress = 0xAab608d8e5908413ae780E6c15Fc5695f1f4620B;
    IERC20 public MinionInstance;
    address MinionAddress = 0x1f1402A0Ce2d989c881A3120F77434c352D02564;
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes; // Stakeholder's stake(s)
    uint256 public totalStakes;
    
    event AddStake(address sender, uint256 amount);
    event WithdrawStake(address receiver, uint256 amount);
    event HarvestInterest(address stakeholder, uint256 amount);
    
    constructor() public {
        CompoundInstance = ERC20(CompoundAddress);
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
    
    function stakeOf(address _stakeholder) public view returns (uint256) {
        return stakes[_stakeholder];
    }
    
    function addStake(address _stakeholder, uint256 _amount) public returns (bool _success) {
        _success = (_amount > 0);
        require(_success, "[AddStake failure] - Stake amount cannot be 0 when adding stake");
        
        _success = (CompoundInstance.transferFrom(_stakeholder, address(this), _amount));
        require(_success, "[AddStake failure] - Stake amount not being credited to contract balance");
        
        if (stakes[_stakeholder] == 0) {
            stakes[_stakeholder] =_amount; // Create new stake for sender
        }else{
            stakes[_stakeholder] = SafeMath.add(stakes[_stakeholder], _amount); // Add amount to existing stake
        }
        
        totalStakes = SafeMath.add(totalStakes, _amount);
        
        addStakeholder(_stakeholder);
        
        emit AddStake(_stakeholder, _amount);
        
        return _success;
    }
    
    function withdrawStake(address _stakeholder, uint256 _amount)
        public returns (bool _success)
    {
        _success = (stakes[_stakeholder] >= _amount);
        require(_success, "[WithdrawStake failure] - Insufficient stake");
        
        _success = (CompoundInstance.transfer(_stakeholder, _amount));
        require(_success, "[WithdrawStake failure] - Amount not being credited to stakeholder's balance");

        stakes[_stakeholder] = SafeMath.sub(stakes[_stakeholder], _amount);

        totalStakes = SafeMath.sub(totalStakes, _amount);

        if (stakes[_stakeholder] <= 0) {
            removeStakeholder(_stakeholder);
        }

        emit WithdrawStake(_stakeholder, _amount);
        
        return _success;
    }
    
    function harvestInterest(address _stakeholder, uint256 _amount) public returns (bool _success) {
        uint256 _balanceOfContract = MinionInstance.balanceOf(address(this));
        _success = (_balanceOfContract >= _amount);
        require(_success, "[HarvestInterest failure] - Insufficient balance in Compound500 staking pool");

        _success = (_amount > 0);
        require(_success, "[HarvestInterest failure] - Cannot harvest 0 COMP token");

        (bool _isStakeholder, uint256 _s) = isStakeholder(_stakeholder);
        _success = _isStakeholder;
        require(_success, "[HarvestInterest failure] - Requester is not our stakeholder");

        _success = MinionInstance.transfer(_stakeholder, _amount);
        require(_success, "[HarvestInterest failure] - Transfer failed on Compound contract");

        emit HarvestInterest(_stakeholder, _amount);

        return _success;
    }
}