function elementExists(el) {
    return document.querySelectorAll(el).length > 0;
}

function isFunction(x) {
    return typeof x === "function";
}

function isString(x) {
    return typeof x === "string";
}

/**
 * @callback pollForCallback
 * @param {string|function|array} assertion - The assertion that was passed to pollFor
*/

/**
 * A poller which allows you to wait for specific criteria before running
 * a callback function.
 * @param {string|function|array} assertion - Either a CSS selector, a function that returns a boolean, or an array of functions
 * @param {pollForCallback} onSuccess - The function to run when the assertion has returned true
 * @param {number|null} [timeout=10] - How many seconds should we poll for before giving up
 * @param {pollForCallback|null} [onTimeout] - An optional function to run when polling has timed out
*/

function pollFor(assertion, onSuccess) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var onTimeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var test,
        // Holds the function that will be tested on each loop
        expired = false,
        // A flag that will be set to true on timeout
        timeoutInSeconds = timeout * 1000; // Converts the seconds passed in to milliseconds
    // Convert the assertion into a testable function

    if (isFunction(assertion)) {
        test = assertion;
    } else if (isString(assertion)) {
        test = function test() {
            return elementExists(assertion);
        };
    } else if (Array.isArray(assertion)) {
        test = function test() {
            return assertion.reduce(function(o, n) {
                if (typeof n !== "function" && typeof n !== "string") {
                    throw new Error("assertion is not a string or function");
                }

                o.push(typeof n === "function" ? n() : elementExists(n));
                return o;
            }, []).indexOf(false) === -1; // All assertions need to evaluate to true
        };
    } else {
        throw new Error("assertion must be a Function, String, or Array");
    } // Ensure backwards compatability for requestAnimationFrame;


    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }; // This will repeatedly test the assertion until expired is true


    function loop() {
        if (expired === true) {
            // If onTimeout exists, call it
            if (isFunction(onTimeout)) {
                onTimeout(assertion);
            }
        } else {
            if (test() === true) {
                onSuccess(assertion);
            } else {
                requestAnimationFrame(loop);
            }
        }
    } // Kick off the loop


    if (typeof test === "function") {
        loop(); // Set the expired flag to true after the elapsed timeout

        window.setTimeout(function() {
            expired = true;
        }, timeoutInSeconds);
    }
}

/**
 * Function to initialise the mouse leave detection function.
 * @param {string} conditions - Conditions to be met for the function to run. Has to return true.
 * @param {function} callback - The function to run when the conditions have returned true
 * @param {number}  [threshold=5] - Threshold set for mouse y position
*/
function onMouseLeave(conditions, callback) {
    var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

    // declare conditionCheck function as variable
    // pass the event to the function
    var conditionCheck = function conditionCheck(event) {
            // check if conditions are met and that mouse y position is less than threshold (defaults to 5)
            if (conditions && event.y < threshold) {
                // call callback function
                callback();
            }
        },
        // declare listenerController function to easily handle adding and removing the event listent
        listenerController = function listenerController(method) {
            switch (method) {
                case "add":
                    document.body.addEventListener("mouseleave", conditionCheck, false);
                    break;

                case "remove":
                    document.body.removeEventListener("mouseleave", conditionCheck, false);
                    break;
            }
        },
        select = document.getElementsByTagName("select"); // attach mouse leave event to body, call conditionCheck when mouse leave event detected


    document.body.addEventListener("mouseleave", conditionCheck, false); // the following focusin and focusout event functions are for cross-browser compatibility. They ensure the condition check is not called on Edge, IE and possibly Firefox
    // when a select element is focused, remove the event listener, when it is blurred, add the event listenr

    for (var i = 0, length1 = select.length; i < length1; i++) {
        select[i].addEventListener("focus", listenerController("remove"), false);
        select[i].addEventListener("blur", listenerController("add"), false);
    }
}

/**
 * Call a function after there has been no interaction for a set period
 * @param {function} callback - The function to run after no interaction
 * @param {function} [time=7000] - How long before calling the callback in milliseconds
*/
function onNoInteraction(callback, time) {
    var t,
        delay = time || 7000;

    function timeout() {
        t = window.setTimeout(function() {
            window.removeEventListener("scroll", reset);
            window.removeEventListener("keyup", reset);
            callback();
        }, delay);
    }

    function clear(timer) {
        window.clearTimeout(timer);
    }

    function reset() {
        clear(t);
        timeout();
    }

    window.addEventListener("scroll", reset);
    window.addEventListener("keyup", reset);
    timeout();
}

