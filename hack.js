// ==UserScript==
// @name         CircuitLabHax
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.circuitlab.com/editor/
// @grant GM_addStyle

// ==/UserScript==

//// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js



function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function launch() {
    var window = unsafeWindow;

    $('body').append("<button id='save-btn'>Save</button><button id='load-btn'>Load</button>");
    GM_addStyle("#save-btn, #load-btn { position: fixed; z-index:10000; left:0; width: 100px; height:30px;}");
    GM_addStyle("#save-btn { top: 15px }");
    GM_addStyle("#load-btn { top: 45px }");

    $('#save-btn').click(function() {
        var srcJson = window.slm.c.X.c.toJSON();
        copyToClipboard(JSON.stringify(srcJson));
        alert('copied circuit to clipboard. save the code in a file to load later');

    });

    $('#load-btn').click(function() {
        var userCode = prompt('enter json code');
        var jsonCode = JSON.parse(userCode);

        window.slm.c.X.c.hr(jsonCode);

    });
}

(function() {
    'use strict';

    //http://stackoverflow.com/questions/23683439/gm-addstyle-equivalent-in-tampermonkey
    GM_addStyle('#RegisterPopup_container, #timetrialhypersticial_container, .cl_modal_overlay { display: none !important; }');

    function hide(x) {
        $(x).css('opacity', '0');
        $(x).css('position', 'fixed !important'); //css('z-index', '-9000');
        $(x).css('width', '0px');
        $(x).css('height', '0px');
        //$(x).css('left', '500000 !important');
    }
   // console.log('hiding');
    function hideStuff() {
        hide('#RegisterPopup_container');
        hide('#timetrialhypersticial_container');
        hide('.cl_modal_overlay');
        setTimeout(hideStuff, 500);
    }

    //hideStuff();

    // Your code here...
    setTimeout(function() {
        launch();
    }, 1000);


})();



//https://developer.mozilla.org/en-US/docs/Glossary/Call_stack
//http://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
function searchArr(arr, elem, stack) {
    for (var x in arr) {
        if (x == elem)
            return true;
        else
            searchArr(x, elem, stack + '.' + x);
    }
}

function scanScope(whatToScan, scanValue, recPath, depth) {
    if (depth == 0)
        return;

	for (var key in whatToScan) {
        //if (key == '$' || key == 'scanScope') continue;

		if (key == scanValue) { // || whatToScan[key] == scanValue) {
			console.log(key + ' = ' + whatToScan[key]);
            console.log('found ' + recPath + '.' + key);
            return;
		} else {


            if (typeof(whatToScan[key]) === "function") {
                var srcx = whatToScan[key].toString();
                if (srcx.indexOf(scanValue) != -1) {
                    console.log('============ITS A FUNCTION');
                    console.log('found ' + recPath + '.' + key);
                    console.log(srcx);
                    return;
                }
            }

            if( (typeof whatToScan[key] === "object") && (key !== null) ) {
				scanScope(whatToScan[key], scanValue, recPath + '.' + key, depth-1);
			}
		}
	}
}

function searchWin(name) {
    scanScope(window, name, 'window', 4);
}
