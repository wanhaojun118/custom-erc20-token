App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,
    loading: false,
    tokenPrice: 0,
    tokenSold: 0,
    tokensAvailable: 750000,
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

                App.listenForEvents();  // Always listen to "Sell" event
                return App.render();
            });
        });
    },

    // Listen to "Sell" event(s) emitted from contract
    listenForEvents: function () {
        App.contracts.NewTokenSale.deployed().then(function (instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: "latest",
            }).watch(function (error, event) {
                console.log("Event triggered", event);
                App.render();
            });
        });
    },

    render: function () {
        if (App.loading) {
            return;
        }
        App.loading = true;

        const loader = $("#loader");
        const content = $("#content");
        loader.show();
        content.hide();

        // Load account data
        web3.eth.getCoinbase(function (err, account) {
            if (!err) {
                App.account = account;
                $("#account").html(App.account);
            }
        });

        // Load token sale contract
        App.contracts.NewTokenSale.deployed().then(function (instance) {
            newTokenSaleInstance = instance;
            return newTokenSaleInstance.tokenPrice();
        }).then(function (tokenPrice) {
            App.tokenPrice = tokenPrice;
            $("#token-price").html(web3.fromWei(App.tokenPrice.toNumber(), "ether"));

            return newTokenSaleInstance.tokenSold();
        }).then(function (tokenSold) {
            App.tokenSold = tokenSold.toNumber();
            $("#token-sold").html(App.tokenSold);
            $("#token-available").html(App.tokensAvailable);

            const progressPercent = (App.tokenSold / App.tokensAvailable) * 100;
            $("#progress").css("width", progressPercent + "%");

            // Load token contract
            App.contracts.NewToken.deployed().then(function (instance) {
                newTokenInstance = instance;
                return newTokenInstance.balanceOf(App.account);
            }).then(function (balance) {
                App.balance = balance.toNumber();
                $("#token-balance").html(App.balance);

                App.loading = false;

                loader.hide();
                content.show();
            });
        });
    },

    buyTokens: function () {
        $("#content").hide();
        $("#loader").show();

        const numberOfToken = $("#number-of-token").val();

        App.contracts.NewTokenSale.deployed().then(function (instance) {
            return instance.buyTokens(numberOfToken, {
                from: App.account,
                value: numberOfToken * App.tokenPrice,
                gas: 500000
            });
        }).then(function (result) {
            console.log("Tokens bought...");
            $("form").trigger("reset"); // reset number of tokens in form

            // Wait for Sell event to triggered a re-render
        });
    }
}

$(function () {
    $(window).on("load", function () {
        App.init();
    })
})