const NewToken = artifacts.require("./NewToken.sol"); // reading token contract and assign to variable

module.exports = function (deployer) {
  deployer.deploy(NewToken); // deploy new token's contract
};
