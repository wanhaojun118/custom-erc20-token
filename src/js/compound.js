var compound, compoundAbi, compoundAddress, compoundDecimals;
var compound500Staking, compound500StakingAbi, compound500StakingAddress;

const getCompoundDecimals = async () => {
    compoundDecimals = await compound.methods.decimals().call();
}

const updateCompound500StakingMinionBalance = async () => {
    if(minion){
        const balance = await minion.methods.balanceOf(compound500StakingAddress).call();
        if(balance && document.getElementById("compound500-staking-balance")){
            document.getElementById("compound500-staking-balance").innerHTML = (balance / Math.pow(10, minionDecimals)).toFixed(minionDecimals);
        }
    }else{
        setTimeout(() => {
            updateCompound500StakingMinionBalance();
        }, 1000);
    }
}

const updateCompound500StakingTotalStake = async () => {
    const totalStake = await compound500Staking.methods.totalStakes().call();
    if(totalStake && document.getElementById("compound500-staking-total-stake")){
        document.getElementById("compound500-staking-total-stake").innerHTML = (totalStake / Math.pow(10, compoundDecimals)).toFixed(compoundDecimals);
    }
}

window.addEventListener("load", async () => {
    if(initWeb3()){
        $.getJSON("Compound.json", compoundContractFile => {
            compoundAbi = compoundContractFile.abi;
            compoundAddress = compoundContractFile.networks["3"].address;
        }).done(async() => {
            compound = new web3.eth.Contract(compoundAbi, compoundAddress);
            if(document.getElementById("compound-address")){
                document.getElementById("compound-address").innerHTML = compoundAddress;
            }

            $.getJSON("Compound500Staking.json", compound500StakingContractFile => {
                compound500StakingAbi = compound500StakingContractFile.abi;
                compound500StakingAddress = compound500StakingContractFile.networks["3"].address;
            }).done(async () => {
                compound500Staking = new web3.eth.Contract(compound500StakingAbi, compound500StakingAddress);
                if(document.getElementById("compound500-staking-address")){
                    document.getElementById("compound500-staking-address").innerHTML = compound500StakingAddress;
                }
                getCompoundDecimals();
                updateCompound500StakingMinionBalance();
                updateCompound500StakingTotalStake();
            })
        });
    }
});