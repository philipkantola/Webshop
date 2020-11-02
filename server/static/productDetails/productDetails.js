var productDetailsApp = (function () {
  var config = {
    appName: "productDetails",
    test: "Test text",
    targetId: "productDetails-target-area",
    nameDetailsId: "nameDetails",
    descriptionDetailsId: "descriptionDetails",
    priceDetailsId: "priceDetails",
    caregoryTemplateName: "productDetails",
    loadPath: "/static/"
  }

  appData = {
    productId: undefined
  }

  var init = function () {
    console.log("productDetailsApp init!");
    moduleLoaderApp.setContianerWidth("75%");
    
    printProductDetails();
    navbarApp.hideContinueBtn();
  }

  //skickar rätt produktdetaljer till rätt div
  var printProductDetails = function () {
    appData.productId = Number(moduleLoaderApp.getIdFor("productId"));
    // console.log(appData.productId);
    // console.log(typeof appData.productId);
    
    $.getJSON("/api/products/" + appData.productId, function (result) {
      $("#" + config.targetId).attr("src", result[0]["img"]);
      var name = result[0]["name"]
      $("#" + config.nameDetailsId).append(name); //Get the div where products should be inserted

      // navbarApp.sitemapVarsSetter({huvud:"testH", under:"testU", produkt: name });
      
      $("#" + config.descriptionDetailsId).append(result[0]["desc"]);
      $("#" + config.priceDetailsId).append(result[0]["price"] + " kr");
      navbarApp.setSitemapText("Produktinformation")
    });
  }

  var gotoShoppingCart = function () {
    shoppingCartService.addItemByID(appData.productId);
    page("/varukorg")
  }

  init();


  return {
    // printProductDetails: printProductDetails
    gotoShoppingCart: gotoShoppingCart
  }


})();