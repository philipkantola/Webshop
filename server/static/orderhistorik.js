var orderhistorikApp = (function () {
  // console.log("laddat");
  var profilButtonClicked = function () {
    window.location.assign("/my_page");
  };
  var handlaButtonClicked = function () {
    window.location.assign("/handla");
  };

  return {
    profilButtonClicked: profilButtonClicked,
    handlaButtonClicked: handlaButtonClicked
  };
})();