pragma solidity ^0.5.0;

import "./Minion.sol";
import "@openzeppelin/contracts/math/SafeMath.sol"; // Import for SafeMath purpose
import "@nomiclabs/buidler/console.sol";

contract ETH500Staking {
    using SafeMath for uint256;

    Minion public minionContract;
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes; // Stakeholder's stake(s)
    uint256 public totalStakes;

    address owner;
    // mapping(address => uint256) internal rewards; // Stakeholder's reward(s)
    // uint256 internal totalRewards;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event AddStake(address sender, uint256 amount);
    event WithdrawStake(address receiver, uint256 amount);
    event SendReward(address stakeholder, uint256 amount);

    constructor(Minion _minionContract) public {
        minionContract = _minionContract; // Assign minion contract

        owner = msg.sender; // Set owner of the contract
    }

    function isStakeholder(address _address)
        public
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
        require(stakes[msg.sender] == 0); // Make sure the user has no stake record

        if (stakes[msg.sender] == 0) addStakeholder(msg.sender); // Add stakeholder to stakeholders list
        stakes[msg.sender] = SafeMath.add(stakes[msg.sender], msg.value); // Add stake value

        totalStakes = SafeMath.add(totalStakes, stakes[msg.sender]); // Add stake amount to total stakes

        emit AddStake(msg.sender, msg.value);
    }

    function withdrawStake(address payable _stakeholder, uint256 _amount)
        public
        returns (bool result)
    {
        require(
            stakes[_stakeholder] >= _amount,
            "Insufficient stake on stake withdrawal"
        );

        _stakeholder.transfer(_amount);

        stakes[_stakeholder] -= _amount;

        if (stakes[_stakeholder] <= 0) {
            removeStakeholder(_stakeholder);
        }

        emit WithdrawStake(_stakeholder, _amount);

        return true;
    }

    // For admin to clear stake
    function clearStake() public returns (bool result) {
        require(stakes[msg.sender] > 0); // Make sure stakeholder has stake

        stakes[msg.sender] = SafeMath.sub(
            stakes[msg.sender],
            stakes[msg.sender]
        );
        if (stakes[msg.sender] == 0) removeStakeholder(msg.sender);

        return true;
    }

    function sendReward(address _stakeholder, uint256 _amount)
        public
        returns (bool result)
    {
        require(_amount > 0, "Invalid amount on sendReward");

        require(minionContract.transfer(_stakeholder, _amount));

        emit SendReward(_stakeholder, _amount);

        return true;
    }

    // function distributeRewards() public onlyOwner returns (bool result) {
    //     require(stakeholders.length > 0, "No stakeholder found");

    //     for (uint256 s = 0; s < stakeholders.length; s += 1) {
    //         uint256 proportional = SafeMath.div(
    //             stakes[stakeholders[s]],
    //             totalStakes
    //         );

    //         uint256 _reward = SafeMath.mul(_proportional, 10);

    //         if (_reward > 0) minionContract.transfer(stakeholders[s], _reward);
    //     }

    //     return result;
    // }

    // function totalStakes() public view returns (uint256) {
    //     uint256 _totalStakes = 0;
    //     for (uint256 s = 0; s < stakeholders.length; s += 1) {
    //         _totalStakes = add(_totalStakes, stakes[stakeholders[s]]); // Using openzeppelin/SafeMath "add" function
    //     }

    //     return _totalStakes;
    // }

    // function rewardOf(address _stakeholder) public view returns (uint256) {
    //     uint256 _totalStakes = totalStakes();
    //     uint256 _stakeholdersCount = stakesholder.length;

    //     rewards[_stakeholder] = div(_stakeholdersCount, _totalStakes); // Reward of stakeholder = number of stakeholders / total stakes

    //     require(rewards[_stakeholder] > 0);

    //     return rewards[_stakeholder];
    // }

    // function totalRewards() public view returns (uint256) {
    //     uint256 _totalRewards = 0;
    //     for (uint256 s = 0; s < stakeholders.length; s += 1) {
    //         _totalRewards = _totalRewards.add(rewards[stakeholders[s]]);
    //     }

    //     return _totalRewards;
    // }

    // function compoudRewards() public returns (bool result) {
    //     uint256 _totalRewards = totalRewards();

    //     require(_totalRewards > 0);

    //     uint256 _interest = mul(_totalRewards, 10);

    //     uint256 compoundedRewards = add(_totalRewards, _interest);
    // }
}
