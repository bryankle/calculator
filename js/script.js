// Bugs to fix
// Number -> operator -> number -> CE -> number, number -> operator/equal
    // Produces inaccurate result
    //** Fixed on line 98

// Number -> operator -> number -> CE -> number -> various operators
    // Operators do not adjust 
    //** Fixed

// Number -> operator -> number -> equal -> operator -> number -> equal
    // Screen does not show result; only equal sign, and history shows previous number in additon to '='
    //** FIXED

// Number -> operator -> number -> operator -> equal
    // Equal shows but does not compute
    //** Solution: Disable equal button if equals is already present in history
    //** Solution: Disable equal button if any operator is currently on main screen
    //** Fixed

// Number -> equal sign -> Number
    // Currently fixing
    //** Fixed; now equals previous number and resets to 0 when equal is clicked again

// Number -> equal -> equal
    //** Fixed; see line 173 and line 213 function

// Decimal -> zero -> zero
    //** Fixed: see line 141
// LATEST BUG FIXING: Line 9

// TO ADD

// Decimal limiter
    //** Implemented
// Cut off at 7 digits
    //** Implemented
// Cut off at 23 digits in history
    //** Implemented

// Number -> operator -> Number -> CE -> number
    // Produces a 0 before number

// Get buttons to alert and display clicked button

// Variable declaration
//var btns = document.getElementsByTagName('button');
var btns = document.getElementsByClassName('btns');
var answer = document.getElementById('answer');
var record = document.getElementById('record');

var reducingArr = [];
var reducingOp, // Records last operator to determine method of array reduction
    c,
    ceCount = 0;
    numCount = 0; // Number exceedance counter
    histCount = 0; // Number exceedance counter bottom line

var operations = {
    "+" : function (a, b) {
        c = a + b
        return parseFloat(c.toFixed(2));
    },
    "-" : function (a, b) {
        c = a - b
        return parseFloat(c.toFixed(2));
    },
    "*" : function (a, b) {
        c = a * b
        return parseFloat(c.toFixed(2));
    },
    "/" : function (a, b) {
        c = a / b
        return parseFloat(c.toFixed(2));
    }
};
// Collection of calculator buttons
var numberArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var operatorArray = ['+', '-', '*', '/', '='];
var clearArray = ['AC', 'CE'];

// START HERE
// Adding event listeners to all buttons
for (i = 0; i < btns.length; i++) {
    (function(i) {
        btns[i].addEventListener('click', function() {
            checkType(this.innerHTML);
        })
    }(i))
}

// Evaluates action based on button clicked
function checkType(val) {
    if (numberArray.indexOf(val) !== -1) {
        console.log('You clicked a number');
        clickNumber(parseFloat(val));
    }
    else if (operatorArray.indexOf(val) !== -1) {
        console.log('You clicked an operator');
        clickOperator(val);
    }
    else if (clearArray.indexOf(val) !== -1) {
        console.log('You clicked the clear button');
        restart(val);
    }
    else if (val == '.') {
        console.log('You clicked the decimal button')
        addDecimal();
    }
}
// Behavior when clicking on numbers 
var clickNumber = function(num) { // Linked to line 26
    num = parseFloat(num)
    console.log(num)
    var getMainScreen = answer.firstChild.nodeValue;
    var getHistory = record.firstChild.nodeValue;
    ceCount = 0;
    numCount++; // For number exceedance condition; see line 265
    histCount++;
    // Runs when calculator initally displays 0
    if (answer.firstChild.nodeValue == '0' && !reducingOp) { // Allow reducingOp to equal all operators excluding equal

        answer.firstChild.nodeValue = num;
        record.firstChild.nodeValue = num;
    }
    // Checks if operator is currently active on main screen; resets main screen for future number input if true
    else if (operatorArray.indexOf(getMainScreen) !== -1) {

        answer.firstChild.nodeValue = num;
        record.firstChild.nodeValue += num;
    }
    // Resets all calculations after calculations have been performed
    else if (reducingOp == '=') {
        resetAll();
    }
    else if (numCount > 7 || histCount > 23) { // Watch character limit on main screen and history screen to reset if exceeds value 
        exceedLimit();
    }

    // Runs when calculator already shows non-zero initial values
    else {
        if (getMainScreen == 0 && !getHistory.indexOf('.')) { // Second conditional added to allow consecutive zeros when decimal is present
            answer.firstChild.nodeValue = num;                                                              // Third condtional added to check getHistory bottom row for operators to determine allow this body to execute and remove initial 0 from main screen
            record.firstChild.nodeValue += num; 
        }
        else {
            if (getMainScreen == '0') {
                answer.firstChild.nodeValue = num;
                record.firstChild.nodeValue += num; 
            }
            else {
                answer.firstChild.nodeValue += num;
                record.firstChild.nodeValue += num; 
            }
        }
    }
}

