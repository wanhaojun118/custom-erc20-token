pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Banana.sol";

contract BananaCrowdsaleSecond is Crowdsale, AllowanceCrowdsale, TimedCrowdsale, FinalizableCrowdsale {
    using SafeERC20 for IERC20;
    address internal owner;
    Banana internal bananaInstance;
    
    constructor (
        uint256 _rate,
        address payable _wallet,
        IERC20 _token,
        address _tokenWallet,
        uint256 _openingTime,
        uint256 _closingTime,
        Banana _bananaInstance
    )
        AllowanceCrowdsale(_tokenWallet)
        TimedCrowdsale(_openingTime, _closingTime)
        Crowdsale(_rate, _wallet, _token)
        public
    {
        owner = _wallet;
        
        bananaInstance = _bananaInstance;
    }
    
    function _finalization() internal {
        super._finalization();
        
        uint256 _remainingTokens = this.remainingTokens();
        
        if(_remainingTokens > 0) {
            bananaInstance.burnFrom(owner, _remainingTokens);
        }
    }
}