var banana, bananaAbi, bananaAddress, bananaDecimals;

const bananaDecimalsConverter = (bananaAmount, toHuman = true) => {
    if(bananaAmount){
        if(toHuman){
            return (bananaAmount / Math.pow(10, bananaDecimals)).toFixed(bananaDecimals);
        }else{
            return bananaAmount * Math.pow(10, bananaDecimals);
        }
    }

    return false;
} 

const getBananaTotalSupply = async () => {
    let totalSupply = await banana.methods.totalSupply().call();
    if(totalSupply){
        document.getElementById("banana-total-supply").innerHTML = bananaDecimalsConverter(totalSupply);
    }
}

const getMyBalance = async () => {
    let myBalance = await banana.methods.balanceOf(myAddress).call();
    if(myBalance){
        document.getElementById("my-banana-balance").innerHTML = bananaDecimalsConverter(myBalance);
    }
}

const getCrowdsaleAllowance = async () => {
    let crowdsaleAllowance = await banana.methods.allowance(myAddress, bananaAddress).call();
    if(crowdsaleAllowance){
        document.getElementById("crowdsale-allowance").innerHTML = bananaDecimalsConverter(crowdsaleAllowance);
    }
}

const approveCrowdsale = async () => {
    console.log("clicked");
    let spenderAddress = document.getElementById("approval-spender").value || bananaAddress;
    let approvalAmount = document.getElementById("approval-amount").value;

    if(spenderAddress && approvalAmount){
        approvalAmount = bananaDecimalsConverter(approvalAmount, false);
        const approveBanana = await banana.methods.approve(spenderAddress, approvalAmount.toString());
        approveBanana.send({
            from: myAddress
        }).on("transactionHash", txHash => {
            console.log("Banana approval transaction hash: ", txHash);
        }).on("receipt", receipt => {
            console.log("Banana approval receipt: ", receipt);
            getCrowdsaleAllowance();
        }).on("error", (error, receipt) => {
            console.log("Error in Banana approve trasaction: ", error);
            if(receipt && Object.keys(receipt).length > 0){
                console.log("Error in Banana approve trasaction, receipt: ", receipt);
            }
        });
    }
}

window.addEventListener("load", async() => {
    if(initWeb3()){
        $.getJSON("Banana.json", bananaContractFile => {
            bananaAbi = bananaContractFile.abi;
            bananaAddress = bananaContractFile.networks["3"].address;
        }).done(async () => {
            banana = new web3.eth.Contract(bananaAbi, bananaAddress);
            bananaDecimals = await banana.methods.decimals().call();
            document.getElementById("banana-symbol").innerHTML = await banana.methods.symbol().call();
            document.getElementById("banana-address").innerHTML = bananaAddress;

            getBananaTotalSupply();
            getMyBalance();
            getCrowdsaleAllowance();
            document.getElementById("banana-approve-button").addEventListener("click", approveCrowdsale);
        });
    }
});