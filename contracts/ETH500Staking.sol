pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract ETH500Staking {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address MinionAddress = 0x1f1402A0Ce2d989c881A3120F77434c352D02564;
    IERC20 public MinionInstance;
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes; // Stakeholder's stake(s)
    uint256 public totalStakes;

    event AddStake(address sender, uint256 amount);
    event WithdrawStake(address receiver, uint256 amount);
    event HarvestInterest(address stakeholder, uint256 amount);

    constructor() public {
        MinionInstance = ERC20(MinionAddress); // Assign minion contract
    }

    // To check if address is one of the stakeholders
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

    // To add stakeholder if @param _stakeholder is not one
    function addStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) stakeholders.push(_stakeholder);
    }

    // To remove a stakeholder if @param _stakeholder is one
    function removeStakeholder(address _stakeholder) internal {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if (_isStakeholder) {
            // Replace the current found stakeholder with the last stakeholder
            stakeholders[s] = stakeholders[stakeholders.length - 1];

            // Remove the last stakeholder
            stakeholders.pop();
        }
    }

    // Get stakeholder list
    function getStakeholders()
        public
        view
        returns (address[] memory _stakeholders)
    {
        _stakeholders = stakeholders;
        return _stakeholders;
    }

    // To retrieve the stake of specific stakeholder
    function stakeOf(address _stakeholder) public view returns (uint256) {
        return stakes[_stakeholder];
    }

    // For user to deposit stake
    function addStake() public payable {
        require(msg.value > 0, "Stake amount cannot be 0 when adding stake");

        if (stakes[msg.sender] == 0) {
            stakes[msg.sender] = msg.value; // Create new stake for sender
        }else{
            stakes[msg.sender] = SafeMath.add(stakes[msg.sender], msg.value); // Add amount to existing stake
        }

        totalStakes = SafeMath.add(totalStakes, msg.value); // Add stake amount to total stakes

        addStakeholder(msg.sender); // Add stakeholder to stakeholders list

        emit AddStake(msg.sender, msg.value);
    }

    // To withdraw stakeholder's stake in ETH
    function withdrawStake(address payable _stakeholder, uint256 _amount)
        public
        returns (bool _success)
    {
        _success = (stakes[_stakeholder] >= _amount);
        require(_success, "Insufficient stake on stake withdrawal");

        _stakeholder.transfer(_amount);

        stakes[_stakeholder] = SafeMath.sub(stakes[_stakeholder], _amount);

        totalStakes = SafeMath.sub(totalStakes, _amount);

        if (stakes[_stakeholder] <= 0) {
            removeStakeholder(_stakeholder);
        }

        emit WithdrawStake(_stakeholder, _amount);

        return _success;
    }

    // To harvest interest
    function harvestInterest(address _stakeholder, uint256 _amount) public returns (bool _success) {
        uint256 _balanceOfContract = MinionInstance.balanceOf(address(this));
        _success = (_balanceOfContract >= _amount);
        require(_success, "Insufficient amount in ETH500 staking pool");

        _success = (_amount > 0);
        require(_success, "Invalid amount on harvesting interest");

        (bool _isStakeholder, uint256 _s) = isStakeholder(_stakeholder);
        _success = _isStakeholder;
        require(_success, "Requester is not our stakeholder");

        _success = MinionInstance.transfer(_stakeholder, _amount);
        require(_success, "Transfer failed on Minion contract");

        emit HarvestInterest(_stakeholder, _amount);

        return _success;
    }
}
