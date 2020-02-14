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