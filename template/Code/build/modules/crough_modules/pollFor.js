import isString from "./isString"
import isFunction from "./isFunction"
import elementExists from "./elementExists"

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

export default function pollFor(assertion, onSuccess) {
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