var subsubCatViewApp = (function () {

    var config = {
        appName: "subsubCatView",
        test: "Test text",
        targetId: "subsubcatview-target-area",
        categoryTemplateName: "subsubCategoryTemplate",
        imgLoadPath: "/static/images/",
        catNo: moduleLoaderApp.getIdFor("catId"),
        subNo: moduleLoaderApp.getIdFor("subCatId")

    }

    var appData = {
        categoryTemplate: undefined,
        lastSubSubCategoryID: undefined
    }

    var init = function () { // This function is executed when module is loaded
        // console.log("huvudkatvyApp init!");
        moduleLoaderApp.setContianerWidth("75%");
        loadSubSubTemplateCategory(config.catNo, config.subNo);
        setCatNameNavBar();

        try { // This try-catch is used to avoid error on first load. This is not a problem in later use of the application.
            navbarApp.clearAll();
            navbarApp.hideContinueBtn();
        }
        catch (e) {
            //    console.log(e);
        }

    }

    var setCatNameNavBar = function () {
        $.getJSON("/api/category", function (data) {
            const lastId = moduleLoaderApp.getIdFor("catId");
            // console.log(lastId);
            // console.log(data[0].catID);

            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].catID === Number(lastId)) {
                    navbarApp.sitemapVarsSetter({ huvud: data[i].catName });
                    break;
                }
            }
            navbarApp.sitemapVarsSetter({ underunder: undefined })
        });

        $.getJSON("/api/category/" + config.catNo, function (data) {
            // const lastId = detaljkategoriApp.getLastSubCategoryID();
            const lastId = config.subNo;
            // console.log(lastId);
            // console.log(data[0].catID);

            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].subcatID === Number(lastId)) {
                    navbarApp.sitemapVarsSetter({ under: data[i].subcatName });
                    break;
                }
            }
            navbarApp.sitemapVarsSetter({ underunder: undefined })
        });

    }

    var loadSubSubTemplateCategory = function (categoryID, subcategoryID) {
        // console.log("loadTemplateCategory!!!");

        var baseLoadUrl = moduleLoaderApp.getLoadPath() + config.appName + "/" + config.categoryTemplateName;

        $.get(baseLoadUrl + ".html",
            function (data) {
                appData.categoryTemplate = $(data);
                insertCategories(categoryID, subcategoryID);
            });
    }
    var insertCategories = function (categoryID, subcategoryID) {

        $.getJSON("/api/category/" + categoryID + "/" + subcategoryID, function (data) {
            targetDiv = $("#" + config.targetId); //Get the div where categories should be inserted
            targetDiv.empty(); //empty it
            for (var i = 0, len = data.length; i < len; i++) {
                // console.log(data[i]);
                var subSubcategoryElement = buildSubSubCategory(data[i]);
                targetDiv.append(subSubcategoryElement);

            }


        });

        // categories.forEach(category => { // loop through all categories and insert the information into a template.
        //     var categoryElement = buildCategory(category);
        //     targetDiv.append(categoryElement);
        // });
    }

    var buildSubSubCategory = function (category) { // This funtion is used to build one categoryCard using a template
        // console.log(category);

        var subSubcategoryCard = appData.categoryTemplate.clone(); // Clones the template to make a categoryCard
        subSubcategoryCard.find("#subsubcategory-id").attr("subsubcategory-id", category.subsubcatID);
        subSubcategoryCard.find("#subsubcategory-id").html("<h1 class='card-title mt-5'>" + category.subsubcatName + "</h1>");
        subSubcategoryCard.find("img").attr("src", config.imgLoadPath + category.subsubcatName + ".jpg")
        // console.log(category.catID)
        // console.log(category.catName)

        return subSubcategoryCard;
    }

    var lastClickedSubSubCategory = function (e) {
        var $e = $(e)
       
        appData.lastSubSubCategoryID = $e.attr("subsubcategory-id");
        
        page(page.current + "/" + appData.lastSubSubCategoryID);
        // moduleLoaderApp.loadModule("prodOverviewModule");
        // console.log("Category name:", getLastCategoryID());
    }

    var getLastSubSubCategoryID = function () { //inparameter här
        return appData.lastSubSubCategoryID;
    }

    init();

    return {
        lastClickedSubSubCategory: lastClickedSubSubCategory,
        getLastSubSubCategoryID: getLastSubSubCategoryID,


        // init: init,
        // insertCategories: insertCategories,
        // loadTemplateCategory: loadTemplateCategory
    }
})();