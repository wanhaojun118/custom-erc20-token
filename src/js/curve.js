var curve, curveAbi, curveAddress, curveDecimals;
var curve500Staking, curve500StakingAbi, curve500StakingAddress;

const getCurveDecimals = async () => {
    curveDecimals = await curve.methods.decimals().call();
}

const updateCurve500StakingMinionBalance = async () => {
    if(minion){
        const balance = await minion.methods.balanceOf(curve500StakingAddress).call();
        if(balance && document.getElementById("curve500-staking-balance")){
            document.getElementById("curve500-staking-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
        }
    }else{
        setTimeout(() => {
            updateCurve500StakingMinionBalance();
        }, 1000);
    }
}

const updateCurve500StakingTotalStake = async () => {
    const totalStake = await curve500Staking.methods.totalStakes().call();
    if(totalStake && document.getElementById("curve500-staking-total-stake")){
        document.getElementById("curve500-staking-total-stake").innerHTML = (totalStake / Math.pow(10, curveDecimals)).toFixed(curveDecimals);
    }
}

window.addEventListener("load", async () => {
    if(initWeb3()){
        $.getJSON("Curve.json", curveContractFile => {
            curveAbi = curveContractFile.abi;
            curveAddress = curveContractFile.networks["3"].address;
        }).done(async() => {
            curve = new web3.eth.Contract(curveAbi, curveAddress);
            if(document.getElementById("curve-address")){
                document.getElementById("curve-address").innerHTML = curveAddress;
            }

            $.getJSON("Curve500Staking.json", curve500StakingContractFile => {
                curve500StakingAbi = curve500StakingContractFile.abi;
                curve500StakingAddress = curve500StakingContractFile.networks["3"].address;
            }).done(async () => {
                curve500Staking = new web3.eth.Contract(curve500StakingAbi, curve500StakingAddress);
                if(document.getElementById("curve500-staking-address")){
                    document.getElementById("curve500-staking-address").innerHTML = curve500StakingAddress;   
                }
                getCurveDecimals();
                updateCurve500StakingMinionBalance();
                updateCurve500StakingTotalStake();
            })
        });
    }
});