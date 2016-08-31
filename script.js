
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

  function getBtnState(){
    return extraBtnState;
  }
  return {
    // Variables to make available to the rest of the code
    init: init,                   // init function to get started
    getBtnState: getBtnState, // needed to know what special button is clicked
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
        case "pi":
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
        case "ce": case "c": case "back":
          processRemove(val);
          break;
        case "squared": case "power": case "sqrt": 
        case "base": case "log": case "exp": case "mod":
        case "sin": case "cos": case "tan":
          processSpecial(val);
          break;
        default:
          console.log("Not handled in this object");
      }

      // Update display after button press has been processed
      Display.updateContent(contentTop, contentBottom);

      // Last pressed button
      lastBtn = val;

    });
    
  }

  function processNumber(val){
    // If lastBtn is rbracket: first input a "x"
    if(lastBtn === "rbracket") processBasicMath("multiply");
    // Check if contentBottom is equal to zero 
    if(contentBottom === "0" || emptyBottom){
      contentBottom = "";   // Remove the zero
      emptyBottom = false;  // Set back to false
    }

    if([")"].indexOf(contentTop.charAt(contentTop.length -2)) >= 0){
      return false;
    }



    // Process PI 
    if(parseInt(lastBtn) > 0 && val === "pi") contentBottom += " &times; ";
    if(parseInt(val) > 0 && lastBtn === "pi") contentBottom += " &times; ";
    contentBottom += (val === "pi") ? "&pi;" : val;
    
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
      if(!emptyBottom || contentTop === ""){
        contentTop += contentBottom;
      }

      if(emptyBottom && contentTop.charAt(contentTop.length-2) ===  "("){
        contentTop += contentBottom;
      }
      
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
      return true;
    }
    contentBottom += ".";
  }

  function processBrackets(val){
    var numBrackets = (contentTop.match(/\(/g) || []).length - (contentTop.match(/\)/g) || []).length;

    var bracket;

    // Right bracket or left
    if(val === "rbracket"){
      // Don't do anything when no closing bracket is needed
      if(numBrackets === 0){
        return false;
      } 

      bracket = " ) ";
      // No closing bracket?
      if([")"].indexOf(contentTop.charAt(contentTop.length -2)) < 0){
        contentTop += contentBottom;
      }
      emptyBottom = true;
    }else{
      if(lastBtn === "rbracket" && contentTop !== ""){
        bracket = " &times; ( "
      }else{
        bracket = " ( ";
      }

      emptyBottom = true;
    }

    contentTop += bracket;

  }

  function calculateResult(intermediate){
    // Run processBrackets if last character is an operator when "=" clicked
    if(["plus", "minus", "multiply", "divide"].indexOf(lastBtn) >= 0 && !intermediate) processBrackets("rbracket");
    if([";", "+"].indexOf(contentTop.charAt(contentTop.length -2)) >= 0){
        // What if end with operator...
        //if(!intermediate && emptyBottom) return false;
    }
    var sum = contentTop,
        numBrackets = (contentTop.match(/\(/g) || []).length - (contentTop.match(/\)/g) || []).length;
    
    // First replace everything that won't change
    sum = sum.replace(/ /g, "");          // remove spaces
    sum = sum.replace(/&#8211;/g, "-");   // replace HTML minus
    sum = sum.replace(/&times;/g, "*");   // replace HTML multiply
    sum = sum.replace(/&divide;/g, "/");  // replace HTML divide

    // Check if this intermediate step or final result
    if(intermediate){
      sum = sum.substr(0, sum.length-1);
      if(numBrackets > 0) return false;
    }else{
      //if(!emptyBottom){
      if([")"].indexOf(contentTop.charAt(contentTop.length -2)) < 0){
        sum += contentBottom;
        contentTop += contentBottom;
      } 
      
      emptyTop = true;
      sum += ")".repeat(numBrackets);
      contentTop += " ) ".repeat(numBrackets);
    }

    // Replace everything that has possible changed
    sum = sum.replace(/–/g, "-");           // replace weird minus
    sum = sum.replace(/&pi;/g, "Math.PI");  // replace PI
    sum = sum.replace(/\*\*/g, "*");        // replace double multiply
    sum = sum.replace(/--/g, "+");          // replace double minus

    // Replace short names to real function names
    sum = sum.replace(/fact/g, "processFactorize");   
    sum = sum.replace(/sqr/g, "square"); 
    sum = sum.replace(/&#8730;/g, "squareRoot");
    sum = sum.replace(/10\^/g, "base");
    sum = sum.replace(/e\^/g, "eBase");
    sum = sum.replace(/sin\<sup\>-1\<\/sup\>/g, "asin");
    sum = sum.replace(/cos\<sup\>-1\<\/sup\>/g, "acos");
    sum = sum.replace(/tan\<sup\>-1\<\/sup\>/g, "atan");

    // If sum is empty string set it to zero
    if(sum === ""){
      sum = "0";
      contentTop = "0";
    }
    
    console.log(sum);

    var result = eval(sum);
    var rounding = 10000000000000000
    result = Math.round(result * rounding) / rounding;
    contentBottom = result.toString();

    // Check for infinity
    if(contentBottom === "Infinity" || contentBottom === "NaN"){
      contentBottom = "0";
      contentTop = "Sum is invalid or too large";
      emptyTop = true;
      return false;
    }

    // Make sure result will be removed if something else is clicked
    emptyBottom = true;

    // Add to history if final result is calculated
    if(!intermediate && !arguments[1]){
      addToHistory();
    }
  }

  function addToHistory(){
    var historyList = $("#history .items");

    var ul = $("<ul />");
    
    var liTop = $("<li />", {
      html: contentTop
    });
    
    var liBottom = $("<li />", {
      html: contentBottom
    })

    ul.append(liTop);
    ul.append(liBottom);
    historyList.prepend(ul);

    // Event handler to put history back in front
    $("#history .items ul").unbind().on("click", function(){
      var $lis = $(this).find("li");
      contentTop = $lis.eq(0).html();
      contentBottom = $lis.eq(1).html();

      emptyBottom = true;
      emptyTop = false;
      lastBtn = "";

      Display.updateContent(contentTop, contentBottom);
    });

  }

  function processPlusMinus(){
    if(emptyBottom && lastBtn === "rbracket"){
      contentTop += " &times; ";
    }

    if(contentBottom !== "0"){
      if(contentBottom.slice(0,1) === "-"){
        contentBottom = contentBottom.slice(1, contentBottom.length);
      }else{
        contentBottom = "-" + contentBottom;
      }
    }

    emptyBottom = false;
  }

  function processFactorize(){
    // Calculate factorial
    if(arguments[0] > 0){
      if(arguments[0] > 167) arguments[0] = 168;
      var rval=1;
      for (var i = 2; i <= arguments[0]; i++)
          rval = rval * i;
      return rval;
    }

    // Else if button is clicked
    if(contentTop.charAt(contentTop.length-2) !== ")" ){
      contentTop += " fact( ";
      contentTop += contentBottom;
      contentTop += " ) ";
      emptyBottom = true;
    }

  }

  function processRemove(val){
    lastBtn = "";

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
  }

  function processSpecial(val){
    var funcName = "";

    // What to do if extra button aren't shown
    if(!Display.getBtnState()){
      switch(val){
        case "squared":
          funcName = "sqr( ";
          break;
        case "sqrt":
          funcName = "&#8730;( "
          break;
        case "base":
          funcName = "10^( "
          break;
        case "sin":
          funcName = "sin( ";
          break;
        case "cos":
          funcName = "cos( ";
          break;
        case "tan":
          funcName = "tan( ";
          break;
      }
    }else{
      switch(val){
        case "squared":
          funcName = "cube( ";
          break;
        case "sqrt":
          funcName = "( 1/"
          break;
        case "base":
          funcName = "e^( "
          break;
        case "sin":
          funcName = "sin<sup>-1</sup>( ";
          break;
        case "cos":
          funcName = "cos<sup>-1</sup>( ";
          break;
        case "tan":
          funcName = "tan<sup>-1</sup>( ";
          break;
      }
    }

    if(contentTop.charAt(contentTop.length-2) !== ")" ){
      contentTop += " " + funcName;
      contentTop += contentBottom;
      contentTop += " ) ";
      emptyBottom = true;
    }

    calculateResult(false, true);
    emptyTop = false;
  }

  // Functions to calculate squared etc.
  function square(num){
    return num*num;
  }

  function squareRoot(num){
    return Math.sqrt(num);
  }

  function base(num){
    return Math.pow(10, num);
  }

  function cube(num){
    return num*num*num;
  }

  function eBase(num){
    return Math.pow(Math.E, num);
  }

  function sin(num){
    return Math.sin(num/180*Math.PI);
  }

  function cos(num){
    return Math.cos(num/180*Math.PI);
  }

  function tan(num){
    return Math.tan(num/180*Math.PI);
  }

  function asin(num){
    return Math.asin(num/180*Math.PI);
  }

  function acos(num){
    return Math.acos(num/180*Math.PI);
  }

  function atan(num){
    return Math.atan(num/180*Math.PI);
  }


  return {
    // Variables to make available to the rest of the code
    init: init,   // init function to get started
  };

})();

// Start Calculator
Calculator.init();