import cro from "./modules/CROugh"
import "./modules/variation_1.scss"

console.log(`cro: `, cro)

const test_id = "AWL"
const variation = "Variation 1"
const custom_dimension = "18"

function init() {
  cro.croLog("init", "Variation Called")
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