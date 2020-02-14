import cro from "./modules/CROugh"

const test_id = "AWL"
const variation = "Control"
const custom_dimension = "18"

function init() {
  cro.croLog("init", "Control Called")
  if (!document.body.classList.contains(`${test_id}_loaded`)) {
    cro.croLog("init", "Body Class Check Passed")
    document.body.classList.add(`${test_id}_loaded`);
    
    cro.gaSendEvent(custom_dimension, test_id, variation, "Loaded");
  }
}

function conditions() {
  return typeof ga !== "undefined" && typeof $ !== "undefined";
}

cro.pollFor(conditions, init)