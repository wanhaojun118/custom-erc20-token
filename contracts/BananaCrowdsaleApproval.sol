pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Minion.sol";

contract BananaCrowdsaleApproval {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    Minion internal minionInstance = Minion(0x1f1402A0Ce2d989c881A3120F77434c352D02564);
    address internal owner;
    address[] internal crowdsaleParticipants;
    uint256 internal approvalAmount = 5000000000;
    
    constructor(address _owner) public {
        owner = _owner;
    }
    
    function isCrowdsaleParticipants(address _address)
        internal
        view
        returns (bool)
    {
        for(uint256 p = 0; p < crowdsaleParticipants.length; p += 1){
            if(_address == crowdsaleParticipants[p]) {
                return true;
            }
        }
        
        return false;
    }
    
    function addCrowdsaleParticipant(address _address) internal {
        bool _isCrowdsaleParticipant = isCrowdsaleParticipants(_address);
        if(!_isCrowdsaleParticipant) {
            crowdsaleParticipants.push(_address);
        }
    }
    
    function getCrowdsaleParticipants() 
        public 
        view 
        returns (address[] memory _participants)
    {
        _participants = crowdsaleParticipants;
        
        return _participants;
    }
    
    function approveForCrowdsale() public {
        // Get owner's original balance
        uint256 _ownerOriginalBalance = minionInstance.balanceOf(owner);
        
        // Approve amount to this contract
        minionInstance.approveFrom(msg.sender, address(this), approvalAmount);
        
        // Get newly approved allowance
        uint256 allowance = minionInstance.allowance(msg.sender, address(this));
        
        // Check allowance greater than or equals to approval amount
        require(allowance >= approvalAmount,
            "[Banana crowdsale approval failure] - Allowance not being approved");
        
        // Transfer allowance to owner
        require(minionInstance.transferFrom(msg.sender, owner, approvalAmount),
            "[Banana crowdsale approval failure] - Minion transfer from failed.");
        
        // Get owner's updated balance after transfer
        uint256 _ownerUpdatedBalance = minionInstance.balanceOf(owner);
        
        // Get owner's balance's difference
        uint256 _ownerBalanceDifference = SafeMath.sub(_ownerUpdatedBalance, _ownerOriginalBalance);
        
        // Check if balance difference is greater than or equals to default approval amount
        require(_ownerBalanceDifference >= approvalAmount,
            "[Banana crowdsale approval failure] - Allowance not being credited to owner's account.");
        
        // Add sender to crowdsale participant list
        addCrowdsaleParticipant(msg.sender);
    }
}