var clickOperator = function(op) { // Linked to line 30
    var getHistory = record.firstChild.nodeValue; // Important to have var in local context of function; will not replace operators in history if moved to global
    var getMainScreen = answer.firstChild.nodeValue;
    var arr,
        str;
    numCount = 0; // For limit exceedance counter
    histCount++;
    //reducingOp == '=' ? reducingOp = op : reducingOp;

    if (answer.firstChild.nodeValue == '0') { 
        // Do nothing if screen shows 0
    }
    // Checks last character of history for operator
    else if (operatorArray.indexOf(getHistory[getHistory.length - 1]) !== -1) { // ADJUSTED

        if (op == '=') {
            // Do nothing when operator is preselected and equal is selected
        }
        else {
            // Updates the latest operator when user decides to change existing operator in history
            arr = record.firstChild.nodeValue.split('');
            arr.splice(arr.length - 1, 1, op);
            str = arr.join('');
            record.firstChild.nodeValue = str;
            // Updates current operator on main screen
            answer.firstChild.nodeValue = op;
            // Updates current operating array for purposes of reduction; see line 10
            reducingOp = op;
        }      
    }
    // Equal button selected
    else if (reducingOp == '=') {
        histCount = 0;
        if (operatorSearch(getHistory, operatorArray) && op == '=') {
            // Disables equal button if an operator already exists on history; see line 22 for bug description
            // Do nothing
        }
        else {
            reducingOp = op; // FIX for bug; see line 9;

            // Replace screen content with operator
            answer.firstChild.nodeValue = op;
            // Add operator to history
            record.firstChild.nodeValue = reducingArr[0] + op;
        }
        
    }

    // Resume normal operations
    else {
        resumeOperation(op)
    }
}
// Seperated from above
var resumeOperation = function(op) {
        // Upload current number from screen before clearing
        console.log(typeof(answer.firstChild.nodeValue))
        arrayUpdate(parseFloat(answer.firstChild.nodeValue), reducingOp);
        if (op == '=' && reducingArr.length > 0) {
            // Read the length of the final answer to determine if it meets length requirement
            answerLength = reducingArr[0].toString().length;
            console.log(answer.length);
            if (answerLength > 7) {
                exceedLimit();
            }
            else {
                answer.firstChild.nodeValue = reducingArr[0];
                record.firstChild.nodeValue += '=' + reducingArr[0];
            }
        }
        else {
            // Replace screen content with operator
            answer.firstChild.nodeValue = op;
            // Add operator to history
            record.firstChild.nodeValue += op;
        }
        // Update latest operator on record; placement here is important
        reducingOp = op;
}

var operatorSearch = function(str, arr) {
    var cond = false;
    arr.forEach(function(val) {
        str.indexOf(val) !== -1 ? cond = true : cond;
    });
    return cond;
}
// AC and CE button functionality - restarts calculator
var restart = function(val) {
    var getHistory = record.firstChild.nodeValue;
    var getMainScreen = answer.firstChild.nodeValue;
    if (val == 'AC') {
        resetAll();
    }
    else if (val == 'CE') {
        ceCount++;
        if (ceCount < 2) { // Second conditional added to trigger else to reset all when equal is present in history
            // If no operator has yet been selected 
            if (!reducingOp) {
                console.log('test')
                answer.firstChild.nodeValue = 0;
                record.firstChild.nodeValue = 0;
            }
            // Reset calculator to 0 if CE is selected after an equation has been resolved
            else if (getHistory.indexOf('=') > -1) {
                resetAll();
            }
            else {
                // Cut the deleted portion of the string from the main screen in the history
                record.firstChild.nodeValue = getHistory.substring(0, getHistory.length - getMainScreen.length);
                answer.firstChild.nodeValue = 0;
            }
        }

        else {
            resetAll();
        }
    }
}
// Reset calculator
var resetAll = function () {
    answer.firstChild.nodeValue = '0';
    record.firstChild.nodeValue = '0';
    reducingOp = '';
    reducingArr = [];
    ceCount = 0;
    numCount = 0;
    histCount = 0;
}
// Notify user when space limit is exceeded in calculator
var exceedLimit = function() {
    numCount = 0;
    histCount = 0;
    record.firstChild.nodeValue = "Digits Limit Met";
    answer.firstChild.nodeValue = '0';
    reducingOp = '';
    reducingArr = [];
}
// Used to determine length of number entered
var arrayUpdate = function(getMainScreen, op) {
    var toNum = parseFloat(getMainScreen);
    var reduced;
    reducingArr.push(toNum);
    if (reducingArr.length == 2) {
        reduced = reducingArr.reduce(operations[op])
        reducingArr = [reduced];
    }
}
// Enable decimals
var addDecimal = function() {
    var getMainScreen = answer.firstChild.nodeValue;

    if (reducingOp == '=') {
        resetAll();
    }
    else if (answer.firstChild.nodeValue.indexOf('.') == -1) {
        answer.firstChild.nodeValue += '.';
        record.firstChild.nodeValue += '.';
    }
}

// Allows drag and drop functionality for calculator
interact('.draggable')
  .draggable({
    // enable initial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

    
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;





