# Custom ERC-20 Token (N3 Token) - Local Network with Ganache (OBSOLETED)

## Back End Ethereum Blockchain
Install truffle as global package:
> npm install -g truffle

Ensure Ganache is running and connected to **http://127.0.0.1:7545**

Deploy NewToken and NewTokenSale contracts to local blockchain:
> truffle migrate --reset

Run test on deployed contracts:
> truffle test

###### Transfer token from Token contract to Token Sale contract:
Go to truffle console:
> truffle console

Deploy token contract:
> NewToken.deployed().then(function(i){ tokenInstance = i; });

Deploy token sale contract:
> NewTokenSale.deployed().then(function(i){ tokenSaleInstance = i; });

Get first account (admin) from Ganache
> web3.eth.getAccounts().then(function(acc){ admin=acc[0]; });

Transfer 750000 N3 token from token contract to token sale contract, so that token sale contract has token for sale:
> tokenInstance.transfer(tokenSaleInstance.address, 750000, { from: admin });

## Front End Web Application
For current phase, only run front end application using **develop** branch.

Install necessary packages:
> npm install

Ensure Ganache is running and connected to **http://127.0.0.1:7545**

Ensure Metamask is installed and connected to Ganache local chain. Import one of eth account to Metamask.

Run web application locally:
> npm run dev


# Custom ERC-20 Token (N3 Token) - Ropsten Testnet

Install necessary packages:
> npm install

Run web application:
> npm run dev





