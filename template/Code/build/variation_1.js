import * as nbf from "./modules/nbf"
import "./modules/variation_1.scss"
import bc_log_event from "./modules/BcLog"
import ga_send_event from "./modules/Tracking"

const test_id = "AWL"
const variation = "Variation 1"
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

nbf.pollFor(conditions, init)