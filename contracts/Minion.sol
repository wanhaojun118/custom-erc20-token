pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract Minion is ERC20, ERC20Detailed {
    uint256 initialSupply = 100000000000000;
    
    constructor() ERC20Detailed("Minion", "MIN", 10) public {
        _mint(msg.sender, initialSupply);
    }
}