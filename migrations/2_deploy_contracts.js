const Minion = artifacts.require("./Minion.sol");
const ETH500Staking = artifacts.require("./ETH500Staking.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Minion, 10000);
  await deployer.deploy(ETH500Staking, Minion.address);
};
