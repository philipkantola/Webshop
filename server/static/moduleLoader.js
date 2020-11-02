


//should rename this to shoppingApp (?)
var moduleLoaderApp = (function () {
    "use strict"
    var config = { //Configs for the app
        loadPath: "/static/",
        targetElementId: "#main-shopping-area"
    };

    var appData = {
        currentModule: undefined,
        previousModule: undefined,
        catId: undefined,
        subCatId: undefined,
        subSubCatId: undefined,
        productId: undefined,
    }

    var init = function () {
        console.log("moduleLoaderApp init!");
        // loadModule("huvudkatvy");
        // setCurrentModule('huvudkatvy');
        registerPaths();

    };

    var changeBackBtn = function(ctx, next) { // Detta är en fullösning för att fixa länkning till "startsidan".
        let btn = $("#back-shopping-btn");
        if (btn.attr("onclick") === "page.back()" && ctx.page.current === "/") {
            btn.attr("onclick","window.location.assign('/');")
        }else{
            btn.attr("onclick","page.back()")
        }
        next()
    }

    var registerPaths = function () {
        console.log("Running registerPaths");
        page.base('/handla'); //register base url for router
        page('/',changeBackBtn, function (ctx) { //Register path and callback function
            loadModule('huvudkatvy');
        });
        page('/varukorg',changeBackBtn, function (ctx) { //Register path and callback function
            loadModule('varukorgvy');
        });
        page('/search',changeBackBtn, function (ctx) { //Register path and callback function
            loadModule('prodOverviewAll');
        });
        page('/product/:productId',changeBackBtn, function (ctx) { //Register path and callback function
            // console.log("productId:", ctx.params.productId);
            setIdFor("productId", ctx);
            // console.log("HERE!");
            loadModule("productDetails");
        });
        page('/:catId',changeBackBtn, function (ctx) { //Register path and callback function
            // console.log("cat name:", ctx.params.catId);
            setIdFor("catId", ctx)
            loadModule("detaljkategori");
        });
        page('/:catId/:subCatId',changeBackBtn, function (ctx) { //Register path and callback function
            setIdFor("catId", ctx);
            setIdFor("subCatId", ctx);
            loadModule("subsubCatView");
        });
        page('/:catId/:subCatId/:subSubCatId',changeBackBtn, function (ctx) { //Register path and callback function
            setIdFor("catId", ctx);
            setIdFor("subCatId", ctx);
            setIdFor("subSubCatId", ctx);
            loadModule("prodOverviewModule");
        });
        page(); //execute changes
    }
    var setIdFor = function (settingFor, ctx) {
        appData[settingFor] = ctx.params[settingFor]
    }
    var getIdFor = function (lookingFor) {
        return appData[lookingFor];
    }

    //set variable that keeps track of current module
    var setCurrentModule = function (moduleName) {
        appData.previousModule = appData.currentModule;
        appData.currentModule = moduleName;
    };

    // get variable that keeps track of current module
    var getCurrentModule = function () {
        return appData.currentModule;
    };

    var getPreviousModule = function () {
        return appData.previousModule;
    };

    //gör en funktion här som har en variabel som ändras vid

    var loadModule = function (moduleName) {
        var baseLoadUrl = config.loadPath + moduleName + "/" + moduleName;
        // console.log("HERE: ", baseLoadUrl);

        $.get(baseLoadUrl + ".html",
            function (data) {
                $(config.targetElementId).html(data);
                // checks if it is the normal modules or the show all products that tries to load 

                $(document).scrollTop(0);
                // console.log(getCurrentModule());
                // alert("Load was performed.");
            });
        $.getScript((baseLoadUrl + ".js"), null)
            .fail(function (jqxhr, settings, exception) {
                console.log("ERROR LOADING: ", exception);
            });


    }
    var loadManually = function (htmlPath, postData, scriptPath) {

        if (postData) {
            $.ajax({
                url: htmlPath,
                type: 'POST',
                data: JSON.stringify(postData),
                contentType: 'application/json; charset=utf-8',
                // dataType: 'html',
                async: true,
                success: function (data) {
                    $(config.targetElementId).html(data);
                    $(document).scrollTop(0);
                }
            });
        } else {
            $.get(htmlPath,
                function (data) {
                    $(config.targetElementId).html(data);
                    // setCurrentModule(moduleName);
                    $(document).scrollTop(0);
                });

        }

        if (scriptPath) {
            $.getScript((scriptPath), null)
                .fail(function (jqxhr, settings, exception) {
                    console.log("ERROR LOADING: ", exception);
                });
        }



    }

    var getLoadPath = function () {
        return config.loadPath;
    }

    var setContianerWidth = function (width) {
        $(config.targetElementId).css("max-width", width)
    }

    init();
    return {
        init: init,
        loadModule: loadModule,
        setCurrentModule: setCurrentModule,
        getCurrentModule: getCurrentModule,
        getPreviousModule: getPreviousModule,
        getLoadPath: getLoadPath,
        loadManually: loadManually,
        getIdFor: getIdFor,
        setContianerWidth: setContianerWidth
        //anything else you want available
        //through myMessageApp.function()
        //or expose variables here too
    };

})();