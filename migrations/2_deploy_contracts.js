/*** These contracts have been deployed ***/
// const Minion = artifacts.require("./Minion.sol");
// const USDT = artifacts.require("./USDT.sol");
// const ETH500Staking = artifacts.require("./ETH500Staking.sol");
// const USDT500Staking = artifacts.require("./USDT500Staking.sol");
// const Minion1000Staking = artifacts.require("./Minion1000Staking.sol");
// const Minion1500LP = artifacts.require("./Minion1500LP.sol");
// const Compound = artifacts.require("./Compound.sol");
// const Compound500Staking = artifacts.require("./Compound500Staking.sol");
// const Curve = artifacts.require("./Curve.sol");
// const Curve500Staking = artifacts.require("./Curve500Staking.sol");
/*** End: These contracts have been deployed ***/

// const Banana = artifacts.require("Banana.sol");
const BananaCrowdsaleFirst = artifacts.require("BananaCrowdsaleFirst.sol");
const BananaCrowdsaleSecond = artifacts.require("BananaCrowdsaleSecond.sol");

module.exports = async function (deployer) {
  /*** These contracts have been deployed ***/
  // await deployer.deploy(Minion);
  // await deployer.deploy(USDT);
  // await deployer.deploy(ETH500Staking, Minion.address);
  // await deployer.deploy(USDT500Staking, USDT.address, Minion.address);
  // await deployer.deploy(Compound);
  // await deployer.deploy(Compound500Staking, Compound.address);
  // await deployer.deploy(Curve);
  // await deployer.deploy(Curve500Staking, Curve.address);
  /*** End: These contracts have been deployed ***/
  const weiToBananaRate = 10;
  const myWallet = "0x65a4aA4832155FFf1BCFbb8774EADaF0572636f0";
  const bananaContractAddress = "0x1879CeA4f55999e6A2FAEdbCbe3E8d93dB9a3909";
  const openingTimeFirst = 1608442200;
  const closingTimeFirst = 1609084800;
  const openingTimeSecond = 1609084800;
  const closingTimeSecond = 1609689600;

  // await deployer.deploy(Banana);
  await deployer.deploy(BananaCrowdsaleFirst, weiToBananaRate, myWallet, bananaContractAddress, 
    myWallet, openingTimeFirst, closingTimeFirst, bananaContractAddress);
  await deployer.deploy(BananaCrowdsaleSecond, weiToBananaRate, myWallet, bananaContractAddress, 
    myWallet, openingTimeSecond, closingTimeSecond, bananaContractAddress);
};
