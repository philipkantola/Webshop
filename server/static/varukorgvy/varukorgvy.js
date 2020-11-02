var varukorgvyApp = (function () {
    var config = {
        appName: "varukorgvyApp",
        checkoutPath: "/checkout",
        checkoutPathJS: "/static/checkout.js"
    }

    var appdata = {
        sumPrice: 0,
        allProducts: undefined,
        dialogWindow: undefined,
        dim: undefined,
        table: undefined
    }

    var init = function () {

        $(document).ready(function () {
            moduleLoaderApp.setContianerWidth("75%");
            navbarApp.ContPrevBtnswap();
            navbarApp.setSitemapText("Din varukorg");
            getAllProducts();
            appdata.dim = $("#dim");
            appdata.table = $("table");
            if (shoppingCartService.getAllItemsInCart().length === 0) {
                $("#paymentbutton").hide();
                $("#deleteallbtn").prop("disabled", true)
            }
        })
    }

    var addProducts = function () {
        var productsArray = shoppingCartService.getAllItemsInCart();
        for (i = 0; i < productsArray.length; i++) {
            addRow(productsArray[i], i);
        }
    }

    var getAllProducts = function () {
        $.get("/api/products", function (data) {
            appdata.allProducts = data;
            // console.log(appdata.allProducts);
            addProducts();
        });


    }

    var addRow = function (product, index) {
        // console.log("product", product);
        let currenctProduct;

        for (let index = 0; index < appdata.allProducts.length; index++) {
            const element = appdata.allProducts[index];
            if (element.id === product.id) {
                currenctProduct = element
                break;
            }
        }

        appdata.sumPrice += Number(product.amount * currenctProduct.price);
        $("#price-sum").text(appdata.sumPrice + " kr");

        let colname = $('<th scope="row">' + currenctProduct.name + '</th>');
        let colprice = $('<td>' + currenctProduct.price + " kr" + '</td>');
        let colamount = $('<td>' + product.amount + " st" + '</td>');
        let coltotal = $('<td>' + (Number(currenctProduct.price) * Number(product.amount)) + " kr" + '</td>');
        let colremove = $('<td>' + '<button data-product-id="' + currenctProduct.id + '" class="btn btn-danger" onclick="varukorgvyApp.removeItemById(this)">Ta bort vara</button>' + '</td>');



        let output = $('<tr></tr>');
        output.append([colname, colprice, colamount, coltotal, colremove]);
        output.insertBefore("#table-foot");


    }

    var clearCart = function () {
        // if (window.confirm("Vill du verkligen tömma varukorgen?")) {
        shoppingCartService.removeAllItems();
        reloadCart();
        // }


    }

    var removeItemById = function (e) {
        // e is the incoming element. In this case the button which was pressed
        var $e = $(e) // wrapping e in jquery

        let productId = Number($e.attr("data-product-id"));
        // console.log("Got id: ", productId);
        shoppingCartService.removeItemByID(productId);
        reloadCart();

    }

    var reloadCart = function () {
        moduleLoaderApp.loadModule('varukorgvy');
        navbarApp.ContPrevBtnswap();
    }
    var toPayment = function () {
        let itemsInCart = shoppingCartService.getAllItemsInCart()
        moduleLoaderApp.loadManually(config.checkoutPath, itemsInCart, config.checkoutPathJS)
    }


    init();
    return {
        clearCart: clearCart,
        removeItemById: removeItemById,
        toPayment: toPayment

    }



})();