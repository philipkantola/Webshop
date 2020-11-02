var huvudkatvyApp = (function () {
    
    var config = {
        appName: "huvudkatvy",
        test: "Test text",
        targetId: "huvudkatvy-target-area",
        categoryTemplateName: "categoryTemplate",
        imgLoadPath: "/static/images/"
    }

    var appData = {
        categoryTemplate: undefined,
        lastCategoryID: undefined
    }

    var init = function () { // This function is executed when module is loaded
        // console.log("huvudkatvyApp init!");
        moduleLoaderApp.setContianerWidth("75%");
        loadTemplateCategory();
        
        try { // This try-catch is used to avoid error on first load. This is not a problem in later use of the application.
            navbarApp.clearAll();
            navbarApp.hideContinueBtn();
           }
           catch (e) {
            //    console.log(e);
           }
         
    }

    var loadTemplateCategory = function () {
        // console.log("loadTemplateCategory!!!");

        var baseLoadUrl = moduleLoaderApp.getLoadPath() + config.appName + "/" + config.categoryTemplateName;
       
        $.get(baseLoadUrl + ".html",
            function (data) {
                appData.categoryTemplate = $(data);
                insertCategories(appData.categories);
            });
    }
    var insertCategories = function () {

        $.getJSON("/api/category", function(data){
            targetDiv = $("#" + config.targetId); //Get the div where categories should be inserted
            const showAllCard = targetDiv.find("#showAllProducts");
            targetDiv.empty(); //empty it
            targetDiv.append(showAllCard);
            for (var i = 0, len = data.length; i < len; i++) {
                // console.log(data[i]);
                var categoryElement = buildCategory(data[i]);
                targetDiv.append(categoryElement);
                
            }

        
        });

        // categories.forEach(category => { // loop through all categories and insert the information into a template.
        //     var categoryElement = buildCategory(category);
        //     targetDiv.append(categoryElement);
        // });
    }

    var buildCategory = function (category) { // This funtion is used to build one categoryCard using a template
        // console.log(category);
        
        var categoryCard = appData.categoryTemplate.clone(); // Clones the template to make a categoryCard
        categoryCard.find("#category-id").attr("category-id", category.catID);
        categoryCard.find("#category-id").html("<h1 class='card-title mt-5'>" + category.catName + "</h1>");
        categoryCard.find("img").attr("src", config.imgLoadPath + category.catName +".jpg")
        // console.log(category.catID)
        // console.log(category.catName)
        
        return categoryCard;
    }

    var lastClickedCategory = function (e) {
        var $e = $(e)
        appData.lastCategoryID = $e.attr("category-id");
        page("/"+appData.lastCategoryID);
        // moduleLoaderApp.loadModule("detaljkategori");
        // console.log("Category name:", getLastCategoryID());
    }

    var getLastCategoryID = function (){ //inparameter här
        return appData.lastCategoryID; //Ska vara id för aktuell kategori, för tillfället id = 1 konstant
    }

    var showAll = function (){
        // moduleLoaderApp.loadModule("prodOverviewAll");
        page("search")
    }



    init();
    
    return {

        // Eventuellt att denna ej behövs
        lastClickedCategory : lastClickedCategory,
        getLastCategoryID : getLastCategoryID,
        showAll: showAll


        // init: init,
        // insertCategories: insertCategories,
        // loadTemplateCategory: loadTemplateCategory
    }
})();