var banana, bananaAbi, bananaAddress, bananaDecimals;
var bananaCrowdsaleFirst, bananaCrowdsaleFirstAbi, bananaCrowdsaleFirstAddress, bananaCrowdsaleAllowance,
    bananaCrowdsaleTokenAvailable, bananaCrowdsaleWeiRaised, bananaCrowdsaleRate, bananaCrowdsaleOpeningTime, 
    bananaCrowdsaleClosingTime, bananaCrowdsaleIsOpen;
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];

const bananaDecimalsConverter = (bananaAmount, toHuman = true) => {
    if(bananaAmount){
        if(toHuman){
            return (bananaAmount / Math.pow(10, bananaDecimals)).toFixed(bananaDecimals);
        }else{
            return bananaAmount * Math.pow(10, bananaDecimals);
        }
    }

    return "N/A";
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
    let crowdsaleAllowance = await banana.methods.allowance(myAddress, bananaCrowdsaleFirstAddress).call();
    if(crowdsaleAllowance){
        document.getElementById("crowdsale-allowance").innerHTML = bananaDecimalsConverter(crowdsaleAllowance);
        bananaCrowdsaleAllowance = bananaDecimalsConverter(crowdsaleAllowance);
    }
}

const approveCrowdsale = async (e) => {
    let spenderAddress = document.getElementById("approval-spender").value || bananaCrowdsaleFirstAddress;
    let approvalAmount = document.getElementById("approval-amount").value;
    const withoutDecimalConversion = document.getElementById("without-decimal-conversion").checked;

    if(spenderAddress && approvalAmount){
        approvalAmount = withoutDecimalConversion ? approvalAmount : bananaDecimalsConverter(approvalAmount, false);
        let buttonAction;
        if(e.target.id === "banana-increase-allowance-button"){
            buttonAction = await banana.methods.increaseAllowance(spenderAddress, BigInt(approvalAmount));
        }else if(e.target.id === "banana-decrease-allowance-button"){
            buttonAction = await banana.methods.decreaseAllowance(spenderAddress, BigInt(approvalAmount));
        }else{
            buttonAction = await banana.methods.approve(spenderAddress, BigInt(approvalAmount));
        }
        
        buttonAction.send({
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

const getBananaCrowdsaleTokenAvailable = async () => {
    document.getElementById("banana-crowdsale-token-available").innerHTML = bananaDecimalsConverter(bananaCrowdsaleTokenAvailable);
}

const getBananaCrowdsaleTokenSold = async () => {
    document.getElementById("banana-crowdsale-token-sold").innerHTML = bananaDecimalsConverter(bananaCrowdsaleWeiRaised * bananaCrowdsaleRate);
}

const getBananCrowdsaleOpeningAndClosingTime = async () => {
    bananaCrowdsaleOpeningTime = await bananaCrowdsaleFirst.methods.openingTime().call();
    bananaCrowdsaleClosingTime = await bananaCrowdsaleFirst.methods.closingTime().call();
    if(bananaCrowdsaleOpeningTime && bananaCrowdsaleClosingTime){
        let openingDate = new Date(bananaCrowdsaleOpeningTime * 1000);
        let closingDate = new Date(bananaCrowdsaleClosingTime * 1000);
        document.getElementById("banana-crowdsale-opening-time").innerHTML = moment(openingDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
        document.getElementById("banana-crowdsale-closing-time").innerHTML = moment(closingDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
    }
}

const getBananaCrowdsaleStatus = async () => {
    if(bananaCrowdsaleIsOpen){
        document.getElementById("banana-crowdsale-status").innerHTML = "Available";
        document.getElementById("banana-crowdsale-status").style.color = "#28a745";
    }else{
        document.getElementById("banana-crowdsale-status").innerHTML = "Not Available";
        document.getElementById("banana-crowdsale-status").style.color = "#ff0000";
    }
}

const getEthToBananaRate = async () => {
    if(bananaCrowdsaleRate){
        document.getElementById("eth-to-banana-rate").innerHTML = "1 ETH = " + bananaCrowdsaleRate + " BNANA";
    }
}

const buyBananaToken = async () => {
    let buyAmount = document.getElementById("banana-crowdsale-buy-amount").value;

    if(buyAmount){
        let buyAmountWithDecimals = bananaDecimalsConverter(buyAmount, false);
        let weiToPay = buyAmountWithDecimals / bananaCrowdsaleRate;

        if(weiToPay){
            const buyBanana = await bananaCrowdsaleFirst.methods.buyTokens(myAddress);
            buyBanana.send({
                from: myAddress,
                value: weiToPay
            }).on("transactionHash", txHash => {
                console.log("Banana buy token transaction hash: ", txHash);
            }).on("receipt", receipt => {
                console.log("Banana buy token receipt: ", receipt);
                getBananaCrowdsaleTokenAvailable();
                getBananaCrowdsaleTokenSold();
                getMyBalance();
            }).on("error", (error, receipt) => {
                console.log("Error in Banana buy token trasaction: ", error);
                if(receipt && Object.keys(receipt).length > 0){
                    console.log("Error in Banana buy token trasaction, receipt: ", receipt);
                }
            });
        }
    }
}

window.addEventListener("load", async() => {
    if(initWeb3()){
        $.getJSON("Banana.json", bananaContractFile => {
            bananaAbi = bananaContractFile.abi;
            bananaAddress = bananaContractFile.networks["3"].address;
        }).done(async () => {
            // Read Banana crowdsale contract
            $.getJSON("BananaCrowdsaleFirst.json", bananaCrowdsaleFirst => {
                bananaCrowdsaleFirstAbi = bananaCrowdsaleFirst.abi;
                bananaCrowdsaleFirstAddress = bananaCrowdsaleFirst.networks["3"].address;
            }).done(async () => {
                bananaCrowdsaleFirst = new web3.eth.Contract(bananaCrowdsaleFirstAbi, bananaCrowdsaleFirstAddress);
                document.getElementById("banana-crowdsale-first-address").innerHTML = bananaCrowdsaleFirstAddress;
                bananaCrowdsaleWeiRaised = await bananaCrowdsaleFirst.methods.weiRaised().call();
                bananaCrowdsaleRate = await bananaCrowdsaleFirst.methods.rate().call();
                bananaCrowdsaleTokenAvailable = await bananaCrowdsaleFirst.methods.remainingTokens().call();
                bananaCrowdsaleIsOpen = await bananaCrowdsaleFirst.methods.isOpen().call();

                getBananaCrowdsaleTokenAvailable();
                getBananaCrowdsaleTokenSold();
                getBananCrowdsaleOpeningAndClosingTime();
                getBananaCrowdsaleStatus();
                getEthToBananaRate();

                document.getElementById("banana-crowdsale-buy-button").addEventListener("click", buyBananaToken);
            });

            banana = new web3.eth.Contract(bananaAbi, bananaAddress);
            bananaDecimals = await banana.methods.decimals().call();
            document.getElementById("banana-symbol").innerHTML = await banana.methods.symbol().call();
            document.getElementById("banana-address").innerHTML = bananaAddress;

            getBananaTotalSupply();
            getMyBalance();
            getCrowdsaleAllowance();
            document.getElementById("banana-approve-button").addEventListener("click", (e) => approveCrowdsale(e));
            document.getElementById("banana-increase-allowance-button").addEventListener("click", (e) => approveCrowdsale(e));
            document.getElementById("banana-decrease-allowance-button").addEventListener("click", (e) => approveCrowdsale(e));
        });
    }
});