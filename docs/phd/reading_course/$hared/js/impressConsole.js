/**
 * impressConsole.js
 *
 * Adds a presenter console to impress.js
 *
 * MIT Licensed, see license.txt.
 *
 * Copyright 2012, 2013, 2015 impress-console contributors (see README.txt)
 *
 * --------------------------------------------------------------------------- *
 *
 * Modified by: @hamidazimy
 * version: 1.4
 *
 */

(function(document, window) {
    'use strict';

    // Settings to set iframe in speaker console
    const peekViewDefaultFactor = 0.7;
    const peekViewMinimumFactor = 0.5;
    const peekViewGap = 16;

    // This is the default template for the speaker console window
    const consoleTemplate = '<!DOCTYPE html>' +
        '<html lang="en">' +
          '<head>' +
            '<link rel="stylesheet" href="{{cssFile}}">' +
          '</head>' +
          '<body>' +
            '<div id="console">' +
              '<div id="views">' +
                '<iframe id="thisView" scrolling="no"></iframe>' +
                '<iframe id="peekView" scrolling="no"></iframe>' +
              '</div>' +
              '<div id="notes"></div>' +
            '</div>' +
            '<div id="controls"> ' +
              '<div id="prev"><button href="#" onclick="window.impressConsole().prev(); return false;">←</button></div>' +
              '<div id="next"><button href="#" onclick="window.impressConsole().next(); return false;">→</button></div>' +
              '<div id="clock">--:--</div>' +
              '<div id="timer" onclick="timerReset()">00m 00s</div>' +
              '<div id="status">Loading</div>' +
            '</div>' +
          '</body>' +
        '</html>';

    // Default css location
    var cssFile = "../../$hared/css/impressConsole.css";

    // css for styling iframs on the console
    var cssFileIframe = "../../$hared/css/iframe.css";

    // All console windows, so that you can call impressConsole() repeatedly.
    var allConsoles = {};

    // Zero padding helper function:
    var zeroPad = function(i) {
        return (i < 10 ? '0' : '') + i;
    };

    // The console object
    var impressConsole = window.impressConsole = function(rootId) {

        rootId = rootId || 'impress';

        if (allConsoles[rootId]) {
            return allConsoles[rootId];
        }

        // root presentation elements
        var root = document.getElementById(rootId);

        var consoleWindow = null;

        var nextStep = function() {
            var classes = "";
            var nextElement = document.querySelector('.active');
            // return to parents as long as there is no next sibling
            while (!nextElement.nextElementSibling && nextElement.parentNode) {
                nextElement = nextElement.parentNode;
            }
            nextElement = nextElement.nextElementSibling;
            while (nextElement) {
                classes = nextElement.attributes['class'];
                if (classes && classes.value.indexOf('step') !== -1) {
                    return nextElement;
                }

                if (nextElement.firstElementChild) { // first go into deep
                    nextElement = nextElement.firstElementChild;
                }
                else {
                    // go to next sibling or through parents until there is a next sibling
                    while (!nextElement.nextElementSibling && nextElement.parentNode) {
                        nextElement = nextElement.parentNode;
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
            // No next element. Pick the first
            return document.querySelector('.step');
        };

        // Sync the notes to the step
        var onStepLeave = function() {
            if (consoleWindow) {
                // Set notes to next steps notes.
                var newNotes = document.querySelector('.active').querySelector('.notes');
                if (newNotes) {
                    newNotes = newNotes.innerHTML;
                } else {
                    newNotes = '<div class="noNotes">No notes for this step!</div>';
                }
                consoleWindow.document.getElementById('notes').innerHTML = newNotes;

                // Set the views
                var baseURL = document.URL.substring(0, document.URL.search('#/'));
                var viewSrc = baseURL + '#' + document.querySelector('.active').id;
                var peekSrc = baseURL + '#' + nextStep().id;
                var thisView = consoleWindow.document.getElementById('thisView');
                // Setting them when they are already set causes glithes in Firefox, so we check first:
                if (thisView.src !== viewSrc) {
                    thisView.src = viewSrc;
                }
                var peekView = consoleWindow.document.getElementById('peekView');
                if (peekView.src !== peekSrc) {
                    peekView.src = peekSrc;
                }

                consoleWindow.document.getElementById('status').innerHTML = '<span class="moving">Moving</span>';
            }
        };

        // Sync the peekViews to the step
        var onStepEnter = function() {
            if (consoleWindow) {
                // We do everything here again, because if you stopped the previos step to
                // early, the onstepleave trigger is not called for that step, so
                // we need this to sync things.
                var newNotes = document.querySelector('.active').querySelector('.notes');
                if (newNotes) {
                    newNotes = newNotes.innerHTML;
                } else {
                    newNotes = '<div class="noNotes">No notes for this step</div>';
                }
                var notes = consoleWindow.document.getElementById('notes');
                notes.innerHTML = newNotes;
                notes.scrollTop = 0;

                // Set the views
                var baseURL = document.URL.substring(0, document.URL.search('#/'));
                var viewSrc = baseURL + '#' + document.querySelector('.active').id;
                var peekSrc = baseURL + '#' + nextStep().id;
                var thisView = consoleWindow.document.getElementById('thisView');
                // Setting them when they are already set causes glithes in Firefox, so we check first:
                if (thisView.src !== viewSrc) {
                    thisView.src = viewSrc;
                }
                var peekView = consoleWindow.document.getElementById('peekView');
                if (peekView.src !== peekSrc) {
                    peekView.src = peekSrc;
                }

                consoleWindow.document.getElementById('status').innerHTML = '<span class="ready">Ready</span>';
            }
        };

        var spaceHandler = function () {
            var notes = consoleWindow.document.getElementById('notes');
            if (notes.scrollTopMax - notes.scrollTop > 20) {
               notes.scrollTop = notes.scrollTop + notes.clientHeight * 0.8;
            } else {
               next();
            }
        };

        var timerReset = function() {
            consoleWindow.timerStart = new Date();
        };

        // Show a clock
        var clockTick = function() {
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();

            // Clock
            var clockStr = zeroPad(hours) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds);
            consoleWindow.document.getElementById('clock').firstChild.nodeValue = clockStr;

            // Timer
            seconds = Math.floor((now - consoleWindow.timerStart) / 1000);
            minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            consoleWindow.document.getElementById('timer').firstChild.nodeValue = zeroPad(minutes) + 'm ' + zeroPad(seconds) + 's';

            if (!consoleWindow.initialized) {
                // Nudge the slide windows after load, or they will scrolled wrong on Firefox.
                consoleWindow.document.getElementById('thisView').contentWindow.scrollTo(0,0);
                consoleWindow.document.getElementById('peekView').contentWindow.scrollTo(0,0);
                consoleWindow.initialized = true;
            }
        };

        var registerKeyEvent = function(keyCodes, handler, window) {
            if (window === undefined) {
                window = consoleWindow;
            }

            // prevent default keydown action when one of supported key is pressed
            window.document.addEventListener("keydown", function(event) {
                if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && keyCodes.indexOf(event.keyCode) !== -1) {
                    event.preventDefault();
                }
            }, false);

            // trigger impress action on keyup
            window.document.addEventListener("keyup", function(event) {
                if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && keyCodes.indexOf(event.keyCode) !== -1) {
                        handler();
                        event.preventDefault();
                }
            }, false);
        };

        var consoleOnLoad = function() {
                resize();
                var thisView = consoleWindow.document.getElementById('thisView');
                var peekView = consoleWindow.document.getElementById('peekView');

                // Firefox:
                thisView.contentDocument.body.classList.add('impress-console');
                peekView.contentDocument.body.classList.add('impress-console');
                thisView.contentDocument.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + cssFileIframe + '">');
                peekView.contentDocument.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + cssFileIframe + '">');

                // Chrome:
                thisView.addEventListener('load', function() {
                        thisView.contentDocument.body.classList.add('impress-console');
                        thisView.contentDocument.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + cssFileIframe + '">');
                });
                peekView.addEventListener('load', function() {
                        peekView.contentDocument.body.classList.add('impress-console');
                        peekView.contentDocument.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + cssFileIframe + '">');
                });
        };

        var open = function() {
            if (top.isconsoleWindow) {
                return;
            }

            if (consoleWindow && !consoleWindow.closed) {
                consoleWindow.focus();
            } else {
                consoleWindow = window.open();

                // if opening failes this may be because the browser prevents this from
                // not (or less) interactive JavaScript...
                if (consoleWindow == null) {
                    // ... so I add a button to klick.
                    // workaround on firefox
                    var message = document.createElement('div');
                    message.id = 'consoleWindowError';
                    message.style.position = "fixed";
                    message.style.left = 0;
                    message.style.top = 0;
                    message.style.right = 0;
                    message.style.bottom = 0;
                    message.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    message.innerHTML = '<button style="margin: 25vh 25vw;width:50vw;height:50vh;" onclick="var x = document.getElementById(\'consoleWindowError\');x.parentNode.removeChild(x);impressConsole().open();">Click to open speaker console</button>';
                    document.body.appendChild(message);
                    return;
                }

                // This sets the window location to the main window location, so css can be loaded:
                consoleWindow.document.open();
                // Write the template:
                consoleWindow.document.write(consoleTemplate.replace("{{cssFile}}", cssFile));
                consoleWindow.document.title = 'Speaker Console (' + document.title + ')';
                consoleWindow.impress = window.impress;
                consoleWindow.impressConsole = window.impressConsole;
                // We set this flag so we can detect it later, to prevent infinite popups.
                consoleWindow.isconsoleWindow = true;
                // Set the onload function:
                consoleWindow.onload = consoleOnLoad;
                // Add clock tick
                consoleWindow.timerStart = new Date();
                consoleWindow.timerReset = timerReset;
                consoleWindow.clockInterval = setInterval('impressConsole("' + rootId + '").clockTick()', 1000);

                // keyboard navigation handlers
                // 33: pg up, 37: left, 38: up
                registerKeyEvent([33, 37, 38], prev);
                // 34: pg down, 39: right, 40: down
                registerKeyEvent([34, 39, 40], next);
                // 32: space
                registerKeyEvent([32], spaceHandler);
                // 82: R
                registerKeyEvent([82], timerReset);

                // Cleanup
                consoleWindow.onbeforeunload = function() {
                    // I don't know why onunload doesn't work here.
                    clearInterval(consoleWindow.clockInterval);
                };

                // It will need a little nudge on Firefox, but only after loading:
                onStepEnter();
                consoleWindow.initialized = false;
                consoleWindow.document.close();

                //catch any window resize to pass size on
                window.onresize = resize;
                consoleWindow.onresize = resize;

                return consoleWindow;
            }
        };

        var resize = function() {
            var thisView = consoleWindow.document.getElementById('thisView');
            var peekView = consoleWindow.document.getElementById('peekView');

            // get ratio of presentation
            var ratio = window.innerHeight / window.innerWidth;

            // get size available for views
            var views = consoleWindow.document.getElementById('views');

            // thisView may have a border or some padding:
            // asuming same border width on both direktions
            var delta = thisView.offsetWidth - thisView.clientWidth;

            // set views
            var thisViewWidth = (views.clientWidth - delta);
            var thisViewHeight = Math.floor(thisViewWidth * ratio);

            var peekViewTop = thisViewHeight + peekViewGap;

            var peekViewWidth = Math.floor(thisViewWidth * peekViewDefaultFactor);
            var peekViewHeight = Math.floor(thisViewHeight * peekViewDefaultFactor);


            // shrink peekView to fit into space available
            if (views.clientHeight - delta < peekViewTop + peekViewHeight) {
                peekViewHeight = views.clientHeight - delta - peekViewTop;
                peekViewWidth = Math.floor(peekViewHeight / ratio);
            }

            // if peekView is not high enough forget ratios!
            if (peekViewWidth <= Math.floor(thisViewWidth * peekViewMinimumFactor)) {
                thisViewWidth = (views.clientWidth - delta);
                thisViewHeight = Math.floor((views.clientHeight - delta - peekViewGap) / (1 + peekViewMinimumFactor));

                peekViewTop = thisViewHeight + peekViewGap;

                peekViewWidth = Math.floor(thisViewWidth * peekViewMinimumFactor);
                peekViewHeight = views.clientHeight - delta - peekViewTop;
            }

            // set the calculated into styles
            thisView.style.width = thisViewWidth + "px";
            thisView.style.height = thisViewHeight + "px";

            peekView.style.top = peekViewTop + "px";

            peekView.style.width = peekViewWidth + "px";
            peekView.style.height = peekViewHeight + "px";
        }

        var init = function(cssConsole, cssIframe) {
            if (cssConsole !== undefined) {
                cssFile = cssConsole;
            }

            if (cssIframe !== undefined) {
                cssFileIframe = cssIframe;
            }

            // Register the event
            root.addEventListener('impress:stepleave', onStepLeave);
            root.addEventListener('impress:stepenter', onStepEnter);

            //When the window closes, clean up after ourselves.
            window.onunload = function(){
                if (consoleWindow && !consoleWindow.closed) {
                    consoleWindow.close();
                }
            };

            //Open speaker console when they press 'p'
            registerKeyEvent([80], open, window);
        };

        var prev = function() {
            impress().prev();
            consoleWindow.document.getElementById('thisView').contentWindow.impress().prev();
        }

        var next = function() {
            impress().next();
            consoleWindow.document.getElementById('thisView').contentWindow.impress().next();
        }

        // Return the object
        allConsoles[rootId] = {init: init, open: open, clockTick: clockTick, registerKeyEvent: registerKeyEvent, prev: prev, next: next};
        return allConsoles[rootId];

    };

})(document, window);
