const MinionToken = artifacts.require("./Minion.sol");
let minionDecimals;

contract("Minion", async accounts => {
    it("Should put 10,000 Minion in the first account", async () => {
        let tokenInstance = await MinionToken.deployed();
        minionDecimals = await tokenInstance.decimals();
        let balance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(parseInt(balance), 10000 * Math.pow(10, minionDecimals));
    });

    it("Should initialize with the correct name", async () => {
        let tokenInstance = await MinionToken.deployed();
        let tokenName = await tokenInstance.name();
        assert.equal(tokenName, "Minion Token");
    });

    it("Should initialize with the correct symbol", async () => {
        let tokenInstance = await MinionToken.deployed();
        let tokenSymbol = await tokenInstance.symbol();
        assert.equal(tokenSymbol, "MIN");
    });

    it("Should initialize with the correct standard", async () => {
        let tokenInstance = await MinionToken.deployed();
        let tokenStandard = await tokenInstance.standard();
        assert.equal(tokenStandard, "Minion Token v1.0");
    });

    it("Should initialize with the correct initial supply value", async () => {
        let tokenInstance = await MinionToken.deployed();
        let tokenInitialSupply = await tokenInstance.totalSupply();
        assert.equal(tokenInitialSupply.toNumber(), 10000 * Math.pow(10, minionDecimals));
    });

    it("Should reject transaction if sender does not has sufficient fund", async () => {
        let tokenInstance = await MinionToken.deployed();
        try {
            await tokenInstance.transfer.call(accounts[1], 20000, { from: accounts[0] });
        } catch (error) {
            assert(error.message.indexOf("revert") >= 0, "No 'revert' keyword in error message");
        }
    });

    it("Sender and receiver should have correct token amount after transferring token", async () => {
        let tokenInstance = await MinionToken.deployed();
        const transferAmount = 10 * Math.pow(10, minionDecimals);
        await tokenInstance.transfer(accounts[1], transferAmount, { from: accounts[0] });
        let balanceOfSender = await tokenInstance.balanceOf(accounts[0]);
        let balanceOfReceiver = await tokenInstance.balanceOf(accounts[1]);
        assert.equal(parseInt(balanceOfSender), 9990 * Math.pow(10, minionDecimals));
        assert.equal(parseInt(balanceOfReceiver), 10 * Math.pow(10, minionDecimals));
    });

    it("Transaction should emit correct event", async () => {
        let tokenInstance = await MinionToken.deployed();
        let receipt = await tokenInstance.transfer(accounts[1], 200, { from: accounts[0] });
        assert.equal(receipt.logs.length, 1, "Should emit 1 event");
        assert.equal(receipt.logs[0].event, "Transfer", "Should emit 'Transfer' event");
        assert.equal(receipt.logs[0].args._from, accounts[0], `Sender should be ${accounts[0]}`);
        assert.equal(receipt.logs[0].args._to, accounts[1], `Receiver should be ${accounts[1]}`);
        assert.equal(receipt.logs[0].args._value.toNumber(), 200, "Value should be 200");
    });
});