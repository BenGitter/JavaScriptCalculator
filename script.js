
var Display = (function(){
  // Takes care of the JS involved in the layout of the page
  var extraBtnState = true,  
      btnWidth,
      btnHeight,
      displayBottom = $("#bottom h3"), 
      displayTop = $("#top span");

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
  var contentTop = "",
      contentBottom = "0",  
      fullString = "",      // NOT USED!
      lastBtn = "",         // Val of last clicked button
      emptyBottom = false,  // Should contentBottom be emptied
      emptyTop = false;     // Should contentTop be emptied

  function init(){
    // Functions to run on start
    events();
  }

  function events(){

    $(".btn-elem").on('click', function(){
      // Check if button is clicked
      var val = $(this).data("val");

      // Empty top if needed
      if(emptyTop){
        contentTop = "";
        emptyTop = false;
      }

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
          calculateResult(false);
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

      // Last pressed button
      lastBtn = val;

    });
    
  }

  function processNumber(val){

    // Check if contentBottom is equal to zero 
    if(contentBottom === "0" || emptyBottom){
      contentBottom = "";   // Remove the zero
      emptyBottom = false;  // Set back to false
    }

    contentBottom += val;
  }

  function processBasicMath(val){
    var operator,                       // Operator JS
        operatorHTML,                   // Operator HTML
        lengthOperator = [3, 9, 9, 10], // Length of operatorHTML
        index = ["plus", "minus", "multiply", "divide"].indexOf(lastBtn); // Check if lastBtn was an operator

    switch(val){
      case "plus":
        operator = "+";
        operatorHTML = " + ";
        break;
      case "minus":
        operator = "-";
        operatorHTML = " &#8211; ";
        break;
      case "multiply":
        operator = "*";
        operatorHTML = " &times; ";
        break;
      case "divide":
        operator = "/";
        operatorHTML = " &divide; ";
        break;
    }

    // Check if there already was an operator at the end
    if(index < 0){
      // If not add contentBottom to contentTop
      contentTop += contentBottom;
    }else{
      // Else slice of the old operator
      contentTop = contentTop.slice(0, contentTop.length - lengthOperator[index]);
    }
    
    // Add the operator
    contentTop += operatorHTML;

    // Empty contentBottom when new number is inserted
    emptyBottom = true;

    // Calculate result if plus/minus
    if(["plus", "minus"].indexOf(val) >= 0){
      calculateResult(true);
    }
  }

  function processComma(){
    // If bottom should be emptied enter zero
    if (emptyBottom){
      contentBottom = "0";
      emptyBottom = false;
    } 

    // Check if there is already a comma
    if(contentBottom.indexOf(".") >= 0){
      console.log("There is already a comma");
      return true;
    }
    contentBottom += ".";
  }

  function processBrackets(val){

  }

  function calculateResult(intermediate){
    var sum = contentTop;

    sum = sum.replace(/ /g, "");          // remove spaces
    sum = sum.replace(/&#8211;/g, "-");   // replace HTML minus
    sum = sum.replace(/&times;/g, "*");   // replace HTML multiply
    sum = sum.replace(/&divide;/g, "/");  // replace HTML divide

    // Check if this intermediate step or final result
    if(intermediate){
      sum = sum.substr(0, sum.length-1);
    }else{
      sum += contentBottom;
      contentTop += contentBottom;
      emptyTop = true;
    }

    var result = eval(sum);

    result = Math.round(result * 1000000) / 1000000;
    contentBottom = result.toString();

    // Check for infinity
    if(contentBottom === "Infinity"){
      contentBottom = "0";
      contentTop = "Sum resulted in infiniity";
      emptyTop = true;
      return false;
    }
    // Make sure result will be removed if something else is clicked
    emptyBottom = true;

    // Add to history if final result is calculated
    if(!intermediate){
      addToHistory();
    }
  }

  function addToHistory(){
    var historyList = $("#history ul");

    var liTop = $("<li />", {
      html: contentTop
    });
    
    var liBottom = $("<li />", {
      html: contentBottom
    })

    historyList.prepend(liBottom);
    historyList.prepend(liTop);
  }

  function processPlusMinus(){

  }

  function processFactorize(){

  }

  function processPi(){

  }

  function processRemove(val){
    if(val === "ce"){
      contentBottom = "0";
    }else if(val === "c"){
      contentTop = "";
      contentBottom = "0";
    }else if(val === "back"){
      if(contentBottom.length > 1){
        contentBottom = contentBottom.slice(0, contentBottom.length -1);
      }else{
        contentBottom = "0";
      }
    }

    lastBtn = "";
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