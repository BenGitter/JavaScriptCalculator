var Test = (function(){

    var total = 0,
        errors = 0,
        succes = 0,
        errorList = [];

    // Get reference to all buttons
    var buttons = $(".btn-elem");

    var mapBtn = {"squared": 0,
                  "power": 1,
                  "sin": 2,
                  "cos": 3,
                  "tan": 4,
                  "sqrt": 5,
                  "base": 6,
                  "log": 7,
                  "exp": 8,
                  "mod": 9,
                  "extra": 10,
                  "ce": 11,
                  "c": 12,
                  "back": 13,
                  "divide": 14,
                  "pi": 15,
                  "7": 16,
                  "8": 17,
                  "9": 18,
                  "multiply": 19,
                  "factor": 20,
                  "4": 21,
                  "5": 22,
                  "6": 23,
                  "minus": 24,
                  "plusMinus": 25,
                  "1": 26,
                  "2": 27,
                  "3": 28,
                  "plus": 29,
                  "lbracket": 30,
                  "rbracket": 31,
                  "0": 32,
                  "comma": 33,
                  "is": 34 };
 

    function clickBtn(btn){
        var event; 

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent("click", true, true);
        } else {
            event = document.createEventObject();
            event.eventType = "click";
        }

        event.eventName = "click";

        if (document.createEvent) {
            btn.dispatchEvent(event);
        } else {
            btn.fireEvent("on" + event.eventType, event);
        }
    }

    function runSequence(arr){
        arr.forEach(function(val, i){ 
            clickBtn(buttons[mapBtn[val]]); //
        });
    }

    function testSequence(arr, expected){
        total++;
        arr.push("is");

        runSequence(arr);

        var result = $("#bottom").find("h3").html();

        if(expected == result){
            succes++;
            console.log("PASSED: ", arr);
        }else{
            var errorMsg = "FAILED:  " + arr + "  Expected: " + expected.toString() + ", got: " + result;
            errors++;
            console.log("FAILED: ", arr, " Expected:", expected.toString(), ", got:", result);
            errorList.push(errorMsg);
        }

        return Test;
    }

    function log(text){
        console.log(text);

        return Test;
    }

    function result(){
 
        if(errors){
            console.log(errors.toString(), "of", total.toString(), "tests failed:");
            errorList.forEach(function(val, i){
                console.log(val);
            });
        }else{
            console.log("All tests passed!");
        }
    }


    return {
        testSequence: testSequence,
        log: log,
        result: result
    }
})();


Test
    .log("Basic calculations")
    .testSequence(["2","plus","2"], "4")
    .testSequence(["1","2","minus","5"], "7")
    .testSequence(["4","divide","2"], "2")
    .testSequence(["3","3","multiply","1","5"], "495")

    .log("Hitting 'clear' should clean display")
    .testSequence(["2","3","plus","3","5","minus","8","9","plus","c"], 0)
    
    .log("Number shouldn't start with multiple zeros")
    .testSequence(["0","0","0","comma","2"], 0.2)
    .testSequence(["0","0","0"], 0)

    .log("Number shouldn't contain more than one comma")
    .testSequence(["comma","comma","2"], 0.2)
    .testSequence(["comma","2","comma","0","3"], 0.203)

    .log("Only last operation should be used")
    .testSequence(["2","plus","minus", "1"], 1)
    .testSequence(["1","0","plus","minus", "4","divide","multiply","2"], 2)

    .log("Pressing operator after '=' should start new calculation with previous result")
    .testSequence(["3","plus","5","is","plus","2"], 10)

    .log("Result should remove floating point error")
    .testSequence(["comma","1","multiply","comma","2"], 0.02)

    .result();
