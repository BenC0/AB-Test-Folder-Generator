export default function elementExists(el) {
    return document.querySelectorAll(el).length > 0;
}