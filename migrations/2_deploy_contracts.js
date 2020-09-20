const NewToken = artifacts.require("./NewToken.sol"); // reading token contract and assign to variable
const NewTokenSale = artifacts.require("./NewTokenSale.sol"); // reading token sale contract

module.exports = function (deployer) {
  // deploy token contract
  deployer.deploy(NewToken, 1000000).then(function () {
    const tokenPrice = 1000000000000000; // 0.001 Ether

    // deploy token sale contract using token contract's address
    return deployer.deploy(NewTokenSale, NewToken.address, tokenPrice);
  });
};
