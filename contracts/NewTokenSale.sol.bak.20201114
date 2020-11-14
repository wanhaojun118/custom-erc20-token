pragma solidity ^0.5.0;

import "./NewToken.sol";

contract NewTokenSale {
    address admin; // Not using "public" to prevent admin's address exposing
    NewToken public tokenContract; // Set tokenContract function for test use
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(NewToken _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender;

        // Assign token contract
        tokenContract = _tokenContract;

        // Set token price
        tokenPrice = _tokenPrice;
    }

    // Multiply library, referenced from external library "ds-math" https://github.com/dapphub/ds-math
    // Keyword "internal" to only allows the internal calling in this contract
    // Keyword "pure" to ensure this is a pure function without writing transaction to blockchain
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // Buy tokens
    // The "payable" function will allow this contract to receive ether, and also will store the value in msg.value
    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        // Require that the contract has enough tokens
        // Keyword "this" refers to this contract
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // Require that a transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Keep track of token sold
        tokenSold += _numberOfTokens;

        // Trigger sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // Ending token sale
    function endSale() public {
        // Require admin to do this
        require(msg.sender == admin);

        // Transfer remaining tokens back to admin
        // Keyword "this" refers to this contract
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            )
        );

        // Disable this contract and send the remaining balance to admin
        selfdestruct(msg.sender);
    }
}
