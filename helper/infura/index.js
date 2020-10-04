const Web3 = require('web3');
// require('dotenv').config({ path: '/' })
require('dotenv').config({ path: `${__dirname}/../../.env` });
// console.log("infura project id: ", process.env.INFURA_PROJECT_ID);
// console.log("dir: ", __dirname);

// Loading the contract ABI
// (the results of a previous compilation step)
const fs = require('fs');
const { abi } = JSON.parse(fs.readFileSync("../../build/contracts/NewToken.json"));

async function transferToTokenSale() {
    // Configuring the connection to an Ethereum node
    const network = 'ropsten';
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        )
    );

    // console.log("process env token address:", process.env.TOKEN_ADDRESS);

    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        process.env.PRIVATE_KEY
    );

    console.log("signer:", signer);

    // Add existing account to web3 wallet
    // web3.eth.accounts.wallet.add(signer);
    // Creating a Contract instance
    const contract = new web3.eth.Contract(
        abi,
        // Replace this with the address of your deployed contract
        process.env.TOKEN_ADDRESS
    );

    // Issuing a transaction that calls the `name` method
    const tx = contract.methods.name();

    // const receipt = await tx
    //     .send({
    //         from: signer.address,
    //         gas: await tx.estimateGas(),
    //     })
    //     .once('transactionHash', txhash => {
    //         console.log(`Mining transaction ...`);
    //         console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    //     });
    const tokenName = await tx.call();
    console.log("token name: ", tokenName);

    // The transaction is now on chain!
    // console.log(`Mined in block ${receipt.blockNumber}`);
}

transferToTokenSale();