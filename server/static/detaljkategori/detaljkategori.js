var detaljkategoriApp = (function () {

    var config = {
        appName: "detaljkategori",
        test: "Test text",
        targetId: "subcategory-target-div",
        categoryTemplateName: "subCategoryTemplate",
        imgLoadPath: "/static/images/"
    }

    var appData = {
        categoryTemplate: undefined,
        lastSubCategoryID: undefined
    }

    var init = function () { // This function is executed when module is loaded
        // console.log("detaljkatvyApp init!");
        let catId = moduleLoaderApp.getIdFor("catId");
        loadSubTemplateCategory(catId);
        setCatNameNavBar();
        moduleLoaderApp.setContianerWidth("75%");

        if (typeof prodOverviewServiceApp !== "undefined") {
            prodOverviewServiceApp.setPageIndex(0);
        }
    }

    var setCatNameNavBar = function () {
        $.getJSON("/api/category", function (data) {
            // const lastId = huvudkatvyApp.getLastCategoryID();
            const lastId = moduleLoaderApp.getIdFor("catId");
            // console.log(lastId);
            // console.log(data[0].catID);


            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].catID === Number(lastId)) {
                    navbarApp.sitemapVarsSetter({ huvud: data[i].catName });
                    break;
                }
            }
             navbarApp.sitemapVarsSetter({under: undefined})
        });
    }

    var loadSubTemplateCategory = function (categoryId) {
        // console.log("categoryId ", categoryId);

        var baseLoadUrl = moduleLoaderApp.getLoadPath() + config.appName + "/" + config.categoryTemplateName;

        $.get(baseLoadUrl + ".html",
            function (data) {
                appData.categoryTemplate = $(data);
                insertCategories(categoryId); //Just now mock data
            });
    }

    var insertCategories = function (categoryId) {


        $.getJSON("/api/category/" + categoryId, function (data) {

            targetDiv = $("#" + config.targetId); //Get the div where categories should be inserted
            targetDiv.empty(); //empty it
            for (var i = 0, len = data.length; i < len; i++) {
                // console.log(data[i]);

                var subCategoryElement = buildSubCategory(data[i]);
                targetDiv.append(subCategoryElement);
            }
        });
    }

    var buildSubCategory = function (category) { // This funtion is used to build one categoryCard using a template
        var subCategoryCard = appData.categoryTemplate.clone(); // Clones the template to make a categoryCard
        subCategoryCard.find("#subcategory-id").attr("subcategory-id", category.subcatID);
        // console.log(category.subcatName);
        subCategoryCard.find("#subcategory-id").html("<h1 class='card-title mt-5'>" + category.subcatName + "</h1>");
        subCategoryCard.find("img").attr("src", config.imgLoadPath + category.subcatName +".jpg")

        // console.log(category.subcatID)
        // console.log(category.subcatName)

        return subCategoryCard;
    }

    var lastClickedSubCategory = function (e) {
        var $e = $(e)
        appData.lastSubCategoryID = $e.attr("subcategory-id");
        page(page.current + "/" + appData.lastSubCategoryID);
        // moduleLoaderApp.loadModule("prodOverviewModule");
        
        // moduleLoaderApp.loadModule("subsubCatView"); FLYTTA TILL MODULE LOADER
        // console.log("SubCategory name:", getLastSubCategoryID());
    }

    var getLastSubCategoryID = function () { //inparameter här

        return appData.lastSubCategoryID; //Ska vara id för aktuell kategori, för tillfället id = 1 konstant
    }

    var test = function () {
        // console.log("Running text");

    }

    init();

    return {
        lastClickedSubCategory: lastClickedSubCategory,
        loadSubTemplateCategory: loadSubTemplateCategory,
        getLastSubCategoryID: getLastSubCategoryID,
        test: test
    }

})();