const ETH500Staking = artifacts.require("./ETH500Staking.sol");
const Minion = artifacts.require("./Minion.sol");
var Web3 = require("web3");

contract("ETH500Staking", async accounts => {
    const weiToEth = 1000000000000000000;
    let minionDecimals;
    const owner = accounts[0];
    const stakeholder = accounts[2];
    const stakeholder_2 = accounts[3];
    const stakeholder_3 = accounts[4];
    const dailyDistribution = 10;

    contract("Minion", async () => {
        it("Transfer minion to ETH 500 staking contract", async () => {
            let eth500Staking = await ETH500Staking.deployed();
            let minion = await Minion.deployed();

            minionDecimals = await minion.decimals();
            await minion.transfer(eth500Staking.address, 500 * Math.pow(10, minionDecimals), { from: owner });
            let balanceOfSender = await minion.balanceOf(owner);
            let balanceOfStakingContract = await minion.balanceOf(eth500Staking.address);

            assert.equal(parseInt(balanceOfSender), 9500 * Math.pow(10, minionDecimals));
            assert.equal(parseInt(balanceOfStakingContract), 500 * Math.pow(10, minionDecimals));
        });

        it("Should be able to add stake", async () => {
            let eth500Staking = await ETH500Staking.deployed();
            const stakeAmount = 1 * weiToEth;
            let receipt = await eth500Staking.addStake({ from: stakeholder, value: stakeAmount });
            let receipt_2 = await eth500Staking.addStake({ from: stakeholder_2, value: stakeAmount });
            let receipt_3 = await eth500Staking.addStake({ from: stakeholder_3, value: stakeAmount });
            let contractBalance = await web3.eth.getBalance(eth500Staking.address);
            let totalStakes = await eth500Staking.totalStakes();
            let stakeOfUser = await eth500Staking.stakeOf(stakeholder);

            assert.equal(contractBalance, stakeAmount * 3, "Wrong contract balance after staking");
            assert.equal(parseInt(totalStakes), stakeAmount * 3, "Wrong total stake amount after staking");
            assert.equal(receipt.logs.length, 1, "No event emitted");
            assert.equal(receipt.logs[0].event, "AddStake", "Wrong event emitted");
            assert.equal(parseInt(stakeOfUser), stakeAmount, "Wrong stakeholder's stake amount");
        });

        it("Get stakeholder's address", async () => {
            let eth500Staking = await ETH500Staking.deployed();
            const stakeholderList = await eth500Staking.getStakeholders();

            assert(stakeholderList.length > 0, "Missing stakeholder list");
            assert(stakeholderList[0], stakeholder, "Wrong stakeholder recorded");
        });

        it("Send reward", async () => {
            let eth500Staking = await ETH500Staking.deployed();
            let minion = await Minion.deployed();
            const stakeholderList = await eth500Staking.getStakeholders();
            let balanceOfStakingContract = await minion.balanceOf(eth500Staking.address);
            let totalStakes = await eth500Staking.totalStakes();

            // console.log("balance of ETH500 staking contract: ", parseInt(balanceOfStakingContract));
            // console.log("stakeholder list: ", stakeholderList);
            // console.log("total stakes: ", parseInt(totalStakes));

            if (stakeholderList.length > 0) {
                for (let stakeholder of stakeholderList) {

                    let stake = await eth500Staking.stakeOf(stakeholder);
                    if (parseInt(stake) > 0) {
                        const currentTime = new Date().getTime();
                        const proportional = stake / parseFloat(totalStakes);
                        const reward = proportional * dailyDistribution;
                        const rewardInMinion = reward.toFixed(2) * Math.pow(10, minionDecimals);
                        let receipt = await eth500Staking.sendReward(stakeholder, rewardInMinion, currentTime);


                        if (receipt) {
                            // console.log("receipt last reward sent time: ", parseInt(receipt.logs[0].args.lastRewardSentTime));
                            // console.log("receipt result: ", receipt.logs[0].args.result);

                            // const lastRewardSentTime = await eth500Staking.lastRewardSentTime(stakeholder);
                            // let resend = await eth500Staking.sendReward(stakeholder, rewardInMinion, new Date().getTime());
                            // console.log("resend result: ", resend);

                            // console.log(`${stakeholder}'s last reward sent time: `, parseInt(lastRewardSentTime));
                            assert.equal(receipt.logs.length, 1, "Send reward not emitting event");
                            assert.equal(receipt.logs[0].event, "SendReward", `Send reward emitting wrong event: ${receipt.logs[0].event}`);
                            assert.equal(receipt.logs[0].args.stakeholder, stakeholder, `Stake withdrawal to wrong address: ${receipt.logs[0].args.receiver}`);
                            assert.equal(parseInt(receipt.logs[0].args.amount), rewardInMinion, `Stake withdrawal with wrong amount: ${parseInt(receipt.logs[0].args.amount)}`);
                            assert.equal(parseInt(receipt.logs[0].args.lastRewardSentTime), currentTime, `Stake withdrawal with wrong last reward sent time: ${parseInt(receipt.logs[0].args.lastRewardSentTime)}`);
                            assert.equal(receipt.logs[0].args.result, true, `Stake withdrawal with wrong result returned: ${parseInt(receipt.logs[0].args.result)}`);
                        }
                    }
                }

                balanceOfStakingContract = await minion.balanceOf(eth500Staking.address);
                // console.log("contract balance: ", parseInt(balanceOfStakingContract));
            }
        });

        it("Withdraw stake", async () => {
            let eth500Staking = await ETH500Staking.deployed();
            let receipt;
            let stakeBeforeWithdrawal = await eth500Staking.stakeOf(stakeholder);

            if (parseInt(stakeBeforeWithdrawal) > 0) {
                receipt = await eth500Staking.withdrawStake(stakeholder, stakeBeforeWithdrawal.toString());
            }

            if (receipt) {
                // Validating list of stakeholder
                const stakeholderList = await eth500Staking.getStakeholders();
                stakeAfterWithdrawal = await eth500Staking.stakeOf(stakeholder);

                // Event related
                assert.equal(receipt.logs.length, 1, "Stake withdrawal not emitting event");
                assert.equal(receipt.logs[0].event, "WithdrawStake", `Stake withdrawal emitting wrong event: ${receipt.logs[0].event}`);
                assert.equal(receipt.logs[0].args.receiver, stakeholder, `Stake withdrawal to wrong address: ${receipt.logs[0].args.receiver}`);
                assert.equal(parseInt(receipt.logs[0].args.amount), parseInt(stakeBeforeWithdrawal), `Stake withdrawal with wrong amount: ${parseInt(receipt.logs[0].args.amount)}`);

                // Stakeholder's details related
                assert.equal(stakeholderList.length, 2, "Stakeholder not being removed from list after withdrawing all stakes");
                assert.equal(parseInt(stakeAfterWithdrawal), "0", "Stakeholder's stake not being cleared after withdrawal all of it");
            }
        });
    });
});