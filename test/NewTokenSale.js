const NewToken = artifacts.require("./NewToken.sol");
const NewTokenSale = artifacts.require("./NewTokenSale.sol");

contract("NewTokenSale", function (accounts) {
  let tokenInstance;
  let tokenSaleInstance;
  const admin = accounts[0];
  const buyer = accounts[1];
  const tokenPrice = 1000000000000000;
  const tokensAvailable = 750000;
  let numberOfTokens;

  it("Initializes the contract with the correct values", function () {
    return NewTokenSale.deployed()
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "has contract address"); // Check token sale contract address
        return tokenSaleInstance.tokenContract(); // Get token contract instance
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "has token contract address"); // Check token contract address
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (price) {
        assert.equal(price, tokenPrice, "token price is correct");
      });
  });

  it("Facilitates token buying", function () {
    return NewToken.deployed()
      .then(function (instance) {
        // Grab token instance first
        tokenInstance = instance;
        return NewTokenSale.deployed();
      })
      .then(function (instance) {
        // Then grab token sale instance
        tokenSaleInstance = instance;
        // Provision 75% of all tokens to the token sale
        return tokenInstance.transfer(
          tokenSaleInstance.address,
          tokensAvailable,
          { from: admin }
        );
      })
      .then(function (receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice,
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Sell",
          'should be the "Sell" event'
        );
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          "logs the account that purchased the tokens"
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          "logs the number of tokens purchased"
        );
        return tokenSaleInstance.tokenSold();
      })
      .then(function (amount) {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increments the number of tokens sold"
        );

        return tokenInstance.balanceOf(buyer);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          numberOfTokens,
          "balance of buyer is correct"
        );

        return tokenInstance.balanceOf(tokenSaleInstance.address);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          tokensAvailable - numberOfTokens,
          "balance of contract is correct"
        );

        // Try to buy tokens different from the ether value
        return tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: 1,
        });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          JSON.stringify(error.message).indexOf("revert") >= 0,
          "msg.value must equal number of tokens in wei"
        );

        // Trying to buy tokens with amount that exceed the available amount in token sale contract
        return tokenSaleInstance.buyTokens(800000, {
          from: buyer,
          value: 800000 * tokenPrice,
        });
      })
      .then(assert.fail)
      .catch(function (error) {
        // console.log(error);
        assert(
          JSON.stringify(error.message).indexOf(
            "sender doesn't have enough funds to send tx"
          ) >= 0,
          "cannot purchase more tokens than available"
        );
      });
  });

  it("Ends token sale", function () {
    return NewToken.deployed()
      .then(function (instance) {
        // Grab token instance first
        tokenInstance = instance;
        return NewTokenSale.deployed();
      })
      .then(function (instance) {
        tokenSaleInstance = instance;

        // Try to end the sale by others rather than admin
        return tokenSaleInstance.endSale({ from: buyer });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          JSON.stringify(error.message).indexOf("revert") >= 0,
          "must be admin to end sale"
        );

        // End sale as admin
        return tokenSaleInstance.endSale({ from: admin });
      })
      .then(function (receipt) {
        return tokenInstance.balanceOf(admin);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          999990,
          "returns all unsold tokens to admin"
        );

        // Check eth balance of token sale contract
        return web3.eth.getBalance(tokenSaleInstance.address);
      })
      .then(function (balance) {
        assert.equal(
          balance,
          0,
          "make sure token sale contract's balance is 0"
        );
      });
  });
});
