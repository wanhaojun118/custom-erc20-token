App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,
    init: function () {
        console.log("App initialized...");
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 != 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
            web3 = new Web3(App.web3Provider);
        }

        return App.initContracts();
    },

    initContracts: function () {
        $.getJSON("NewTokenSale.json", function (newTokenSaleContract) {
            App.contracts.NewTokenSale = TruffleContract(newTokenSaleContract);
            App.contracts.NewTokenSale.setProvider(App.web3Provider);
            App.contracts.NewTokenSale.deployed().then(function (newTokenSale) {
                console.log("Token sale contract's address: ", newTokenSale.address);
            });
        }).done(function () {
            $.getJSON("NewToken.json", function (newTokenContract) {
                App.contracts.NewToken = TruffleContract(newTokenContract);
                App.contracts.NewToken.setProvider(App.web3Provider);
                App.contracts.NewToken.deployed().then(function (newToken) {
                    console.log("Token contract's address: ", newToken.address);
                });

                return App.render();
            });
        });
    },

    render: function () {
        // Load account data
        web3.eth.getCoinbase(function (err, account) {
            if (!err) {
                App.account = account;
                $("#account").html(App.account);
            }
        })
    }
}

$(function () {
    $(window).on("load", function () {
        App.init();
    })
})