var welcomeApp = (function () {
// console.log("laddat");

var buttonClicked = function () {
  // console.log("klickat på handla");
  // keeps track of current module
  // moduleLoaderApp.setCurrentModule('Huvudkatvy');
  // window.location.replace("/handla"); // Using replace() removes the possibility to use the back-button to get to the welcome spage
  window.location.assign("/handla"); // using assign() allows for the above.
};  

var mypagebuttonClicked = function () {
  window.location.assign("/my_page");
};

var returnHome = function(){
  // console.log("hemma");
  window.location.assign("/");
}

var aboutPage = function(){

  window-location.assign("/about");
}

return {
  buttonClicked: buttonClicked,
  returnHome : returnHome,
  aboutPage  : aboutPage,
  mypagebuttonClicked : mypagebuttonClicked
};
})();
