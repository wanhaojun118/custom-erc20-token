<template id="demo">
  <div class="demo">
    <h1>{{ variables }}</h1>
    <button @click="sample">Sample</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Web3 from 'web3'
import { WebFirebaseConnector } from '../services/firebase-connector'

// const contract = require("@truffle/contract");

export default {
  name: 'Demo',
  data: function() {
      return {
          title: 'This is a demo page',
          web3Provider: null,
          account: 0x0,
          loading: false,
          tokenPrice: 0,
          tokenSold: 0,
          tokensAvailable: 750000,
          tokenLeft: 0,
      }
  },
  computed: {
    variables: function() {
      return {
        web3Provider: this.web3Provider,
        account: this.account,
        loading: this.loading,
        tokenPrice: this.tokenPrice,
        tokenSold: this.tokenSold,
        tokensAvailable: this.tokensAvailable,
        tokenLeft: this.tokenLeft,
      }
    }
  },
  methods: {
    sample: () => {
      console.log('Hello World')
    }
  },
  async created() {
      
      // web3 initialization
      this.web3Provider = (Web3 && Web3.currentProvider) ? Web3.currentProvider : new Web3.providers.HttpProvider("http://bornluck01.ddns.net:7545");
      this.web3Instance = new Web3(this.web3Provider);

      // contract initialization
      const newTokenSale = await new WebFirebaseConnector().get('contracts', 'NewTokenSale')
      const newTokenSaleContract = TruffleContract(newTokenSale);
      newTokenSaleContract.setProvider(this.web3Provider);
      newTokenSaleContract.deployed()
      //.then(function (resp) {
      //   console.log("Token sale contract's address: ", resp.address);
      // });

      const newToken = await new WebFirebaseConnector().get('contracts', 'NewToken')
      const newTokenContract = TruffleContract(newToken);
      newTokenContract.setProvider(this.web3Provider);
      newTokenContract.deployed()
      // .then(function (resp) {
      //   console.log("Token contract's address: ", resp.address);
      // });

  }
}
</script>