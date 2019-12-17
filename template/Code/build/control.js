import bc_log_event from "./modules/BcLog"
import ga_send_event from "./modules/Tracking"

const test_id = "AWL"
const variation = "Control"
const custom_dimension = "18"

function init() {
  bc_log_event("init", "Variation Called")
  if (!document.body.classList.contains(`${test_id}_loaded`)) {
    bc_log_event("init", "Body Class Check Passed")
    document.body.classList.add(`${test_id}_loaded`);
    
    ga_send_event(custom_dimension, test_id, variation, "Loaded");
  }
}

function conditions() {
  return typeof ga !== "undefined" && typeof $ !== "undefined";
}

function pollElements() {
  bc_log_event("pollElements", "Poller Called")
  let x = 0;

  let waitForLoad = function waitForLoad() {
    bc_log_event("pollElements", `Conditions Check: ${conditions()}`)
    if (conditions()) {
      init();
    } else if (!conditions() && x < 10) {
      x++;
      window.setTimeout(waitForLoad, 5);
    }
  };

  window.setTimeout(waitForLoad, 5);
}

pollElements();