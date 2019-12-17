export default function mutation_observer(el_to_watch = "body", callback = _ => { console.count("Observer Fired")}) {
  callback = callback
  // Select the node that will be observed for mutations
  var targetNode = document.querySelector(el_to_watch); // Options for the observer (which mutations to observe)

  var config = {
    attributes: false,
    childList: true,
    subtree: true
  }

  var observer = new MutationObserver(callback); // Start observing the target node for configured mutations

  observer.observe(targetNode, config);
  targetNode.setAttribute('class', 'observer_attached');
}