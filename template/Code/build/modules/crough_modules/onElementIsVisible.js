import debounce from "./debounce"

/**
 * A trigger which runs a callback function based on whether an element on the page has been viewed by the user.
 * @param {string} elementToCheck - A CSS selector
 * @param {function} callback - The function to run when the elementToCheck has returned true
 * @param {string} [elementIndex] - If there are multiple of the same CSS selectors available on the page, specify the index number of the element you want to target
*/
export default function onElementIsVisible(elementToCheck, callback, elementIndex) {
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