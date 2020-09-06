const NewToken = artifacts.require("./NewToken.sol"); // reading token contract and assign to variable

module.exports = function (deployer) {
  deployer.deploy(NewToken, 1000000); // deploy new token's contract
};
