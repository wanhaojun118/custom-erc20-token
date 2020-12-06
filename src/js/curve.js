var curve, curveAbi, curveAddress;
var curve500Staking, curve500StakingAbi, curve500StakingAddress;

window.addEventListener("load", async () => {
    if(initWeb3()){
        $.getJSON("Curve.json", curveContractFile => {
            curveAbi = curveContractFile.abi;
            curveAddress = curveContractFile.networks["3"].address;
        }).done(async() => {
            curve = new web3.eth.Contract(curveAbi, curveAddress);
            document.getElementById("curve-address").innerHTML = curveAddress;

            $.getJSON("Curve500Staking.json", curve500StakingContractFile => {
                curve500StakingAbi = curve500StakingContractFile.abi;
                curve500StakingAddress = curve500StakingContractFile.networks["3"].address;
            }).done(async () => {
                curve500Staking = new web3.eth.Contract(curve500StakingAbi, curve500StakingAddress);
                document.getElementById("curve500-staking-address").innerHTML = curve500StakingAddress;
            })
        });
    }
});