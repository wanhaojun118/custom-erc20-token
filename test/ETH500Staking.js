const ETH500Staking = artifacts.require("./ETH500Staking.sol");
var Web3 = require("web3");

contract("ETH500Staking", async accounts => {
    const weiToEth = 1000000000000000000;

    it("Should be able to add stake", async () => {
        const stakeAmount = 0.1 * weiToEth;
        let eth500Staking = await ETH500Staking.deployed();
        let receipt = await eth500Staking.addStake({ from: accounts[1], value: stakeAmount });
        let contractBalance = await web3.eth.getBalance(eth500Staking.address);
        let totalStakes = await eth500Staking.totalStakes();
        assert.equal(contractBalance, stakeAmount, "Wrong contract balance after staking");
        assert.equal(totalStakes, stakeAmount, "Wrong total stake amount after staking");
        assert.equal(receipt.logs.length, 1, "No event emitted");
        assert.equal(receipt.logs[0].event, "receivedEther", "Wrong event emitted");
    });
});