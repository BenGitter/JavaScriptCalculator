
var Display = (function(){
  // Takes care of the JS involved in the layout of the page
  var extraBtnState = true,  
      btnWidth,
      btnHeight,
      displayBottom = $("#bottom h3"), 
      displayTop = $("#top");

  function init(){
    // Functions to run on start
    setSizeOfSections();
    setSizeOfButtons();
    alignTextInButtons();
    changeSpecialButtons();
    events();
  };

  function setSizeOfSections(){
    // Set size of the sections: special buttons and standard buttons
    var total = $(window).height();
    var rest = total - $("#header").outerHeight() - $("#display-area").outerHeight();
    var specialHeight = Math.floor(rest / 7 * 2);
    var standardHeight = Math.floor(rest / 7 * 5);

    $("#special-buttons").height(specialHeight);
    $("#standard-buttons").height(standardHeight);
  }

  function setSizeOfButtons(){
    // Sets the size of the buttons within the sections
    $(".btn-elem").css("padding-top", "0px");
    btnWidth = ($("#standard-buttons").innerWidth()-3) / 5;
    btnHeight = (($(window).height()- $("#header").outerHeight() - $("#display-area").outerHeight()) / 7);

    $(".btn-elem").width(btnWidth).height(btnHeight);
  }

  function alignTextInButtons(){
    // Aligns the text vertically inside the buttons
    var height = $(".btn-elem").find("span").outerHeight();
    var padding = (btnHeight - height) / 2;

    $(".btn-elem").css("padding-top", padding + "px");
  }

  function changeSpecialButtons(){
    // Takes care of changing the special-buttons section when button is clicked (and on start)
    if(extraBtnState){
      extraBtnState = false;
      $(".btn-elem[data-val='extra']").css("color", "black");
      $("#special-buttons .btn-elem span:nth-child(1)").css("display", "inline");
      $("#special-buttons .btn-elem span:nth-child(2)").css("display", "none");
    }else{
      extraBtnState = true;
      $(".btn-elem[data-val='extra']").css("color", "rgba(50,50,255,1)");
      $("#special-buttons .btn-elem span:nth-child(2)").css("display", "inline");
      $("#special-buttons .btn-elem span:nth-child(1)").css("display", "none");
    }
  }

  function events(){
    // On click run changeSpecialButtons
    $(".btn-elem[data-val='extra']").on("click", changeSpecialButtons);

    // On resize, make sure the layout resizes with window
    $(window).on('resize', function(){
      setSizeOfSections();
      setSizeOfButtons();
      alignTextInButtons();
    });
  }

  function updateContent(contentTop, contentBottom){
    // Update the display after a button has been clicked
    displayTop.html(contentTop);
    displayBottom.html(contentBottom);
  }

  return {
    // Variables to make available to the rest of the code
    init: init,                   // init function to get started
    extraBtnState: extraBtnState, // needed to know what special button is clicked
    updateContent: updateContent  // Make sure Calculator can call updateContent
  };
})();

// Start Design: 
Display.init();


var Calculator = (function(){
  // Takes care of all the logic 
  var contentTop = "0",
      contentBottom = "0",
      fullString = "";

  function init(){
    // Functions to run on start
    events();
  }

  function events(){

    $(".btn-elem").on('click', function(){
      // Check if button is clicked
      var val = $(this).data("val");

      // Call function corresponding with the value
      switch(val){
        case 0: case 1: case 2: case 3: case 4: 
        case 5: case 6: case 7: case 8: case 9:
          processNumber(val);
          break;
        case "comma":
          processComma();
          break;
        case "lbracket": case "rbracket":
          processBrackets(val);
          break;
        case "divide": case "multiply": case "minus": case "plus":
          processBasicMath(val);
          break;
        case "is":
          calculateResult();
          break;
        case "plus-minus":
          processPlusMinus();
          break;
        case "factor":
          processFactorize();
          break;
        case "pi":
          processPi();
          break;
        case "ce": case "c": case "back":
          processRemove(val);
          break;
        case "squared": case "power": case "sqrt": case "base":
        case "log": case "exp": case "mod":
          processSpecial(val);
          break;
        case "sin": case "cos": case "tan":
          processGonio(val);
          break;
        default:
          console.log("Key not found!");
      }

      // Update display after button press has been processed
      Display.updateContent(contentTop, contentBottom);

    });
    
  }

  function processNumber(val){

    // Check if contentBottom is equal to zero 
    if(contentBottom === "0"){
      contentBottom = "";   // Remove the zero
    }

    contentBottom += val;
  }

  function processComma(){

  }

  function processBrackets(val){

  }

  function processBasicMath(val){

  }

  function calculateResult(){

  }

  function processPlusMinus(){

  }

  function processFactorize(){

  }

  function processPi(){

  }

  function processRemove(val){

  }

  function processSpecial(val){

  }

  function processGonio(val){

  }



  return {
    // Variables to make available to the rest of the code
    init: init,   // init function to get started
  };

})();

// Start Calculator
Calculator.init();