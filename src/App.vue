<template>
  <div id="app" class="size">
    <div id="navbar">
      <div id="home-navigator">
        <img alt="Vue logo" src="./assets/logo.png">
        <h1>{{ title }}</h1>
      </div>
      
      <div id="nav" class="float-nav size">
        <label class="nav-font"><router-link to="/">Home</router-link></label>
        <label class="nav-font"><router-link to="/farms">Farms</router-link></label>
        <label class="nav-font"><router-link to="/rules">Rules</router-link></label>
        <label class="nav-font"><router-link to="/about">About</router-link></label>
        <!-- <label class="nav-font"><router-link to="/demo">Demo</router-link></label> -->
      </div>

      <div id="profile">
        <button id="show-modal" @click="showMyWallet">
          <label>
            {{ myWallet }}
          </label>
        </button>
        <myWalletModal v-show="isMyWalletVisible" @close="closeMyWallet" :walletInfo="walletInfo" :contracts="contracts"/>
      </div>
    </div>
    
    <div id="center-content" class="center-logo">
      <img alt="Vue logo" src="./assets/logo.png">
    </div>
    <div class="size">
      <router-view :walletInfo="walletInfo"/>
    </div>
    <div id="footer">
      <a href="javascript:">Telegram</a>
      <a href="javascript:">Discord</a>
      <a href="javascript:">Twitter</a>
      <a href="javascript:">Medium</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Web3 from 'web3'
import myWalletModal from './components/MyWallet.vue';

var contract = require("@truffle/contract");
var newTokenSaleContract = require("../build/contracts/NewTokenSale.json");
var newTokenContract = require("../build/contracts/NewToken.json");

export default {
  name: 'App',
  components: {
    myWalletModal
  },
  data: function () {
    return {
      title: 'Dragon Ball',
      myWallet: 'My Wallet',
      isMyWalletVisible: false,
      web3Provider: null,
      contracts: {
      },
      walletInfo: {
        accountCoinBase: 0x0,
        tokenPrice: null,
        tokenPriceWei: null,
        tokenBalance: null,
        tokenSold: null,
        tokenLeft: null,
        balance: null
      }
    }
  },
  methods: {
    showMyWallet() {
      this.isMyWalletVisible = true;
    },
    closeMyWallet() {
      this.isMyWalletVisible = false;
    },
    initContracts() {
      var windowWeb3 = window.web3
      var newTokenSaleInstance
      var newTokenInstance
      var tokensAvailable = 750000

      if (typeof windowWeb3 !== 'undefined') {
        this.web3Provider = windowWeb3
      } else {
        this.web3Provider = new Web3.providers.HttpProvider("http://bornluck01.ddns.net:7545");
      }

      web3.eth.getCoinbase((err, account) => {
        if (!err) {
            this.walletInfo.accountCoinBase = account;
            console.log("account: ", this.walletInfo.accountCoinBase)
        }
      });

      this.contracts.NewTokenSale = TruffleContract(newTokenSaleContract)
      this.contracts.NewTokenSale.setProvider(this.web3Provider.currentProvider)
        this.contracts.NewTokenSale.deployed().then((newTokenSale) => {
            console.log("Token sale contract's address: ", newTokenSale.address);
        });

      this.contracts.NewToken = TruffleContract(newTokenContract);
      this.contracts.NewToken.setProvider(this.web3Provider.currentProvider);
      this.contracts.NewToken.deployed().then((newToken) => {
          console.log("Token contract's address: ", newToken.address);
      });

      this.contracts.NewTokenSale.deployed().then((instance) => {
        instance.Sell({}, {
            fromBlock: 0,
            toBlock: "latest",
        })
      });

      this.contracts.NewTokenSale.deployed().then((instance) => {
        newTokenSaleInstance = instance;
        return newTokenSaleInstance.tokenPrice();
      }).then((tokenPrice) => {
        this.walletInfo.tokenPrice = tokenPrice
        this.walletInfo.tokenPriceWei = web3.fromWei(tokenPrice.toNumber(), "ether")
        console.log("tokenPrice wei:", web3.fromWei(tokenPrice.toNumber(), "ether"))
        return newTokenSaleInstance.tokenSold();
      }).then((tokenSold) => {
        this.walletInfo.tokenSold = tokenSold.toNumber()
        console.log("tokenSold number:", tokenSold.toNumber())

        //progress bar rendering 
        const progressPercent = (tokenSold.toNumber() / tokensAvailable) * 100;
        
        this.contracts.NewToken.deployed().then((instance) => {
            newTokenInstance = instance;
        return newTokenInstance.balanceOf(newTokenSaleInstance.address);
        }).then((tokenSaleBalance) => {
          this.walletInfo.tokenLeft = tokenSaleBalance.toNumber()
          console.log("tokenSaleBalance number:", tokenSaleBalance.toNumber())
          return newTokenInstance.balanceOf(this.walletInfo.accountCoinBase);
        }).then((balance) => {
          this.walletInfo.balance = balance.toNumber()
          console.log("balance number:", balance.toNumber())
        });
      });
    }
  },
  // fetch data implementation to get web3 info & web3 api info
  async created() {
    // setInterval(() => {
    //   this.$set(this.msgObj, 'balance', this.msgObj.balance + 1)
    // }, 5000) 
    if (!(window).ethereum) {
      console.log("Metamask not found")
      window.alert('Please install MetaMask first.');
      return;
    } else {
      console.log("Metamask found")
      this.initContracts()
      try {
        var { ethereum } = window;
        //Will Start the MetaMask Extension
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.log("error")
        console.error(error);
      }
    }
  }
}
</script>

<style lang="scss">
html {
  background-color: #f0e7ea;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  margin: auto;
  padding: 0;
}

#navbar {
  display: flex;
  flex-direction: row;
}

#home-navigator {
  display: flex;
  flex-direction: row;
  min-width: 250px;

  img {
    margin: 16px 10px;
    width: 50px;
    height: 50px;
  }
}

#center-content {
  text-align: center;
}

#nav {
  label {
    padding: 10px;
  }

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    border-radius: 5px;

    &.router-link-exact-active {
      color: #42b983;

    }
  }
}

#profile {
  width: 100%;
  text-align: right;
}

.nav-font {
  font-size: 16pt;
}

#footer {
  margin: 30px 5px;
  a {
    text-decoration: none;
    color: #2c3e50;
    margin: 20px 10px;
    padding: 5px;
  }
}

@media screen and (min-width: 1480px) {
  #nav {
    padding: 28px 20px 0 20px;
  }

  .size {
    max-width: 1480px;
  }
}

@media screen and (min-width: 980px) and (max-width: 1479px) {
  #nav {
    padding: 28px 20px 0 20px;
  }

  .size {
    max-width: 980px;
  }
}

@media screen and (min-width: 720px) and (max-width: 979px) {
  #nav {
    padding: 28px 0 0 0;
  }

  .size {
    max-width: 720px;
  }

  .center-logo {
    padding-top: 20px;
  }

  .float-nav {
    position: absolute;
    margin: 50px auto;
    width: 100%;
  }
}

@media screen and (max-width: 719px) {
  #nav {
    padding: 28px 0 0 0;
  }

  .center-logo {
    padding-top: 20px;
  }

  .size {
    max-width: 350px;
  }

  .float-nav {
    position: absolute;
    margin: 50px auto;
    width: 100%;
  }
}

</style>
