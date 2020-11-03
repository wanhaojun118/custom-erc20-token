pragma solidity ^0.5.0;

import "./Minion.sol";
import "@openzeppelin/contracts/math/SafeMath.sol"; // Import for SafeMath purpose
import "@nomiclabs/buidler/console.sol";

contract ETH500Staking {
    using SafeMath for uint256;

    Minion public minionContract;
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes; // Stakeholder's stake(s)
    mapping(address => uint256) internal lastRewardSentTime;
    uint256 internal minimumInterval = 86370000; // Minimum interval = 86370 sec (~ a day)
    uint256 public totalStakes;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event AddStake(address sender, uint256 amount);
    event WithdrawStake(address receiver, uint256 amount);
    event HarvestInterest(address stakeholder, uint256 amount);
    // event SendReward(
    //     address stakeholder,
    //     uint256 amount,
    //     uint256 lastRewardSentTime,
    //     bool result
    // );

    constructor(Minion _minionContract) public {
        minionContract = _minionContract; // Assign minion contract

        owner = msg.sender; // Set owner of the contract
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

        stakes[_stakeholder] -= _amount;

        totalStakes -= _amount;

        if (stakes[_stakeholder] <= 0) {
            removeStakeholder(_stakeholder);
        }

        emit WithdrawStake(_stakeholder, _amount);

        return _success;
    }

    // To harvest interest
    function harvestInterest(address _stakeholder, uint256 _amount) public returns (bool _success) {
        uint256 _balanceOfContract = minionContract.balanceOf(address(this));
        _success = (_balanceOfContract >= _amount);
        require(_success, "Insufficient amount in ETH500 staking pool");

        _success = (_amount > 0);
        require(_success, "Invalid amount on harvesting interest");

        (bool _isStakeholder, uint256 _s) = isStakeholder(_stakeholder);
        _success = _isStakeholder;
        require(_success, "Requester is not our stakeholder");

        _success = minionContract.transfer(_stakeholder, _amount);
        require(_success, "Transfer failed on Minion contract");

        emit HarvestInterest(_stakeholder, _amount);

        return _success;
    }

    // To send reward to stakeholder
    // function sendReward(
    //     address _stakeholder,
    //     uint256 _amount,
    //     uint256 _currentTime
    // ) public {
    //     require(_amount > 0, "Invalid amount on sendReward");

    //     if (lastRewardSentTime[_stakeholder] == 0) {
    //         lastRewardSentTime[_stakeholder] = _currentTime;

    //         require(minionContract.transfer(_stakeholder, _amount));

    //         bool _result = true;

    //         emit SendReward(
    //             _stakeholder,
    //             _amount,
    //             lastRewardSentTime[_stakeholder],
    //             _result
    //         );
    //     } else {
    //         uint256 _interval = _currentTime - lastRewardSentTime[_stakeholder];
    //         require(
    //             _interval > minimumInterval,
    //             "Interval between last sent is too close"
    //         );

    //         lastRewardSentTime[_stakeholder] = _currentTime;

    //         require(minionContract.transfer(_stakeholder, _amount));

    //         bool _result = true;

    //         emit SendReward(
    //             _stakeholder,
    //             _amount,
    //             lastRewardSentTime[_stakeholder],
    //             _result
    //         );
    //     }
    // }
}
