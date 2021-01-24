var myAddress;
var usdt, usdtSymbol, usdtDecimals, myUsdtBalance;

const initWeb3 = () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
    }
    return false;
}

const approveUsdt = async () => {
    // Approve to myself, for demo purpose
    const approveAmount = 1 * Math.pow(10, usdtDecimals); // 1 USDT
    approve = await usdt.methods.approve(myAddress, approveAmount.toString());

    approve.send({
        from: myAddress
    }).on("transactionHash", txHash => {
        console.log("USDT approval transaction hash: ", txHash);
    }).on("receipt", receipt => {
        console.log("USDT approval receipt: ", receipt);
    }).on("error", (error, receipt) => {
        console.log("Error in USDT approve trasaction: ", error);
        if(receipt && Object.keys(receipt).length > 0){
            console.log("Error in USDT approve trasaction, receipt: ", receipt);
        }
    });
}

window.addEventListener("load", async() => {
    if(initWeb3()){
        const accountAddresses = await web3.eth.getAccounts();
        myAddress = accountAddresses[0];

        const tokens = new realnetTokens();
        const usdtToken = tokens.getUsdt();

        if(usdtToken.abi && usdtToken.address){
            usdt = new web3.eth.Contract(usdtToken.abi, usdtToken.address);
            usdtSymbol = await usdt.methods.symbol().call();
            usdtDecimals = await usdt.methods.decimals().call();
            myUsdtBalance = await usdt.methods.balanceOf(myAddress).call();
            
            document.getElementById("usdt-address").innerHTML = usdtToken.address;
            document.getElementById("usdt-symbol").innerHTML = usdtSymbol;
            document.getElementById("usdt-decimals").innerHTML = usdtDecimals;
            document.getElementById("usdt-my-balance").innerHTML = myUsdtBalance;
            document.getElementById("usdt-approve").addEventListener("click", approveUsdt);
        }
    }
});