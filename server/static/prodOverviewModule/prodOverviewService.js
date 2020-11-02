var prodOverviewServiceApp = (function () {
    var config = {
        appName: "prodOverviewModule"
    }

    var serviceData = {
        lastPageindex: 0
    }

    var init = function () { // This function is executed when module is loaded
        console.log("prodOverviewServiceApp init!");
    }

    var setPageIndex = function (newIndex) {
        serviceData.lastPageindex = newIndex;
        if (serviceData.lastPageindex < 0) {
            serviceData.lastPageindex = 0;
        }
    }

    var getPageIndex = function () {
        return serviceData.lastPageindex;
    }

    init();
    return {
        setPageIndex: setPageIndex,
        getPageIndex: getPageIndex
    }

})();