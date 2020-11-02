var shoppingCartService = (function () {

    var cookieName = 'inCart'

    var prodList = [];

    var init = function () { // This function is executed when module is loaded. For testing.
        console.log("shoppingCartService init!!");
        getCookie();
    }

    // var addItemByID = function (prodID) { //Adds or increases quantity of product item
    //     if (!(prodID in prodList)) {
    //        prodList[prodID] = 0;
    //     }
    //     prodList[prodID] += 1;
    // }

    var addItemByID = function (prodID) { //Adds or increases quantity of product item

        // console.log(prodList.length);

        for (let index = 0; index < prodList.length; index++) {
            let item = prodList[index];
            if (item.id === prodID) {
                // console.log("item in array!");
                item.amount++;
                setCookie();
                return;
            }

        }

        prodList.push({
            id: prodID,
            amount: 1
        });
        setCookie();
        return;
    }

    var getAllItemsInCart = function () { // Returns object with key-value pairs: { Product (prodID) : Quantity }
        return prodList;
    }

    // var removeItemByID = function (prodID) { // Removes or reduces quantity of product item
    //     if (prodID in prodList) {
    //         if (prodList[prodID] <= 1) {
    //             delete prodList[prodID];
    //         } else {
    //             prodList[prodID] -= 1;
    //         }
    //     }
    // }

    var removeItemByID = function (prodID) { // Removes the full value of given produvt from cart. Even thou there are more than one.
        for (let index = 0; index < prodList.length; index++) {
            let item = prodList[index];
            if (item.id === prodID) {
                // console.log(prodList[index].amount);
                prodList[index].amount--;
                // console.log(prodList[index].amount);
                if (prodList[index].amount <= 0) {
                    prodList.splice(index, 1);
                }

                break;
            }
        }

        setCookie();
    }

    var removeAllItems = function () {
        // console.log("Remove all items!");
        // removeAllCookies() // When implemented
        prodList = [];
        setCookie();
    }

    var removeCookie = function () { //Removes ALL cookies on the page (not only products and quantities)
        Cookies.remove(cookieName);
    }

    var setCookie = function () { //Removes old cookies while creating new cookies from existing products and quantities
        removeCookie();
        let out = {};
        for (let i = 0; i < prodList.length; i++) {
            const p = prodList[i];
            out[(i.toString())] = p;

        }
        // console.log("Will be stored in cookie.", out);
        if (prodList.length < 1) {
            // console.log("Nothing to store!");
            return;

        }
        Cookies.set(cookieName, out);

    }

    var getCookie = function () { //Loads existing cookies into prodList
        prodList = [];
        const cdata = Cookies.getJSON(cookieName);
        if (!cdata) {
            // console.log("Cookie does not exist!");
            return;
        }
        // console.log("Found cookie with content.", cdata);

        for (const key in cdata) {
            if (cdata.hasOwnProperty(key)) {
                const element = cdata[key];
                prodList.push(element);
            }
        }

    }

    init(); // Testing

    return {
        addItemByID: addItemByID,
        getAllItemsInCart: getAllItemsInCart,
        removeItemByID: removeItemByID,
        removeAllItems: removeAllItems

    };

})();