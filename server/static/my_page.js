var my_pageApp = (function () {
    // console.log("laddat");
    var homebuttonClicked = function () {
      window.location.assign("/");
    };

    var orderbuttonClicked = function () {
      window.location.assign("/orderhistorik");
    };
    var logoutButtonClicked = function () {
      window.location.assign("/logout");
    };
    
    return {
      homebuttonClicked: homebuttonClicked,
      orderbuttonClicked : orderbuttonClicked,
      logoutButtonClicked: logoutButtonClicked
    };
    })();