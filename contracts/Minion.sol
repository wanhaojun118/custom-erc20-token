pragma solidity ^0.5.0;

contract Minion {
    string public name = "Minion Token";
    string public symbol = "MIN";
    string public standard = "Minion Token v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(address _from, address _to, uint256 _value);

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool result)
    {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
