pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract Banana is ERC20, ERC20Detailed {
    uint256 internal initialSupply = 90000000000000000000000000;
    address internal owner;
    
    constructor() ERC20Detailed("Banana", "BNANA", 19) public {
        _mint(msg.sender, initialSupply);
    }
    
    function burnFrom(address _owner, uint256 _amount) external {
        _burnFrom(_owner, _amount);
    }
}