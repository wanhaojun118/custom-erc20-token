const Minion = artifacts.require("./Minion.sol");
const USDT = artifacts.require("./USDT.sol");
const ETH500Staking = artifacts.require("./ETH500Staking.sol");
const USDT500Staking = artifacts.require("./USDT500Staking.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Minion);
  await deployer.deploy(USDT);
  await deployer.deploy(ETH500Staking, Minion.address);
  await deployer.deploy(USDT500Staking, USDT.address, Minion.address);
};
