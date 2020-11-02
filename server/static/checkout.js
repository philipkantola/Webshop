var paymentApp = (function () {
    var init = function () {
        navbarApp.setSitemapText("Betalning");
        $(document).ready(function () {
            let tickID = setInterval(function () {
                let btn = $(".stripe-button-el");
                if (btn.html()) {
                    clearInterval(tickID);
                    btn.removeClass("stripe-button-el")
                    btn.addClass("btn btn-mod");
                    btn.html("Klicka här för att betala")
                }
            }, 20);
        });
    }
    init();
})();
