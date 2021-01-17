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

// const Banana = artifacts.require("Banana.sol");
// const BananaCrowdsaleFirst = artifacts.require("BananaCrowdsaleFirst.sol");
// const BananaCrowdsaleSecond = artifacts.require("BananaCrowdsaleSecond.sol");
// const Banana2500LP = artifacts.require("Banana2500LP.sol");
/*** End: These contracts have been deployed ***/

const BananaCrowdsaleApproval = artifacts.require("BananaCrowdsaleApproval.sol");

module.exports = async function (deployer) {
  /*** These contracts have been deployed ***/
  // await deployer.deploy(Minion);
  // await deployer.deploy(USDT);
  // await deployer.deploy(ETH500Staking);
  // await deployer.deploy(USDT500Staking);
  // await deployer.deploy(Minion1000Staking);
  // await deployer.deploy(Minion1500LP);
  // await deployer.deploy(Compound);
  // await deployer.deploy(Compound500Staking);
  // await deployer.deploy(Curve);
  // await deployer.deploy(Curve500Staking);

  // const weiToBananaRate = 1;
  // const myWallet = "0x65a4aA4832155FFf1BCFbb8774EADaF0572636f0";
  // const openingTimeFirst = 1610181300;
  // const closingTimeFirst = 1610899200;
  // const openingTimeSecond = 1610899200;
  // const closingTimeSecond = 1611504000;

  // await deployer.deploy(Banana);
  // await deployer.deploy(BananaCrowdsaleFirst, weiToBananaRate, myWallet, Banana.address, 
  //   myWallet, openingTimeFirst, closingTimeFirst, Banana.address);
  // await deployer.deploy(BananaCrowdsaleSecond, weiToBananaRate, myWallet, Banana.address, 
  //   myWallet, openingTimeSecond, closingTimeSecond, Banana.address);
  // await deployer.deploy(Banana2500LP, "0xcaC50A89493dD922bf349d54EF7C909db8Fff9AB");
  /*** End: These contracts have been deployed ***/

  await deployer.deploy(BananaCrowdsaleApproval, "0x65a4aA4832155FFf1BCFbb8774EADaF0572636f0");
};
