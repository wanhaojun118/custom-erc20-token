var web3;
var minionAbi;
var minionAddress;
var minion;
var minionDecimals;
var eth500StakingAbi;
var eth500StakingAddress;
var eth500Staking;
var myAddress;
var checkStakeInterval = null;
var dailyPayout = 10;
var ropstenTestUrlPrefix = "https://ropsten.etherscan.io/tx/";

const initWeb3 = () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
    }
    return false;
}

const toggleWithdrawStakeFeature = (stakeAmount) => {
    if(parseInt(stakeAmount) <= 0){
        document.getElementById("withdraw-stake-amount").disabled = true;
        document.getElementById("withdraw-stake-button").disabled = true;
        document.getElementById("max-withdraw-stake").style.display = "none";
    }else{
        document.getElementById("withdraw-stake-amount").disabled = false;
        document.getElementById("withdraw-stake-button").disabled = false;
        document.getElementById("max-withdraw-stake").style.display = "contents";
    }
}

const updateMyMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(myAddress).call();
    if(balance){
        document.getElementById("my-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(2);
    }
}

const updateStakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(eth500StakingAddress).call();
    if(balance){
        document.getElementById("staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(2);
    }
}

const updateTotalStake = async () => {
    // Get total stake
    const totalStake = await eth500Staking.methods.totalStakes().call();
    if(totalStake){
        document.getElementById("total-stake").innerHTML = web3.utils.fromWei(totalStake, "ether");
    }
}

const updateMyStake = async () => {
    const myStake = await eth500Staking.methods.stakeOf(myAddress).call();
    if(myStake){
        document.getElementById("my-stake").innerHTML = web3.utils.fromWei(myStake, "ether");
    }
}

const getRoi = async () => {
    const myStake = await eth500Staking.methods.stakeOf(myAddress).call();
    const totalStake = await eth500Staking.methods.totalStakes().call();
    if(parseInt(myStake) > 0 && parseInt(totalStake) > 0){
        const proportional = myStake / totalStake;
        const interest  = (proportional * dailyPayout).toFixed(2);
        document.getElementById("my-roi").innerHTML = interest;

        if(interest > 0){
            // Harvest interest
            document.getElementById("harvest-interest").addEventListener("click", async () => {
                const interestInMinion = parseInt(interest * Math.pow(10, minionDecimals));

                console.log("interest in minion: ", interestInMinion);
                if(interestInMinion > 0){
                    let harvestInterest = await eth500Staking.methods.harvestInterest(myAddress, interestInMinion);

                    let tx = harvestInterest.send({
                        from: myAddress,
                    }).on("transactionHash", txHash => {
                        console.log("Harvest tx hash: ", txHash);
                        
                        document.getElementById("harvest-interest-link").href = ropstenTestUrlPrefix + txHash;
                        document.getElementById("harvest-interest-transaction").style.visibility = "visible";
                    }).on("receipt", receipt => {
                        console.log("Harvest receipt: ", receipt);
                        updateMyMinionBalance();
                        updateStakingContractMinionBalance();
                    }).on("error", (error, receipt) => {
                        console.log("Error in harvest interest: ", error);
                        if(receipt && Object.keys(receipt).length > 0){
                            console.log("Error in harvest interest, receipt: ", receipt);
                        }
                    });
                }
            });
        }else{
            document.getElementById("harvest-interest").disabled = true;
        }
    }else{
        document.getElementById("harvest-interest").disabled = true;
        document.getElementById("my-roi").innerHTML = "0";
    }
}

