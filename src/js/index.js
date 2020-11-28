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
var minion1500LpAbi;
var minion1500LpAddress;
var minion1500Lp;

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
        document.getElementById("my-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateTotalStake = async () => {
    // Get total stake
    const totalStake = await eth500Staking.methods.totalStakes().call();
    if(totalStake){
        document.getElementById("total-stake").innerHTML = web3.utils.fromWei(totalStake, "ether");
    }
}

const updateMyUSDTBalance = async () => {
    const balance = await usdt.methods.balanceOf(myAddress).call();
    if(balance){
        document.getElementById("my-usdt-balance").innerHTML = (balance / Math.pow(10, usdtDecimals)).toFixed(usdtDecimals);
    }
}

const updateStakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(eth500StakingAddress).call();
    if(balance){
        document.getElementById("staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateUSDT500StakingContractTotalStake = async () => {
    const totalStakes = await usdt500Staking.methods.totalStakes().call();
    if(totalStakes){
        document.getElementById("usdt500-total-stake").innerHTML = (totalStakes / Math.pow(10, usdtDecimals)).toFixed(usdtDecimals);
    }
}

const updateUSDT500StakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(usdt500StakingAddress).call();
    if(balance){
        document.getElementById("usdt500-staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals)
    }
}

const updateUSDT500Allowance = async () => {
    const allowance = await usdt.methods.allowance(myAddress, usdt500StakingAddress).call();
    document.getElementById("usdt500-staking-allowance").innerHTML = (allowance / Math.pow(10, usdtDecimals)).toFixed(usdtDecimals);
}

const updateMyStake = async () => {
    const myStake = await eth500Staking.methods.stakeOf(myAddress).call();
    if(myStake){
        document.getElementById("my-stake").innerHTML = web3.utils.fromWei(myStake, "ether");
    }
}

const updateMinion1000StakingContractTotalStake = async () => {
    const totalStakes = await minion1000Staking.methods.totalStakes().call();
    if(totalStakes){
        document.getElementById("minion1000-total-stake").innerHTML = (totalStakes / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateMinion1000StakingContractMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(minion1000StakingAddress).call();
    if(balance){
        document.getElementById("minion1000-staking-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals)
    }
}

const updateMinion1500LpTotalEthStake = async () => {
    const ethTotalStakes = await minion1500Lp.methods.ethTotalStakes().call();
    if(ethTotalStakes){
        document.getElementById("minion1500Lp-total-eth-stake").innerHTML = web3.utils.fromWei(ethTotalStakes, "ether");
    }
}

const updateMinion1500LpTotalMinionStake = async () => {
    const minionTotalStakes = await minion1500Lp.methods.minionTotalStakes().call();
    if(minionTotalStakes){
        document.getElementById("minion1500Lp-total-minion-stake").innerHTML = (minionTotalStakes / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
    }
}

const updateMinion1500LpMinionBalance = async () => {
    const balance = await minion.methods.balanceOf(minion1500LpAddress).call();
    if(balance){
        document.getElementById("minion1500Lp-contract-minion-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals)
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

const checkUSDTAllowance = async () => {
    const allowance = await usdt.methods.allowance(myAddress, usdt500StakingAddress).call();
    const approveSection = document.getElementById("usdt500-approve-section");
    const addStakeSection = document.getElementById("usdt500-add-stake-section");
    const approveButton = document.getElementById("usdt500-approve-button");
    const addStakeButton = document.getElementById("usdt500-add-stake-button");

    if(allowance <= 0){
        // USDT500 Approve

        approveSection.style.display = "block";
        addStakeSection.style.display = "none";

        approveButton.addEventListener("click", async () => {
            const approve = await usdt.methods.approve(usdt500StakingAddress, usdtTotalSupply);
            approve.send({
                from: myAddress
            }).on("transactionHash", txHash => {
                document.getElementById("usdt500-approve-link").href = ropstenTestUrlPrefix + txHash;
                document.getElementById("usdt500-approve-transaction").style.display = "block";
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
    }else{
        // USDT500 Add stake

        approveSection.style.display = "none";
        addStakeSection.style.display = "block";

        addStakeButton.addEventListener("click", async () => {
            const addStakeAmount = document.getElementById("usdt500-add-stake-amount").value * Math.pow(10, usdtDecimals);
            if(addStakeAmount > 0){
                const usdt500AddStake = await usdt500Staking.methods.addStake(myAddress, addStakeAmount);
                usdt500AddStake.send({
                    from: myAddress
                }).on("transactionHash", txHash => {
                    document.getElementById("usdt500-add-stake-link").href = ropstenTestUrlPrefix + txHash;
                    document.getElementById("usdt500-add-stake-transaction").style.display = "block";
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
        })
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

            // Minion contract
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
                                    document.getElementById("transfer-minion-link").href = ropstenTestUrlPrefix + txHash;
                                    document.getElementById("transfer-minion-transaction").style.visibility = "visible";
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

            // USDT500 Staking contract
            $.getJSON("USDT500Staking.json", usdt500StakingContractFile => {
                usdt500StakingAbi = usdt500StakingContractFile.abi;
                usdt500StakingAddress = usdt500StakingContractFile.networks["3"].address;
            }).done(async () => {
                usdt500Staking = new web3.eth.Contract(usdt500StakingAbi, usdt500StakingAddress);
                document.getElementById("usdt500-staking-address").innerHTML = usdt500StakingAddress;
                const totalStake = await usdt500Staking.methods.totalStakes().call();
                document.getElementById("usdt500-total-stake").innerHTML = totalStake;

                // USDT contract
                $.getJSON("USDT.json", usdtContractFile => {
                    usdtAbi = usdtContractFile.abi;
                    usdtAddress = usdtContractFile.networks["3"].address;
                }).done(async () => {
                    
                    usdt = new web3.eth.Contract(usdtAbi, usdtAddress);
                    usdtTotalSupply = await usdt.methods.totalSupply().call();
                    usdtDecimals = await usdt.methods.decimals().call();

                    document.getElementById("usdt-address").innerHTML = usdtAddress;
                    document.getElementById("my-usdt-address").innerHTML = myAddress;

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
                document.getElementById("minion1000-staking-address").innerHTML = minion1000StakingAddress;
                updateMinion1000StakingContractTotalStake();
                updateMinion1000StakingContractMinionBalance();
            });

            // Minion1500LP contract
            $.getJSON("Minion1500LP.json", minion1500LpContractFile => {
                minion1500LpAbi = minion1500LpContractFile.abi;
                minion1500LpAddress = minion1500LpContractFile.networks["3"].address;
            }).done(async () => {
                minion1500Lp = new web3.eth.Contract(minion1500LpAbi, minion1500LpAddress);
                document.getElementById("minion1500Lp-address").innerHTML = minion1500LpAddress;
                updateMinion1500LpTotalEthStake();
                updateMinion1500LpTotalMinionStake();
                updateMinion1500LpMinionBalance();
            })
            
            // console.log("checksum address of Tether USDT: ", web3.utils.toChecksumAddress("0x6ee856ae55b6e1a249f04cd3b947141bc146273c"));
        } else {
            alert("Please use a Ethereum-compatible browser or extension like Metamask");
        }
    }
});


