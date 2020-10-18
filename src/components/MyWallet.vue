<template>
<transition name="modal-fade">
    <div class="my-wallet-modal">
        <div class="modal"
                role="dialog"
                aria-labelledby="modalTitle"
                aria-describedby="modalDescription">
            <header class="modal-header" id="modalTitle">
                <slot name="header">
                    <p>My Wallet</p>
                    <button type="button" class="btn-close" @click="close" aria-label="Close modal"> 
                        X 
                    </button>
                </slot>
            </header>

            <section class="modal-body" id="modalDescription">
                <slot name="body">
                    <p>Token price is {{walletInfo.tokenPriceWei}}. You currently have {{walletInfo.balance}} N3</p>
                    <p><input v-model="numberOfToken" type="number" pattern="[0-9]"></p>
                    <button type="button" class="btn-green" @click="butTokens">
                        Buy Token(s)
                    </button>
                    <p>{{walletInfo.tokenSold}} token(s) sold</p>
                    <p>{{walletInfo.tokenLeft}} token(s) left</p>
                </slot>
            </section>

            <footer class="modal-footer">
                <slot name="footer">
                    <p>Your Account: {{walletInfo.accountCoinBase}}</p>
                    <!-- <button type="button" class="btn-green" @click="close" aria-label="Close modal">
                        Close me!
                    </button> -->
                </slot>
            </footer>
        </div>
    </div>
</transition>
</template>

<script>
  export default {
    name: 'myWalletModal',
    // props & compute is read only
    props: {
        msg: String,
        msgObj: Object,
        walletInfo: Object,
        contracts: {}
    },
    data: function() {
        return {
            numberOfToken: null
        }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      butTokens() {
        this.contracts.NewTokenSale.deployed().then((instance) => {
            return instance.buyTokens(this.numberOfToken, {
                from: this.walletInfo.accountCoinBase,
                value: this.numberOfToken * this.walletInfo.tokenPrice,
                gas: 500000
            });
        }).then((result) => {
            console.log("Tokens bought...");
        });
      }
    },
    watch: {
        // 'msgObj.balance':function(val) {
        //     console.log("in wallet:", val)
        // }
    }
  };
</script>

<style>
.modal-fade-enter,
.modal-fade-leave-active {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .5s ease
}

.my-wallet-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    z-index: 2;

    @media screen and (max-width: 992px) {
      width: 90%;
    }
}

.modal-header {
    border-bottom: 1px solid #eeeeee;
    padding: 10px 20px 10px;
    color: #4AAE9B;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    text-align: center;
}

.modal-footer {
    padding: 10px 20px 10px;
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
    text-align: center;
}

.modal-body {
    padding: 10px 20px 20px;
    position: relative;
    justify-content: space-between;
    text-align: center;
}

.btn-close {
    width: 30px;
    height: 30px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
}

.btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
}
</style>