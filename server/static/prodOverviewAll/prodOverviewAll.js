var prodOverviewModuleApp = (function () {
    var config = {
        appName: "prodOverviewModule",
        test: "Test text",
        targetId: "prodOverviewModule-product-target-area",
        cardTemplateName: "productCardtemplate",
        productsOnRow: 3,
        serviceName: "prodOverviewService",
        productsOnPage: 6, // must be 2 * productsOnRow
        headerText: "Alla produkter",
        minimumSearchChars: 3

    }

    var appData = {
        cardTemplate: undefined,
        products: [],
        allProducts: [],
        currentpage: 0,
        lastProductclicked: undefined,
        scrollArrows: { left: undefined, right: undefined },

    }

    var init = function () { // This function is executed when module is loaded
        const productsloaded = loadProductData()

        $(document).ready(() => {
            loadService();
            productsloaded
                .then(() => {
                    loadTemplateCard()
                });
            // Below is watcher for input change registered
            $('#search-text').on('input', function (e) {
                search(true);
            });
            setScrollBtnHandlers();
            setNameNavBar();
        });

    }


    var loadProductData = function () {
        //this function loads the product data from api request - TODO: get way to know which products to load(cat/subCat) from previous page
        var url = '/api/products'  //build url
        return $.getJSON(url, function (data) {
            for (var i = 0; i < data.length; i++) {
                appData.allProducts[i] = data[i];
            }
            // console.log(appData.products.length);

        })
    }


    var loadService = function () {
        // console.log(typeof prodOverviewServiceApp !== 'undefined');
        if (typeof prodOverviewServiceApp !== 'undefined') { //check if service is already loaded
            console.log("Service already loaded!");
            appData.currentpage = prodOverviewServiceApp.getPageIndex()
            console.log("Got page index: " + appData.currentpage);

        } else {
            var baseLoadUrl = moduleLoaderApp.getLoadPath() + config.appName + "/" + config.serviceName;
            $.getScript((baseLoadUrl + ".js"), function (data) {

            })
                .fail(function (jqxhr, settings, exception) {
                    console.log("ERROR LOADING: ", exception);

                });
        }

    }

    var loadTemplateCard = function () {

        var baseLoadUrl = moduleLoaderApp.getLoadPath() + config.appName + "/" + config.cardTemplateName;
        $.get(baseLoadUrl + ".html",
            function (data) {
                appData.cardTemplate = $(data);
                let counter = insertProducts(getNextSetofProducts());
                checkRightArrow(counter)
            });

    }

    var gotoShoppingCart = function (e) {
        let $e = $(e)
        const productId = Number($e.attr("data-product-id"));
        // console.log(productId);
        shoppingCartService.addItemByID(productId);
        page("/varukorg");
    }

    var insertProducts = function (products) {
        // console.log(products);

        targetDiv = $("#" + config.targetId); //Get the div where products should be inserted
        targetDiv.empty(); //empty it

        var $row = $("<div>", { "class": "row" }); // Create a row-element for the products on the first row
        let counter = 0;
        products.forEach(product => { // loop through all products and insert the information into a template.
            // console.log(product);
            counter++;
            var productElement = buildProductCard(product);
            $row.append(productElement);
        });
        targetDiv.append($row); //Add row one with products to DOM ("targetDiv")
        return counter;
    }

    var buildProductCard = function (product) { // This funtion is used to build one product card using a template
        var card = appData.cardTemplate.clone(); // Clones the template to make a card
        // Below, the data specific for a product is entered
        card.find("#prod-name").text(product.name);
        card.find("#prod-price").text("Pris: " + product.price + "kr");
        card.find("#prod-img").attr("src", product.img);
        card.find("#prod-img").on('click', function () { page("/product/" + product.id) })
        card.find("#prod-more-btn").attr("data-product-id", product.id);
        card.find("#prod-varukorg-btn").attr("data-product-id", product.id);

        return card;
    }

    var gotoProductDetail = function (e) {
        // e is the incoming element. In this case the button which was pressed
        var $e = $(e) // wrapping e in jquery
        appData.lastProductclicked = Number($e.attr("data-product-id"));
        page("/product/" + appData.lastProductclicked);
        console.log("After page-change");
    }

    var getLastProductclicked = function () {
        return appData.lastProductclicked;
    }

    var setScrollBtnHandlers = function () { // Sets the callback function(s) for the "scroll arrows"
        $(document).ready(function () {
            appData.scrollArrows.left = $("#scroll-btn-left");
            appData.scrollArrows.left.click(-1, scrollPage);
            appData.scrollArrows.left.hide();
            appData.scrollArrows.right = $("#scroll-btn-right");
            appData.scrollArrows.right.click(1, scrollPage);
            // console.log(appData.scrollArrows.left.parent().css("display"));

        });
    }

    var scrollPage = function (incoming) { //handels basic logic when "scroll arrows" are pressed
        // appData.currentpage += incoming.data;
        prodOverviewServiceApp.setPageIndex(prodOverviewServiceApp.getPageIndex() + incoming.data); // tracking page index if user goes to new view.
        // console.log("IMG clicked! ", prodOverviewServiceApp.getPageIndex());
        scrollWasExecuted();


    }

    var scrollWasExecuted = function () {
        // The purpose of this function is to do things as a reaction on that "scroll event" of the page.
        // It is called from function scrollPage
        if (prodOverviewServiceApp.getPageIndex() > 0) {
            appData.scrollArrows.left.show();
        } else {
            appData.scrollArrows.left.hide();
        }
        let counter = insertProducts(getNextSetofProducts());
        checkRightArrow(counter);
        insertProducts(getNextSetofProducts());
    }

    var checkRightArrow = function (counter) {
        let mod = appData.products.length % config.productsOnPage;
        let numOfLoadedProducts = (prodOverviewServiceApp.getPageIndex() + 1) * config.productsOnPage;
        let numOfProductsTotal = appData.products.length;
        let test1 = (numOfLoadedProducts == numOfProductsTotal);
        let test2 = (counter < config.productsOnPage);
        let test3 = (mod === 0);
        // console.log({'test1':test1, 'test2':test2, 'test3':test3,});
        if (test2 || (test1 && test3)) {
            appData.scrollArrows.right.hide();
        }
        else {
            appData.scrollArrows.right.show();
        }
    }

    var onSmallScreen = function () {
        // This function depends on bootstrap adding the display none class on small screens to the "scroll arrow"-containers
        // on mobile devices. This info is used to determine if the user on a screen with a small width (usually a mobile device). 
        const cssLeft = appData.scrollArrows.left.parent().css("display")
        const cssRight = appData.scrollArrows.right.parent().css("display")
        return ((cssLeft === "none") && (cssRight === "none"));
    }

    var getNextSetofProducts = function () {
        // TODO: If user is to fast, the service "prodOverviewServiceApp" is not able to be loaded before used

        if (onSmallScreen()) {
            return appData.products;
        }

        var retArr = [];
        let start = prodOverviewServiceApp.getPageIndex() * config.productsOnPage;
        let end = (prodOverviewServiceApp.getPageIndex() * config.productsOnPage) + config.productsOnPage;
        if (end > appData.products.length) {
            end = appData.products.length;
        }
        for (let i = start; i < end; i++) {
            retArr.push(appData.products[i]);
        }
        // console.log(retArr);

        return retArr;
    }

    var setNameNavBar = function () {
        $(document).ready(() => {
            navbarApp.sitemapVarsSetter({ showall: config.headerText });
        })


        // console.log(config.headerText);
    }

    var search = (automatic) => {
        let userSearch = $("#search-text").val().toLowerCase()
        let targetEl = $("#" + config.targetId);
        if (userSearch.length < config.minimumSearchChars) {
            if (!automatic) {
                // console.log("Must be atleast three (3) chars!");
                targetEl.addClass("text-center")
                targetEl.html("<h3>Du måste skriva minst " + config.minimumSearchChars + " bokstäver!</h3>")
            }
            return
        }
        // console.log(userSearch);
        appData.products = appData.allProducts.filter((item) => {
            let pattern = new RegExp(userSearch)
            return pattern.test(item.name.toLowerCase());
        });
        if (appData.products.length < 1) {
            targetEl.html("<h3>Ingen produkt matchar din sökning!</h3>")
            return
        }
        insertProducts(getNextSetofProducts());
        
        prodOverviewServiceApp.setPageIndex(0);
        scrollWasExecuted();
    }

    init();
    return {
        gotoProductDetail: gotoProductDetail,
        getLastProductclicked: getLastProductclicked,
        gotoShoppingCart: gotoShoppingCart,
        search: search
        // init: init,
        // insertProducts: insertProducts
    }

})();
