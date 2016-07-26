/*
TO DO List:
-

Ideas:
- use object oriented programming
- eval?
- keyboard?
*/

function d(o){
  console.log(o);
}

$(window).load(function(){
  d($("#header").outerHeight());

    var Calculator = {
      buttonHeight: 0,
      buttonWidth: 0,
      appliedPadding: 0,
      specialButtonState: false,
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
          var val = $(this).data("val");
          if(val === "extra"){
            self.changeSpecialButtons();
          }
        });
      },
      checkState: function(){
        // Whenever a button is clicked
      },
      calculateResult: function(){
        // Calculate result
      },
      displayChanges: function(){
        // Display result and update everything
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
