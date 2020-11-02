var aboutApp = (function () {
//  console.log("about laddat");



var returnHome = function(){
  // console.log("hemma");
  window.location.assign("/");
}

return {
    returnHome : returnHome
};

})();