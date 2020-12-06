/*** These contracts have been deployed ***/
// const Minion = artifacts.require("./Minion.sol");
// const USDT = artifacts.require("./USDT.sol");
// const ETH500Staking = artifacts.require("./ETH500Staking.sol");
// const USDT500Staking = artifacts.require("./USDT500Staking.sol");
// const Minion1000Staking = artifacts.require("./Minion1000Staking.sol");
// const Minion1500LP = artifacts.require("./Minion1500LP.sol");
/*** End: These contracts have been deployed ***/

const Compound = artifacts.require("./Compound.sol");
const Compound500Staking = artifacts.require("./Compound500Staking.sol");

const Curve = artifacts.require("./Curve.sol");
const Curve500Staking = artifacts.require("./Curve500Staking.sol");

module.exports = async function (deployer) {
  /*** These contracts have been deployed ***/
  // await deployer.deploy(Minion);
  // await deployer.deploy(USDT);
  // await deployer.deploy(ETH500Staking, Minion.address);
  // await deployer.deploy(USDT500Staking, USDT.address, Minion.address);
  /*** End: These contracts have been deployed ***/
  
  await deployer.deploy(Compound);
  await deployer.deploy(Compound500Staking, Compound.address);

  await deployer.deploy(Curve);
  await deployer.deploy(Curve500Staking, Curve.address);
};