/**
 * A trigger which runs a callback function based on whether an element on the page has been viewed by the user.
 * @param {string} elementToCheck - A CSS selector
 * @param {function} callback - The function to run when the elementToCheck has returned true
 * @param {string} [elementIndex] - If there are multiple of the same CSS selectors available on the page, specify the index number of the element you want to target
*/
function onElementIsVisible(elementToCheck, callback, elementIndex) {
    checkNumberOfElements();
    var trackedElement;
    var doneArray = [];
    var check_if_elements_in_viewport = debounce(check_function, 50);

    function checkNumberOfElements() {
        if (document.querySelectorAll(elementToCheck).length > 1) {
            if (elementIndex !== undefined) {
                trackedElement = document.querySelectorAll(elementToCheck)[elementIndex];
            } else {
                throw new Error("There are multiple elements on page with the same selector name. Please specify the one you want to target");
            }
        } else {
            trackedElement = document.querySelector(elementToCheck);
        }
    }

    function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth;
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;

            var later = function later() {
                timeout = null;

                if (!immediate) {
                    func.apply(context, args);
                }
            };

            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    function elementChecker(element) {
        if (doneArray.indexOf(element) > -1) {
            return true;
        } else {
            // element has not been seen before
            return false;
        }
    }

    function check_function() {
        var is_in_viewport = elementInViewport(trackedElement),
            already_seen = elementChecker(trackedElement);

        if (!already_seen && is_in_viewport) {
            //Element has been seen
            doneArray.push(trackedElement);
            callback();
        }
    }

    if (trackedElement !== null) {
        window.addEventListener("scroll", check_if_elements_in_viewport);
    } else {
        throw new Error("Element Not Found");
    }
}

/**
 * Function for GA tracking. Use ga.sendEvent() to call the function.
 * @param {Object} gaPayload - Used to pass through specific properties for the GA tracking
 * @param {string} gaPayload.trackingId - UA Tracking ID for test tracking to be sent to
 * @param {string} gaPayload.dimensionNumber - Dimension index for test tracking to be sent to
 * @param {string} gaPayload.campaignName - Campaign name for CRO test
 * @param {boolean} gaPayload.notInteractive - Specify whether the event should NOT count as an interaction
 * @param {string} [gaPayload.category=iPro CRO] - Event category to be sent to GA
 * @param {string} gaPayload.action - Event action to be sent to GA
 * @param {string} gaPayload.label - Event label to be sent to GA
*/
function sendEvent(gaPayload) {
    var trackerObject = "undefined";
    initialiseGATracking(gaPayload);

    function initialiseGATracking(data) {
        if (typeof ga === "function" && ga.loaded) {
            // for debugging only
            // console.log('ga loaded')
            return getTrackerName(data);
        } else {
            // for debugging only
            // console.log('ga not loaded')
            setLooper(initialiseGATracking, data, 750, 15000); // stop looping if GA or tracker are not found after 15s
        }
    }

    function getTrackerName(data) {
        var allTrackers; // use ga object methods inside a readyCallback as they're guaranteed to be available

        ga(function() {
            allTrackers = ga.getAll();
            trackerObject = allTrackers.reduce(function(trackers, tracker) {
                if (tracker.get("trackingId") === data.trackingId) {
                    return tracker;
                }

                return trackers; // accumulator always has to be returned in the reduce method
            });

            if (data.dimensionNumber) {
                setGAdimension(data);
            } else {
                sendEvent(data);
            }
        });
    }

    function setGAdimension(data) {
        trackerObject.set("dimension" + data.dimensionNumber, data.campaignName); // for debugging only
        // console.log('Set dimension' + data.dimensionNumber, data.campaignName)

        return sendEvent(data);
    }

    function sendEvent(data) {
        trackerObject.send("event", {
            nonInteraction: data.notInteractive,
            eventCategory: data.category || "iPro CRO",
            eventAction: data.action,
            eventLabel: data.label
        }); // for debugging only
        // console.log('event set', data.notInteractive, data.category, data.action, data.label)
    }

    function setLooper(functionToLoop, params, timeToLoop, timeToStop) {
        var initialiserLoop = setTimeout(function() {
            functionToLoop(params);
        }, timeToLoop);
        setTimeout(function() {
            clearTimeout(initialiserLoop); // stop looping after 15s
        }, timeToStop);
    }
}