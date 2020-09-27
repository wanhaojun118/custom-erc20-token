##### Back End Ethereum Blockchain #####
Install truffle as global package:
npm install -g truffle

Ensure Ganache is running and connected to http://127.0.0.1:7545

Deploy NewToken and NewTokenSale contracts to local blockchain:
truffle migrate --reset

Run test on deployed contracts:
truffle test


##### Front End Web Application #####
For current phase, only run front end application using "develop" branch.

Install necessary packages:
npm install

Ensure Ganache is running and connected to http://127.0.0.1:7545

Ensure Metamask is installed and connected to Ganache local chain. Import one of eth account to Metamask.

Run web application locally:
npm run dev

