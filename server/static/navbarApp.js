var navbarApp = (function () {


    var config = {
        symbol: " / "
    }



    var appData = {
        sitemapElement: undefined, // Stores the actual HTML-element for later access.
        // All sitemapXXX below contains either undefined or a string of the current value. These are used to create the sitemap string later
        sitemapHuvudkat: undefined,
        sitemapUnderkat: undefined,
        sitemapUnderUnderkat: undefined,
        sitemapProdukt: undefined,
        continueBtn: undefined,
        backBtn: undefined,
        viewcartBtn: undefined,
        navElement: undefined,
        sitemapShowAll: undefined
    }

    var init = function () { // This function is executed when App is loaded
        console.log("navbarApp init!");

        $(document).ready(function () {
            // console.log("DOC READY");
            appData.sitemapElement = $("#nav-site-map"); // Fetches the navbar "site map element" for later use.
            appData.continueBtn = $("#continue-shopping-btn"); // Fetches the navbar "continue shopping btn" for later use.
            appData.backBtn = $("#back-shopping-btn"); // Fetches the navbar "continue shopping btn" for later use.
            appData.viewcartBtn = $("#view-shopping-cart-btn");
            appData.continueBtn.hide()
            appData.navElement = $("nav");
            // sitemapVarsSetter({huvud:" "}); // temp

            createSitemap();
            bindScroll();
            setLogedinStatus();
        })
    }

    var bindScroll = function () {
        /**
         * The purpose of this function is to create a sticky navbar on mobile devices.
         */
        const doc = $(document);
        const navSpacer = $("#nav-spacer");
        const patt = /\d*/i;
        doc.scroll(() => {
            let navHeight = appData.navElement.css("height").match(patt);
            navHeight = Number(navHeight);
            if ((doc.scrollTop()) > 0) {
                // console.log("Out of view");
                appData.navElement.addClass("fixed-top");
                navSpacer.css("height", navHeight);
            } else {
                appData.navElement.removeClass("fixed-top");
                navSpacer.css("height", 0);
            }

        })
    }

    var setLogedinStatus = () => {
        let target = $("#user-info")
        // target.hide();
        $.getJSON("/api/check_login", (data) => {
            user = data[0]
            if (!user.auth) {
                // console.log("NOT LOGGED IN");
                target.html("<a href='/login?next=%2Fhandla'> Klicka här för att logga in.</a>");
                return
            }
            target.html("<a href='/my_page'>Inloggad som " + user.name + ".</a>");
            // target.show();
        });

    }

    var hideContinueBtn = function () {
        $(document).ready(function () {
            appData.continueBtn.hide();
            appData.backBtn.show();
            appData.viewcartBtn.show();
        })
    }

    var hideBackBtn = function () {
        $(document).ready(function () {
            appData.continueBtn.show();
            appData.backBtn.hide();
            appData.viewcartBtn.hide();
        })

    }

    var ContPrevBtnswap = function () {
        $(document).ready(function () {
            if (appData.continueBtn.css('display') == 'none') {
                hideBackBtn();
            } else {
                hideContinueBtn();
            }
        })
    }

    // This functions only purpose is to change the html contained inside the sitemapelement
    var setSitemapText = function (text) {
        $(document).ready(function () {
            appData.sitemapElement.html(text);
        })
    }


    // This function uses the sitemapXXX to concatenate the string to the "level" it is defined and then calls setSitemapText() to change the text
    var createSitemap = function () {
        $(document).ready(function () {
            var outString = "Välj huvudkategori";
            if (typeof appData.sitemapHuvudkat !== "undefined") {
                outString = appData.sitemapHuvudkat + " ";

                if (typeof appData.sitemapUnderkat !== "undefined") {
                    outString += config.symbol + " " + appData.sitemapUnderkat + " ";

                    if (typeof appData.sitemapUnderUnderkat !== "undefined") {
                        outString += config.symbol + " " + appData.sitemapUnderUnderkat + " ";

                        if (typeof appData.sitemapProdukt !== "undefined") {
                            outString += config.symbol + " " + appData.sitemapProdukt;
                        }
                    }
                }

            }
            if (typeof appData.sitemapShowAll !== "undefined") {
                outString = appData.sitemapShowAll + " ";
            }


            setSitemapText(outString);

        })
    }


    /**
     * Starting here the following functions are used to manipulate the corresponding textvalues.
     * This will be used by other modules using the api.
     */
    var removeHuvudkat = function () {
        appData.sitemapHuvudkat = undefined;
    }

    var removeUnderkat = function () {
        appData.sitemapUnderkat = undefined;
    }

    var removeUnderUnderkat = function () {
        appData.sitemapUnderUnderkat = undefined;
    }

    var removeProdukt = function () {
        appData.sitemapProdukt = undefined;
    }
    var removeShowAll = function () {
        appData.sitemapShowAll = undefined;
    }

    // This function will set the corresponding part of the sitemap.
    // INDATA: object containing one or all of the properties {huvud, under, produkt}
    // Setting a property to undefined will result in a reset of that property.
    // Ommiting a property will result in that property keeping its last value.
    var sitemapVarsSetter = function (inData) {
        (inData.hasOwnProperty("huvud") ? appData.sitemapHuvudkat = inData.huvud : undefined);
        (inData.hasOwnProperty("under") ? appData.sitemapUnderkat = inData.under : undefined);
        (inData.hasOwnProperty("underunder") ? appData.sitemapUnderUnderkat = inData.underunder : undefined);
        (inData.hasOwnProperty("produkt") ? appData.sitemapProdukt = inData.produkt : undefined);
        (inData.hasOwnProperty("showall") ? appData.sitemapShowAll = inData.showall : undefined);
        createSitemap();
    }

    /** End text manipulation */

    var clearAll = function () { //Self explaining
        removeHuvudkat();
        removeUnderkat();
        removeUnderUnderkat();
        removeProdukt();
        removeShowAll();
        createSitemap();
    }

    var navElement = function () {
        return appData.navElement;
    }

    init();
    return {
        setSitemapText: setSitemapText,
        clearAll: clearAll,
        sitemapVarsSetter: sitemapVarsSetter,
        ContPrevBtnswap: ContPrevBtnswap,
        hideContinueBtn: hideContinueBtn,
        navElement: navElement
    }

})();

// nav-site-map