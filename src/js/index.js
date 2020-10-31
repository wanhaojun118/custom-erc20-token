var web3;
var abi;
var minion;

const initWeb3 = () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
    }

    return false;
}

const sendMinion = () => {
    alert("function called");
}

window.addEventListener("load", async () => {
    if (window.location.href.indexOf("minionTest.html") < 0) {
        window.location.href = window.location.href + "minionTest.html";
    } else {
        // Initialize web3 object
        if (initWeb3()) {
            console.log("web3 ready...");
            console.log("web3 version: ", web3.version);

            // Read contracts
            $.getJSON("Minion.json", (minionContractFile) => {
                abi = minionContractFile.abi;
            }).done(async () => {
                minion = new web3.eth.Contract(abi, "0x872e8aba803F75fA2238f0A6c0AFb3621C1fdB21");

                if (Object.keys(minion).length > 0) {
                    const accountAddress = await web3.eth.getAccounts();
                    const minionDecimals = await minion.methods.decimals().call();
                    console.log("address: ", accountAddress[0]);
                    const balance = await minion.methods.balanceOf(accountAddress[0]).call();
                    document.getElementById("my-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(2);

                    const sendMinionBtn = document.getElementById("send-minion-button");
                    if (sendMinionBtn) {
                        sendMinionBtn.addEventListener("click", async () => {
                            const transferAmount = document.getElementById("transfer-amount").value;
                            const transferTo = document.getElementById("transfer-to").value;

                            if (transferAmount && transferTo) {
                                const minionWithDecimals = transferAmount * Math.pow(10, minionDecimals);
                                console.log("transfer amount: ", transferAmount);
                                console.log("transfer to: ", transferTo);
                                console.log("account address: ", accountAddress);
                                const transfer = await minion.methods.transfer(transferTo, minionWithDecimals);
                                const tx = transfer.send({
                                    from: accountAddress[0]
                                }).once("transactionHash", txHash => {
                                    console.log("tx hash: ", txHash);
                                });
                            }
                        });
                    }
                }
            });
        } else {
            alert("Please use a Ethereum-compatible browser or extension like Metamask");
        }
    }
});