window.addEventListener("load", async () => {
    if (window.location.href.indexOf("minionTest.html") < 0) {
        window.location.href = window.location.href + "minionTest.html";
    } else {
        // Initialize web3 object
        if (initWeb3()) {
            console.log("web3 ready...");
            console.log("web3 version: ", web3.version);

            const accountAddresses = await web3.eth.getAccounts();
            myAddress = accountAddresses[0];

            // Read contracts
            $.getJSON("Minion.json", (minionContractFile) => {
                minionAbi = minionContractFile.abi;
                minionAddress = minionContractFile.networks["3"].address;
            }).done(async () => {
                minion = new web3.eth.Contract(minionAbi, minionAddress);
                document.getElementById("minion-address").innerHTML = minionAddress;
                if (Object.keys(minion).length > 0) {
                    minionDecimals = await minion.methods.decimals().call();
                    document.getElementById("my-address").innerHTML = myAddress;
                    updateMyMinionBalance();
                    updateStakingContractMinionBalance();

                    // Transfer Minion
                    const sendMinionBtn = document.getElementById("send-minion-button");
                    if (sendMinionBtn) {
                        sendMinionBtn.addEventListener("click", async () => {
                            const transferAmount = document.getElementById("transfer-amount").value;
                            const transferTo = document.getElementById("transfer-to").value;

                            if (transferAmount && transferTo) {
                                const minionWithDecimals = transferAmount * Math.pow(10, minionDecimals);

                                const transfer = await minion.methods.transfer(transferTo, minionWithDecimals);
                                const tx = transfer.send({
                                    from: myAddress
                                }).on("transactionHash", txHash => {
                                    console.log("tx hash: ", txHash);
                                    document.getElementById("transfer-minion-link").href = ropstenTestUrlPrefix + txHash;
                                    document.getElementById("transfer-minion-transaction").style.visibility = "visible";
                                }).on("receipt", receipt => {
                                    console.log("Transfer Minion receipt: ", receipt);
                                    updateMyMinionBalance();
                                    updateStakingContractMinionBalance();
                                }).on("error", (error, receipt) => {
                                    console.log("Error in transfer Minion: ", error);
                                    if(receipt && Object.keys(receipt).length > 0){
                                        console.log("Error in transfer Minion, receipt: ", receipt);
                                    }
                                });
                            }
                        });
                    }
                } else {
                    console.error("Error in reading Minion contract");
                }
            });

            $.getJSON("ETH500Staking.json", (eth500StakingContractFile) => {
                eth500StakingAbi = eth500StakingContractFile.abi;
                eth500StakingAddress = eth500StakingContractFile.networks["3"].address;
            }).done(async () => {
                eth500Staking = new web3.eth.Contract(eth500StakingAbi, eth500StakingAddress);
                document.getElementById("staking-contract-address").innerHTML = eth500StakingAddress;
                if (Object.keys(eth500Staking).length > 0) {
                    updateTotalStake();
                    updateMyStake();

                    // Check user available stake
                    // checkStakeInterval = setInterval(async () => {
                    //     let myStake = await eth500Staking.methods.stakeOf(myAddress).call();

                    //     toggleWithdrawStakeFeature(myStake);

                    //     document.getElementById("my-stake").innerHTML = web3.utils.fromWei(myStake, "ether");
                    // }, 3000);

                    // Add stake
                    document.getElementById("add-stake-button").addEventListener("click", async () => {
                        const stake = document.getElementById("add-stake-amount").value;

                        if (stake) {
                            const stakeInWei = web3.utils.toWei(stake, "ether");
                            console.log("stake in wei: ", stakeInWei);

                            const addStake = await eth500Staking.methods.addStake();
                            const tx = await addStake.send({
                                from: myAddress,
                                value: stakeInWei,
                                // gasPrice: web3.utils.toWei("21", "gwei"),
                                // gas: 21000
                            }).on("transactionHash", txHash => {
                                if (txHash) {
                                    console.log("tx hash: ", txHash);
                                    document.getElementById("add-stake-link").href =  ropstenTestUrlPrefix + txHash;
                                    document.getElementById("add-stake-transaction").style.visibility = "visible";
                                }
                            }).on("receipt", async receipt => {
                                console.log("Add stake receipt: ", receipt);
                                
                                updateTotalStake();
                                updateMyStake();
                                getRoi();
                            }).on("error", (error, receipt) => {
                                console.log("Error in withdraw stake: ", error);
                                if(receipt && Object.keys(receipt).length > 0){
                                    console.log("Error in withdraw stake, receipt: ", receipt);
                                }
                            });
                        }
                    });

                    // Withdraw stake
                    document.getElementById("withdraw-stake-button").addEventListener("click", async () => {
                        const withdrawStakeAmount = document.getElementById("withdraw-stake-amount").value;
                        
                        if(withdrawStakeAmount && parseFloat(withdrawStakeAmount) > 0){
                            const withdrawStakeInWei = web3.utils.toWei(withdrawStakeAmount, "ether");
                            const withdrawStake = await eth500Staking.methods.withdrawStake(myAddress, withdrawStakeInWei);
                            withdrawStake.send({
                                from: myAddress,
                                // gasPrice: web3.utils.toWei("21", "gwei"),
                                // gas: 21000
                            }).on("transactionHash", txHash => {
                                console.log("withdraw stake transaction hash: ", txHash);
                                document.getElementById("withdraw-stake-link").href =  ropstenTestUrlPrefix + txHash;
                                document.getElementById("withdraw-stake-transaction").style.visibility = "visible";
                            }).on("receipt", receipt => {
                                console.log("withdraw stake receipt: ", receipt);
                                updateTotalStake();
                                updateMyStake();
                                getRoi();
                            }).on("error", (error, receipt) => {
                                console.log("Error in withdraw stake: ", error);
                                if(receipt && Object.keys(receipt).length > 0){
                                    console.log("Error in withdraw stake, receipt: ", receipt);
                                }
                            });
                        }
                    });

                    // Get max available stake upon withdrawal
                    document.getElementById("max-withdraw-stake").addEventListener("click", async () => {
                        let myStake = await eth500Staking.methods.stakeOf(myAddress).call();
                        document.getElementById("withdraw-stake-amount").value = web3.utils.fromWei(myStake, "ether");
                    });

                    // Get stakeholders list
                    const stakeholders = await eth500Staking.methods.getStakeholders().call();
                    if(stakeholders.length > 0){
                        document.getElementById("empty-stakeholder-message").style.display = "none";
                        const stakeholderList = document.getElementById("stakeholder-list");
                        
                        for(let stakeholder of stakeholders){
                            const li = document.createElement("li");
                            const stakeholderAddress = document.createTextNode(stakeholder);
                            li.appendChild(stakeholderAddress);
                            stakeholderList.appendChild(li);
                        }
                    }else{
                        document.getElementById("empty-stakeholder-message").style.display = "block";
                    }

                    // Get my ROI
                    // const stakeholders = await eth500Staking.methods.getStakeholders().call();
                    getRoi();
                } else {
                    console.error("Error in reading ETH 500 staking contract");
                }
            });
        } else {
            alert("Please use a Ethereum-compatible browser or extension like Metamask");
        }
    }
});


