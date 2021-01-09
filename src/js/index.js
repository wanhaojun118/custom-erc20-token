var web3;
var minionAbi;
var minionAddress;
var minion;
var minionDecimals;
var minionTotalSupply;
var eth500StakingAbi;
var eth500StakingAddress;
var eth500Staking;
var myAddress;
var checkStakeInterval = null;
var dailyPayout = 10;
var ropstenTestUrlPrefix = "https://ropsten.etherscan.io/tx/";
var usdtAbi;
var usdtAddress;
var usdt;
var usdtTotalSupply;
var usdtDecimals;
var usdt500StakingAbi;
var usdt500StakingAddress;
var usdt500Staking;
var minion1000StakingAbi;
var minion1000StakingAddress;
var minion1000Staking;
var minion1500lpAbi;
var minion1500lpAddress;
var minion1500lp;
var minionToWeiRate;

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
        if(document.getElementById("withdraw-stake-amount") && document.getElementById("withdraw-stake-button")
            && document.getElementById("max-withdraw-stake")){
                document.getElementById("withdraw-stake-amount").disabled = true;
                document.getElementById("withdraw-stake-button").disabled = true;
                document.getElementById("max-withdraw-stake").style.display = "none";
            }
    }else{
        if(document.getElementById("withdraw-stake-amount") && document.getElementById("withdraw-stake-button")
            && document.getElementById("max-withdraw-stake")){
                document.getElementById("withdraw-stake-amount").disabled = false;
                document.getElementById("withdraw-stake-button").disabled = false;
                document.getElementById("max-withdraw-stake").style.display = "contents";
            }
    }
}

const updateMyMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(myAddress).call();
    if(balance && document.getElementById("my-balance")){
        document.getElementById("my-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateTotalStake = async () => {
    // Get total stake
    const totalStake = await eth500Staking.methods.totalStakes().call();
    if(totalStake && document.getElementById("total-stake")){
        document.getElementById("total-stake").innerHTML = web3.utils.fromWei(totalStake, "ether");
    }
}

const updateMyUSDTBalance = async () => {
    const balance = await usdt.methods.balanceOf(myAddress).call();
    if(balance && document.getElementById("my-usdt-balance")){
        document.getElementById("my-usdt-balance").innerHTML = (balance / Math.pow(10, usdtDecimals)).toFixed(usdtDecimals);
    }
}

const updateStakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(eth500StakingAddress).call();
    if(balance && document.getElementById("staking-contract-minion-balance")){
        document.getElementById("staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateUSDT500StakingContractTotalStake = async () => {
    const totalStakes = await usdt500Staking.methods.totalStakes().call();
    if(totalStakes && document.getElementById("usdt500-total-stake")){
        document.getElementById("usdt500-total-stake").innerHTML = (totalStakes / Math.pow(10, usdtDecimals)).toFixed(usdtDecimals);
    }
}

const updateUSDT500StakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(usdt500StakingAddress).call();
    if(balance && document.getElementById("usdt500-staking-contract-minion-balance")){
        document.getElementById("usdt500-staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals)
    }
}

const updateUSDT500Allowance = async () => {
    const allowance = await usdt.methods.allowance(myAddress, usdt500StakingAddress).call();
    if(document.getElementById("usdt500-staking-allowance")){
        document.getElementById("usdt500-staking-allowance").innerHTML = (allowance / Math.pow(10, usdtDecimals)).toFixed(usdtDecimals);
    }
}

const updateMinion1500LpAllowance = async () => {
    const allowance = await minion.methods.allowance(myAddress, minion1500lpAddress).call();
    if(document.getElementById("minion1500lp-staking-minion-allowance")){
        document.getElementById("minion1500lp-staking-minion-allowance").innerHTML = (allowance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateMyStake = async () => {
    const myStake = await eth500Staking.methods.stakeOf(myAddress).call();
    if(myStake && document.getElementById("my-stake")){
        document.getElementById("my-stake").innerHTML = web3.utils.fromWei(myStake, "ether");
    }
}

const updateMinion1000Allowance = async () => {
    const allowance = await minion.methods.allowance(myAddress, minion1000StakingAddress).call();
    if(document.getElementById("minion1000-staking-allowance")){
        document.getElementById("minion1000-staking-allowance").innerHTML = (allowance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateMinion1000StakingContractTotalStake = async () => {
    const totalStakes = await minion1000Staking.methods.totalStakes().call();
    if(totalStakes && document.getElementById("minion1000-total-stake")){
        document.getElementById("minion1000-total-stake").innerHTML = (totalStakes / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateMinion1000StakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(minion1000StakingAddress).call();
    if(balance && document.getElementById("minion1000-staking-contract-minion-balance")){
        document.getElementById("minion1000-staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals)
    }
}

const updateminion1500lpTotalEthStake = async () => {
    const ethTotalStakes = await minion1500lp.methods.ethTotalStakes().call();
    if(ethTotalStakes && document.getElementById("minion1500lp-total-eth-stake")){
        document.getElementById("minion1500lp-total-eth-stake").innerHTML = web3.utils.fromWei(ethTotalStakes, "ether");
    }
}

const updateminion1500lpTotalMinionStake = async () => {
    const minionTotalStakes = await minion1500lp.methods.minionTotalStakes().call();
    if(minionTotalStakes && document.getElementById("minion1500lp-total-minion-stake")){
        document.getElementById("minion1500lp-total-minion-stake").innerHTML = (minionTotalStakes / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateMinion1500lpEthBalance = async () => {
    const balance = await web3.eth.getBalance(minion1500lpAddress);
    if(balance && document.getElementById("minion1500lp-contract-eth-balance")){
        document.getElementById("minion1500lp-contract-eth-balance").innerHTML = web3.utils.fromWei(balance, "ether");
    }
}

const updateMinion1500lpMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(minion1500lpAddress).call();
    if(balance && document.getElementById("minion1500lp-contract-minion-balance")){
        document.getElementById("minion1500lp-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals)
    }
}

const getRoi = async () => {
    const myStake = await eth500Staking.methods.stakeOf(myAddress).call();
    const totalStake = await eth500Staking.methods.totalStakes().call();
    if(parseInt(myStake) > 0 && parseInt(totalStake) > 0){
        const proportional = myStake / totalStake;
        const interest  = (proportional * dailyPayout).toFixed(2);
        if(document.getElementById("my-roi")){
            document.getElementById("my-roi").innerHTML = interest;
        }

        if(interest > 0){
            // Harvest interest
            if(document.getElementById("harvest-interest")){
                document.getElementById("harvest-interest").addEventListener("click", async () => {
                    const interestInMinion = parseInt(interest * Math.pow(10, minionDecimals));
    
                    console.log("interest in minion: ", interestInMinion);
                    if(interestInMinion > 0){
                        let harvestInterest = await eth500Staking.methods.harvestInterest(myAddress, interestInMinion);
    
                        let tx = harvestInterest.send({
                            from: myAddress,
                        }).on("transactionHash", txHash => {
                            console.log("Harvest tx hash: ", txHash);
                            
                            if(document.getElementById("harvest-interest-link") && document.getElementById("harvest-interest-transaction")){
                                document.getElementById("harvest-interest-link").href = ropstenTestUrlPrefix + txHash;
                                document.getElementById("harvest-interest-transaction").style.visibility = "visible";
                            }
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
            }
        }else{
            if(document.getElementById("harvest-interest")){
                document.getElementById("harvest-interest").disabled = true;
            }
        }
    }else{
        if(document.getElementById("harvest-interest")){
            document.getElementById("harvest-interest").disabled = true;
        }
        
        if(document.getElementById("my-roi")){
            document.getElementById("my-roi").innerHTML = "0";
        }
    }
}

const checkUSDTAllowance = async () => {
    const allowance = await usdt.methods.allowance(myAddress, usdt500StakingAddress).call();
    const approveSection = document.getElementById("usdt500-approve-section");
    const addStakeSection = document.getElementById("usdt500-add-stake-section");
    const approveButton = document.getElementById("usdt500-approve-button");
    const addStakeButton = document.getElementById("usdt500-add-stake-button");

    if(allowance <= 0){
        // USDT500 Approve

        if(approveSection && addStakeSection){
            approveSection.style.display = "block";
            addStakeSection.style.display = "none";
        }

        if(approveButton){
            approveButton.addEventListener("click", async () => {
                const approve = await usdt.methods.approve(usdt500StakingAddress, usdtTotalSupply);
                approve.send({
                    from: myAddress
                }).on("transactionHash", txHash => {
                    if(document.getElementById("usdt500-approve-link") && document.getElementById("usdt500-approve-transaction")){
                        document.getElementById("usdt500-approve-link").href = ropstenTestUrlPrefix + txHash;
                        document.getElementById("usdt500-approve-transaction").style.display = "block";
                    }
                }).on("receipt", receipt => {
                    console.log("USDT500 approve receipt: ", receipt);
                    checkUSDTAllowance();
                }).on("error", (error, receipt) => {
                    console.log("Error in USDT500 approve trasaction: ", error);
                    if(receipt && Object.keys(receipt).length > 0){
                        console.log("Error in USDT500 approve trasaction, receipt: ", receipt);
                    }
                });
            });
        }
    }else{
        // USDT500 Add stake

        if(approveSection && addStakeSection){
            approveSection.style.display = "none";
            addStakeSection.style.display = "block";
        }

        if(addStakeButton){
            addStakeButton.addEventListener("click", async () => {
                const addStakeAmount = document.getElementById("usdt500-add-stake-amount").value * Math.pow(10, usdtDecimals);
                if(addStakeAmount > 0){
                    const usdt500AddStake = await usdt500Staking.methods.addStake(myAddress, addStakeAmount);
                    usdt500AddStake.send({
                        from: myAddress
                    }).on("transactionHash", txHash => {
                        if(document.getElementById("usdt500-add-stake-link") && document.getElementById("usdt500-add-stake-transaction")){
                            document.getElementById("usdt500-add-stake-link").href = ropstenTestUrlPrefix + txHash;
                            document.getElementById("usdt500-add-stake-transaction").style.display = "block";
                        }
                    }).on("receipt", receipt => {
                        console.log("USDT500 add stake receipt: ", receipt);
                        updateMyUSDTBalance();
                        updateUSDT500Allowance();
                        updateUSDT500StakingContractTotalStake();
                    }).on("error", (error, receipt) => {
                        console.log("Error in USDT500 add stake trasaction: ", error);
                        if(receipt && Object.keys(receipt).length > 0){
                            console.log("Error in USDT500 add stake trasaction, receipt: ", receipt);
                        }
                    });
                }
            });
        }
    }
}

const checkMinion1000Allowance = async () => {
    const allowance = await minion.methods.allowance(myAddress, minion1000StakingAddress).call();
    const approveSection = document.getElementById("minion1000-approve-section");
    const addStakeSection = document.getElementById("minion1000-add-stake-section");
    const approveButton = document.getElementById("minion1000-approve-button");
    const addStakeButton = document.getElementById("minion1000-add-stake-button");
    const minTotalSupply = await minion.methods.totalSupply().call();

    if(allowance <= 0){
        // Minion1000 Approve

        if(approveSection && addStakeSection){
            approveSection.style.display = "block";
            addStakeSection.style.display = "none";
        }

        if(approveButton){
            approveButton.addEventListener("click", async () => {
                const approve = await minion.methods.approve(minion1000StakingAddress, minTotalSupply);
                approve.send({
                    from: myAddress
                }).on("transactionHash", txHash => {
                    if(document.getElementById("minion1000-approve-link") && document.getElementById("minion1000-approve-transaction")){
                        document.getElementById("minion1000-approve-link").href = ropstenTestUrlPrefix + txHash;
                        document.getElementById("minion1000-approve-transaction").style.display = "block";
                    }
                }).on("receipt", receipt => {
                    console.log("Minion1000 approve receipt: ", receipt);
                    checkMinion1000Allowance();
                }).on("error", (error, receipt) => {
                    console.log("Error in Minion1000 approve trasaction: ", error);
                    if(receipt && Object.keys(receipt).length > 0){
                        console.log("Error in Minion1000 approve trasaction, receipt: ", receipt);
                    }
                });
            });
        }
    }else{
        // Minion1000 Add stake

        updateMinion1000Allowance();

        if(approveSection && addStakeSection){
            approveSection.style.display = "none";
            addStakeSection.style.display = "block";
        }

        if(addStakeButton){
            addStakeButton.addEventListener("click", async () => {
                const addStakeAmount = document.getElementById("minion1000-add-stake-amount").value * Math.pow(10, minionDecimals);
                if(addStakeAmount > 0){
                    const minion1000AddStake = await minion1000Staking.methods.addStake(myAddress, addStakeAmount);
                    minion1000AddStake.send({
                        from: myAddress
                    }).on("transactionHash", txHash => {
                        if(document.getElementById("minion1000-add-stake-link") && document.getElementById("minion1000-add-stake-transaction")){
                            document.getElementById("minion1000-add-stake-link").href = ropstenTestUrlPrefix + txHash;
                            document.getElementById("minion1000-add-stake-transaction").style.display = "block";
                        }
                    }).on("receipt", receipt => {
                        console.log("Minion1000 add stake receipt: ", receipt);
                        updateMyMinionBalance();
                        updateMinion1000Allowance();
                        updateMinion1000StakingContractTotalStake();
                    }).on("error", (error, receipt) => {
                        console.log("Error in Minion1000 add stake trasaction: ", error);
                        if(receipt && Object.keys(receipt).length > 0){
                            console.log("Error in Minion1000 add stake trasaction, receipt: ", receipt);
                        }
                    });
                }
            });
        }
    }
}

const checkMinionLpAllowance = async () => {
    const allowance = await minion.methods.allowance(myAddress, minion1500lpAddress).call();
    const approveSection = document.getElementById("minion1500lp-approve-section");
    const addStakeSection = document.getElementById("minion1500lp-add-stake-section");
    const approveButton = document.getElementById("minion1500lp-approve-button");
    const addStakeButton = document.getElementById("minion1500lp-add-stake-button");
    const minTotalSupply = await minion.methods.totalSupply().call();

    if(allowance <= 0){
        // Minion1500 LP Approve

        if(approveSection && addStakeSection){
            approveSection.style.display = "block";
            addStakeSection.style.display = "none";
        }

        if(approveButton){
            approveButton.addEventListener("click", async () => {
                const approve = await minion.methods.approve(minion1500lpAddress, minTotalSupply);
                approve.send({
                    from: myAddress
                }).on("transactionHash", txHash => {
                    if(document.getElementById("minion1500lp-approve-link") && document.getElementById("minion1500lp-approve-transaction")){
                        document.getElementById("minion1500lp-approve-link").href = ropstenTestUrlPrefix + txHash;
                        document.getElementById("minion1500lp-approve-transaction").style.display = "block";
                    }
                }).on("receipt", receipt => {
                    console.log("Minion1500 LP approve receipt: ", receipt);
                    updateMinion1500LpAllowance();
                }).on("error", (error, receipt) => {
                    console.log("Error in Minion1500 LP approve trasaction: ", error);
                    if(receipt && Object.keys(receipt).length > 0){
                        console.log("Error in Minion1500 LP approve trasaction, receipt: ", receipt);
                    }
                });
            });
        }
    }else{
        // Minion1500 LP Add stake

        updateMinion1500LpAllowance();

        if(approveSection && addStakeSection){
            approveSection.style.display = "none";
            addStakeSection.style.display = "block";
        }

        const ethInput = document.getElementById("minion1500lp-add-stake-eth-amount");
        const minionInput = document.getElementById("minion1500lp-add-stake-minion-amount");

        if(ethInput){
            ethInput.addEventListener("change", async(e) => {
                const ethWithDecimals = web3.utils.toWei(e.target.value, "ether");
                const convertedMinion = ((ethWithDecimals / minionToWeiRate) / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
                minionInput.value = convertedMinion;
            });
        }

        if(minionInput){
            minionInput.addEventListener("change", async(e) => {
                const minionWithDecimals = e.target.value * Math.pow(10, minionDecimals);
                const convertedEth = web3.utils.fromWei((minionWithDecimals * minionToWeiRate).toString(), "ether");
                ethInput.value = convertedEth;
            });
        }

        if(addStakeButton){
            addStakeButton.addEventListener("click", async () => {
                const ethAmount = web3.utils.toWei((document.getElementById("minion1500lp-add-stake-eth-amount").value).toString(), "ether");
                const minionAmount = document.getElementById("minion1500lp-add-stake-minion-amount").value * Math.pow(10, minionDecimals);
                if(ethAmount > 0 && minionAmount > 0){
    
                    const minion1500lpAddStake = await minion1500lp.methods.addStake(myAddress, minionAmount);
                    minion1500lpAddStake.send({
                        from: myAddress,
                        value: ethAmount
                    }).on("transactionHash", txHash => {
                        if(document.getElementById("minion1500lp-add-stake-link") && document.getElementById("minion1500lp-add-stake-transaction")){
                            document.getElementById("minion1500lp-add-stake-link").href = ropstenTestUrlPrefix + txHash;
                            document.getElementById("minion1500lp-add-stake-transaction").style.display = "block";
                        }
                    }).on("receipt", receipt => {
                        console.log("Minion1500 LP add stake receipt: ", receipt);
                        updateMyMinionBalance();
                        updateMinion1500LpAllowance();
                        updateminion1500lpTotalEthStake();
                        updateminion1500lpTotalMinionStake();
                    }).on("error", (error, receipt) => {
                        console.log("Error in Minion1500 LP add stake trasaction: ", error);
                        if(receipt && Object.keys(receipt).length > 0){
                            console.log("Error in Minion1500 LP add stake trasaction, receipt: ", receipt);
                        }
                    });
                }
            });
        }
    }
}

const minion1500lpWithdrawal = () => {
    const ethInput = document.getElementById("minion1500lp-withdraw-stake-eth-amount");
    const minionInput = document.getElementById("minion1500lp-withdraw-stake-minion-amount");

    if(ethInput){
        ethInput.addEventListener("change", async(e) => {
            const ethWithDecimals = web3.utils.toWei(e.target.value, "ether");
            const convertedMinion = ((ethWithDecimals / minionToWeiRate) / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
            minionInput.value = convertedMinion;
        });
    }

    if(minionInput){
        minionInput.addEventListener("change", async(e) => {
            const minionWithDecimals = e.target.value * Math.pow(10, minionDecimals);
            const convertedEth = web3.utils.fromWei((minionWithDecimals * minionToWeiRate).toString(), "ether");
            ethInput.value = convertedEth;
        });
    }

    if(document.getElementById("minion1500lp-withdraw-stake-button")){
        document.getElementById("minion1500lp-withdraw-stake-button").addEventListener("click", async () => {
            const ethAmount = web3.utils.toWei(document.getElementById("minion1500lp-withdraw-stake-eth-amount").value, "ether");
            const minionAmount = document.getElementById("minion1500lp-withdraw-stake-minion-amount").value * Math.pow(10, minionDecimals);
            const minion1500lpWithdrawStake = await minion1500lp.methods.withdrawStake(myAddress, minionAmount, ethAmount);
            minion1500lpWithdrawStake.send({
                from: myAddress,
            }).on("transactionHash", txHash => {
                if(document.getElementById("minion1500lp-withdraw-stake-link") && document.getElementById("minion1500lp-withdraw-stake-transaction")){
                    document.getElementById("minion1500lp-withdraw-stake-link").href = ropstenTestUrlPrefix + txHash;
                    document.getElementById("minion1500lp-withdraw-stake-transaction").style.display = "block";
                }
            }).on("receipt", receipt => {
                console.log("Minion1500 LP withdraw stake receipt: ", receipt);
                updateMyMinionBalance();
                updateMinion1500LpAllowance();
                updateminion1500lpTotalEthStake();
                updateminion1500lpTotalMinionStake();
            }).on("error", (error, receipt) => {
                console.log("Error in Minion1500 LP withdraw stake trasaction: ", error);
                if(receipt && Object.keys(receipt).length > 0){
                    console.log("Error in Minion1500 LP withdraw stake trasaction, receipt: ", receipt);
                }
            });
        });
    }
}

window.addEventListener("load", async () => {
    // Initialize web3 object
    if (initWeb3()) {
        console.log("web3 ready...");
        console.log("web3 version: ", web3.version);

        const accountAddresses = await web3.eth.getAccounts();
        myAddress = accountAddresses[0];

        // Minion contract
        $.getJSON("Minion.json", (minionContractFile) => {
            minionAbi = minionContractFile.abi;
            minionAddress = minionContractFile.networks["3"].address;
        }).done(async () => {
            minion = new web3.eth.Contract(minionAbi, minionAddress);
            if(document.getElementById("minion-address")){
                document.getElementById("minion-address").innerHTML = minionAddress;
            }
            if (Object.keys(minion).length > 0) {
                minionDecimals = await minion.methods.decimals().call();
                minionTotalSupply = await minion.methods.totalSupply().call();
                if(document.getElementById("my-address")){
                    document.getElementById("my-address").innerHTML = myAddress;
                }
                updateMyMinionBalance();
                updateStakingContractMinionBalance();
                updateUSDT500StakingContractMinionBalance();

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
                                if(document.getElementById("transfer-minion-link") && document.getElementById("transfer-minion-transaction")){
                                    document.getElementById("transfer-minion-link").href = ropstenTestUrlPrefix + txHash;
                                    document.getElementById("transfer-minion-transaction").style.visibility = "visible";
                                }
                            }).on("receipt", receipt => {
                                console.log("Transfer Minion receipt: ", receipt);
                                updateMyMinionBalance();
                                updateStakingContractMinionBalance();
                                updateUSDT500StakingContractMinionBalance
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

        // ETH500 Staking contract
        $.getJSON("ETH500Staking.json", (eth500StakingContractFile) => {
            eth500StakingAbi = eth500StakingContractFile.abi;
            eth500StakingAddress = eth500StakingContractFile.networks["3"].address;
        }).done(async () => {
            eth500Staking = new web3.eth.Contract(eth500StakingAbi, eth500StakingAddress);
            if(document.getElementById("staking-contract-address")){
                document.getElementById("staking-contract-address").innerHTML = eth500StakingAddress;
            }
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
                if(document.getElementById("add-stake-button")){
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
                                    if(document.getElementById("add-stake-link") && document.getElementById("add-stake-transaction")){
                                        document.getElementById("add-stake-link").href =  ropstenTestUrlPrefix + txHash;
                                        document.getElementById("add-stake-transaction").style.visibility = "visible";
                                    }
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
                }

                // Withdraw stake
                if(document.getElementById("withdraw-stake-button")){
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
                                if(document.getElementById("withdraw-stake-link") && document.getElementById("withdraw-stake-transaction")){
                                    document.getElementById("withdraw-stake-link").href =  ropstenTestUrlPrefix + txHash;
                                    document.getElementById("withdraw-stake-transaction").style.visibility = "visible";
                                }
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
                }

                // Get max available stake upon withdrawal
                if(document.getElementById("max-withdraw-stake")){
                    document.getElementById("max-withdraw-stake").addEventListener("click", async () => {
                        let myStake = await eth500Staking.methods.stakeOf(myAddress).call();
                        document.getElementById("withdraw-stake-amount").value = web3.utils.fromWei(myStake, "ether");
                    });
                }

                // Get stakeholders list
                const stakeholders = await eth500Staking.methods.getStakeholders().call();
                if(stakeholders.length > 0){
                    if(document.getElementById("empty-stakeholder-message")){
                        document.getElementById("empty-stakeholder-message").style.display = "none";
                    }
                    const stakeholderList = document.getElementById("stakeholder-list");
                    
                    for(let stakeholder of stakeholders){
                        const li = document.createElement("li");
                        const stakeholderAddress = document.createTextNode(stakeholder);
                        li.appendChild(stakeholderAddress);
                        if(stakeholderList){
                            stakeholderList.appendChild(li);
                        }
                    }
                }else{
                    if(document.getElementById("empty-stakeholder-message")){
                        document.getElementById("empty-stakeholder-message").style.display = "block";
                    }
                }

                // Get my ROI
                // const stakeholders = await eth500Staking.methods.getStakeholders().call();
                getRoi();
            } else {
                console.error("Error in reading ETH 500 staking contract");
            }
        });

        // USDT500 Staking contract
        $.getJSON("USDT500Staking.json", usdt500StakingContractFile => {
            usdt500StakingAbi = usdt500StakingContractFile.abi;
            usdt500StakingAddress = usdt500StakingContractFile.networks["3"].address;
        }).done(async () => {
            usdt500Staking = new web3.eth.Contract(usdt500StakingAbi, usdt500StakingAddress);
            if(document.getElementById("usdt500-staking-address")){
                document.getElementById("usdt500-staking-address").innerHTML = usdt500StakingAddress;
            }
            const totalStake = await usdt500Staking.methods.totalStakes().call();
            if(document.getElementById("usdt500-total-stake")){
                document.getElementById("usdt500-total-stake").innerHTML = totalStake;
            }

            // USDT contract
            $.getJSON("USDT.json", usdtContractFile => {
                usdtAbi = usdtContractFile.abi;
                usdtAddress = usdtContractFile.networks["3"].address;
            }).done(async () => {
                
                usdt = new web3.eth.Contract(usdtAbi, usdtAddress);
                usdtTotalSupply = await usdt.methods.totalSupply().call();
                usdtDecimals = await usdt.methods.decimals().call();

                if(document.getElementById("usdt-address")){
                    document.getElementById("usdt-address").innerHTML = usdtAddress;
                }
                
                if(document.getElementById("my-usdt-address")){
                    document.getElementById("my-usdt-address").innerHTML = myAddress;
                }

                updateMyUSDTBalance();
                updateUSDT500StakingContractTotalStake();
                updateUSDT500StakingContractMinionBalance();
                updateUSDT500Allowance();

                // Check contract's allowance approved by user
                checkUSDTAllowance();
            });
        });

        // Minion1000 Staking contract
        $.getJSON("Minion1000Staking.json", minion1000ContractFile => {
            minion1000StakingAbi = minion1000ContractFile.abi;
            minion1000StakingAddress = minion1000ContractFile.networks["3"].address;
        }).done(async () => {
            minion1000Staking = new web3.eth.Contract(minion1000StakingAbi, minion1000StakingAddress);
            if(document.getElementById("minion1000-staking-address")){
                document.getElementById("minion1000-staking-address").innerHTML = minion1000StakingAddress;
            }
            updateMinion1000StakingContractTotalStake();
            updateMinion1000StakingContractMinionBalance();

            checkMinion1000Allowance();
        });

        // minion1500lp contract
        $.getJSON("minion1500LP.json", minion1500lpContractFile => {
            minion1500lpAbi = minion1500lpContractFile.abi;
            minion1500lpAddress = minion1500lpContractFile.networks["3"].address;
        }).done(async () => {
            minion1500lp = new web3.eth.Contract(minion1500lpAbi, minion1500lpAddress);
            if(document.getElementById("minion1500lp-address")){
                document.getElementById("minion1500lp-address").innerHTML = minion1500lpAddress;
            }
            minionToWeiRate = await minion1500lp.methods.minionToWeiRate().call();
            updateminion1500lpTotalEthStake();
            updateminion1500lpTotalMinionStake();
            updateMinion1500lpEthBalance();
            updateMinion1500lpMinionBalance();

            // Check Minion1500 LP allowance
            checkMinionLpAllowance();

            // Withdrawal section
            minion1500lpWithdrawal();
        });
        
        // console.log("checksum address of Tether USDT: ", web3.utils.toChecksumAddress("0x6ee856ae55b6e1a249f04cd3b947141bc146273c"));
    } else {
        alert("Please use a Ethereum-compatible browser or extension like Metamask");
    }
});


