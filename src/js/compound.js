var compound, compoundAbi, compoundAddress;
var compound500Staking, compound500StakingAbi, compound500StakingAddress;

window.addEventListener("load", async () => {
    if(initWeb3()){
        $.getJSON("Compound.json", compoundContractFile => {
            compoundAbi = compoundContractFile.abi;
            compoundAddress = compoundContractFile.networks["3"].address;
        }).done(async() => {
            compound = new web3.eth.Contract(compoundAbi, compoundAddress);
            document.getElementById("compound-address").innerHTML = compoundAddress;

            $.getJSON("Compound500Staking.json", compound500StakingContractFile => {
                compound500StakingAbi = compound500StakingContractFile.abi;
                compound500StakingAddress = compound500StakingContractFile.networks["3"].address;
            }).done(async () => {
                compound500Staking = new web3.eth.Contract(compound500StakingAbi, compound500StakingAddress);
                document.getElementById("compound500-staking-address").innerHTML = compound500StakingAddress;
            })
        });
    }
});