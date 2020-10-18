const ETH500Staking = artifacts.require("./ETH500Staking.sol");
var Web3 = require("web3");

contract("ETH500Staking", async accounts => {
    const weiToEth = 1000000000000000000;
    const stakeholder = accounts[2];

    it("Should be able to add stake", async () => {
        const stakeAmount = 0.1 * weiToEth;

        let eth500Staking = await ETH500Staking.deployed();
        let receipt = await eth500Staking.addStake({ from: stakeholder, value: stakeAmount });
        let contractBalance = await web3.eth.getBalance(eth500Staking.address);
        let totalStakes = await eth500Staking.totalStakes();
        let stakeOfUser = await eth500Staking.stakeOf(stakeholder);

        assert.equal(contractBalance, stakeAmount, "Wrong contract balance after staking");
        assert.equal(totalStakes, stakeAmount, "Wrong total stake amount after staking");
        assert.equal(receipt.logs.length, 1, "No event emitted");
        assert.equal(receipt.logs[0].event, "receivedEther", "Wrong event emitted");
        assert.equal(stakeOfUser, stakeAmount, "Wrong stakeholder's stake amount");
    });

    it("Get stakeholder's address", async () => {
        let eth500Staking = await ETH500Staking.deployed();
        const stakeholderList = await eth500Staking.getStakeholders();

        assert(stakeholderList.length > 0, "Missing stakeholder list");
        assert(stakeholderList[0], stakeholder, "Wrong stakeholder recorded");
    });

    it("Withdraw stake", async () => {
        let receipt;
        let eth500Staking = await ETH500Staking.deployed();
        const stake = await eth500Staking.stakeOf(stakeholder);
        let balanceOfStakeholder = await web3.eth.getBalance(stakeholder);
        console.log("stake: ", Web3.utils.fromWei(stake.toString(), "ether"));
        console.log("balance before withdraw: ", Web3.utils.fromWei(balanceOfStakeholder.toString(), "ether"));

        if (stake > 0) {
            receipt = await eth500Staking.withdrawStake(stakeholder, stake);
            console.log("receipt: ", receipt);
        }

        if (receipt) {
            const stakeholderList = await eth500Staking.getStakeholders();
            console.log("stakeholder list: ", stakeholderList);
        }

        balanceOfStakeholder = await web3.eth.getBalance(stakeholder);
        console.log("balance after withdraw: ", Web3.utils.fromWei(balanceOfStakeholder.toString(), "ether"));
    });
});