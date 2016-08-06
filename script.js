//
// TO DO List:
// -
//
// Ideas:
// - keyboard?
//

var Calculator;

$(window).load(function(){

    Calculator = {
      buttonHeight: 0,
      buttonWidth: 0,
      appliedPadding: 0,
      specialButtonState: false,
      displayBottom: $("#bottom h3"),
      displayTop: $("#top"),
      contentBottom: "0",
      contentTop: "",
      emptyBottom: false,
      fullString: "",
      firstStop: true,
      calculated: false,
      bracketCount: 0,
      endWithOperator: false,
      endOperator: "",
      endWithBracket: false,

      init: function(){
        this.events();
        this.setSizeOfSections();
        this.setSizeOfButtons();
        this.alignTextInButtons();
      },
      events: function(){
        // Fix the eventhandlers
        var self = this;

        // Window resize
        $(window).on('resize', function(){
          self.setSizeOfSections();
          self.setSizeOfButtons();
          self.alignTextInButtons();
        });

        // Button pressed
        $(".btn-elem").on('click', function(){
          console.log(self.fullString);

          var val = $(this).data("val");
          //alert(val);
          switch(val){
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
              self.processNumber.call(this);
              break;
            case "comma":
              self.processComma.call(this);
              break;
            case "lbracket":
            case "rbracket":
              self.processBrackets.call(this);
              break;
            case "divide":
            case "multiply":
            case "minus":
            case "plus":
              self.processBasicMath.call(this);
              break;
            case "is":
              self.calculateResult(true);
              break;
            case "plus-minus":
              self.processPlusMinus.call(this);
              break;
            case "factor":
              self.processFactorize.call(this);
              break;
            case "pi":
              self.processPi.call(this);
              break;
            case "extra":
              self.changeSpecialButtons.call(this);
              break;
            case "ce":
            case "c":
            case "back":
              self.processRemove.call(this);
              break;
            case "squared":
            case "power":
            case "sqrt":
            case "base":
            case "log":
            case "exp":
            case "mod":
              self.processSpecial();
              break;
            case "sin":
            case "cos":
            case "tan":
              self.processGonio();
              break;
            default:
              console.log("Key not found!");
          }
        });
      },
      // All button functions:
      processNumber: function(){
        var val = $(this).data("val").toString(),
            self = Calculator;

        if(self.calculated){
          self.fullString = "";
          self.calculated = false;
        }

        if(self.emptyBottom){
          self.contentBottom = "0";
          self.emptyBottom = false;
        }

        if(self.endWithBracket){
          self.contentBottom = "0";
          self.contentTop = "";
          self.fullString = "";
          self.displayTop.html(self.contentTop);
        }

        if(self.contentBottom === "0"){
          self.contentBottom = val;
          self.displayBottom.html(self.contentBottom);
        }else{
          self.contentBottom += val;
          self.displayBottom.html(self.contentBottom);
        }

        self.fullString += val;
        self.endWithOperator = false;
        self.endWithBracket = false;
      },
      processComma: function(){
        var self = Calculator;

        if(self.calculated){
          self.fullString = "";
          self.calculated = false;
        }
        if(self.emptyBottom){
          self.contentBottom = "0";
          self.emptyBottom = false;
        }

        if(self.contentBottom === ""){
          self.contentBottom = "0";
        }

        if(self.contentBottom.indexOf(".") < 0){
          self.contentBottom += ".";
          self.displayBottom.html(self.contentBottom);
          self.fullString += ".";
        }
      },
      processBrackets: function(){

        // Operator in between bracket set
        var self = Calculator,
            val = $(this).data("val");

        if(self.calculated){
          self.calculated = false;
        }

        if(self.emptyBottom){
          self.emptyBottom = true;
        }

        if(val === "lbracket"){
          if(self.endWithBracket && self.fullString.slice(-1) === ")"){
            var call = $("<div data-val='multiply'></div>");
            self.processBasicMath.call(call);
          }

          if(self.fullString.toString().indexOf("(") >= 0){
            self.contentBottom = "0";
          }

          if(self.contentBottom.toString() !== "0"){
            self.fullString = self.fullString.toString().slice(0, self.fullString.length - self.contentBottom.length) + "(" + self.contentBottom;
          }else{
            self.fullString += "(";
          }
          self.contentTop += " (";
          self.bracketCount++;
        }

        if(val === "rbracket" && self.bracketCount > 0){
          if(self.endWithBracket){
            self.fullString += "0";
            self.contentTop += " 0 ";
          }

          if(self.contentBottom.toString() !== "0"){
            self.emptyBottom = true;
            self.contentTop += " " + self.contentBottom + " ";
          }
          self.fullString += ")";
          self.contentTop += ") ";
          self.bracketCount--;

          if(self.bracketCount === 0){
            self.calculateResult(false);
          }
        }

        self.endWithBracket = true;
        self.displayTop.html(self.contentTop);
        self.endOperator = false;
      },
      processBasicMath: function(){
        var val = $(this).data("val"),
            self = Calculator,
            operator,
            realOperator,
            contentBottom = self.contentBottom;
        self.calculated = false;

        if(self.endWithOperator){
          console.log(self.fullString);
          self.fullString = self.fullString.slice(0, self.fullString.length - 1);
          self.contentTop = self.contentTop.slice(0, self.contentTop.length - self.endOperator.length);
          console.log(self.fullString);
        }


        switch(val){
          case "plus":
            operator = "+";
            realOperator = "+";
            self.calculateResult(false);
            self.firstStop = true;
            break;
          case "minus":
            operator = "&#8211;";
            realOperator = "-";
            self.calculateResult(false);
            self.firstStop = true;
            break;
          case "multiply":
            operator = "&times;";
            realOperator = "*";
            if(self.firstStop){
              self.firstStop = false;
            }else{
              self.calculateResult(false);
            }
            break;
          case "divide":
            operator = "&divide;";
            realOperator = "/";
            if(self.firstStop){
              self.firstStop = false;
            }else{
              self.calculateResult(false);
            }
            break;
        }

        var leftBracket = false,
            rightBracket = false;

        if(self.endWithBracket){
          if(self.fullString.toString().lastIndexOf(")") === self.fullString.length-1){
            rightBracket = true;
          }else{
            leftBracket = true;
          }
        }
        console.log(rightBracket);

        if(self.endWithOperator || rightBracket){
          self.contentTop += operator;
        }else{
          self.contentTop += " " + contentBottom + " " + operator;
        }

        self.displayTop.html(self.contentTop);
        self.emptyBottom = true;
        self.fullString += realOperator;
        self.endWithOperator = true;
        self.endOperator = operator;
        self.endWithBracket = false;
      },
      processPlusMinus: function(){

      },
      processFactorize: function(){

      },
      processPi: function(){

      },
      processRemove: function(){
        var val = $(this).data("val"),
            self = Calculator;

        switch(val){
          case "ce":
            self.contentBottom = "0";
            break;
          case "c":
            self.contentBottom = "0";
            self.contentTop = "";
            break;
          case "back":
            if(self.contentBottom.length > 1){
              self.contentBottom = self.contentBottom.slice(0,self.contentBottom.length-1);
              break;
            }else{
              self.contentBottom = "0";
            }
        }

        self.displayBottom.html(self.contentBottom);
        self.displayTop.html(self.contentTop);
        self.fullString = "";

      },
      processSpecial: function(){

      },
      processGonio: function(){

      },
      calculateResult: function(updateTop){
        var self = Calculator;

        if(self.bracketCount > 0){
          return false;
        }

        var result = Math.round(eval(self.fullString)*10000000000)/10000000000;

        self.contentBottom = result;
        self.displayBottom.html(self.contentBottom);

        if(updateTop){
          self.contentTop = "";
          self.displayTop.html(self.contentTop);
          self.emptyBottom = true;
          self.fullString = result;
          self.firstStop = true;
          self.calculated = true;
          self.bracketCount = 0;
          self.endWithBracket = false;
        }


      },
      setSizeOfSections: function(){
        var total = $(window).height();
        var rest = total - $("#header").outerHeight() - $("#display-area").outerHeight();
        var specialHeight = Math.floor(rest / 7 * 2);
        var standardHeight = Math.floor(rest / 7 * 5);

        $("#special-buttons").height(specialHeight);
        $("#standard-buttons").height(standardHeight);
      },
      setSizeOfButtons: function(){
        $(".btn-elem").css("padding-top", "0px");
        this.buttonWidth = ($("#standard-buttons").innerWidth()-3) / 5;
        this.buttonHeight = (($(window).height()- $("#header").outerHeight() - $("#display-area").outerHeight()) / 7);

        $(".btn-elem").width(this.buttonWidth).height(this.buttonHeight);
      },
      alignTextInButtons: function(){
        var height = $(".btn-elem").find("span").outerHeight();
        var padding = (this.buttonHeight - height) / 2;
        this.appliedPadding = 7 * padding;

        $(".btn-elem").css("padding-top", padding + "px");
      },
      changeSpecialButtons: function(){
        if(this.specialButtonState){
          this.specialButtonState = false;
          $(".btn-elem[data-val='extra']").css("color", "black");
          $("#special-buttons .btn-elem span:nth-child(1)").css("display", "inline");
          $("#special-buttons .btn-elem span:nth-child(2)").css("display", "none");
        }else{
          this.specialButtonState = true;
          $(".btn-elem[data-val='extra']").css("color", "rgba(50,50,255,1)");
          $("#special-buttons .btn-elem span:nth-child(2)").css("display", "inline");
          $("#special-buttons .btn-elem span:nth-child(1)").css("display", "none");
        }
      }

    };

    Calculator.init();
});
