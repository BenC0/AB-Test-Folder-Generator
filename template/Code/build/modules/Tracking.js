export default function ga_send_event(custom_dimension, test_id = "AWL000", variation = "Unassigned", event_action = "") {
  let tracker_exists = !!ga.getByName(`${test_id}_cro_tracker`) || false

  if (!tracker_exists) {
    ga("create", "UA-76601428-1", {
      name: `${test_id}_cro_tracker`
    })
  }

  let event_obj = {
    'hitType': "event",
    'eventCategory': "CRO Test Reporting",
    'eventAction': `${test_id}: ${variation} - ${event_action}`,
    'eventLabel': `${test_id}`,
    'eventValue': '1',
    'nonInteraction': 1
  }

  event_obj[`dimension${custom_dimension}`] =  `${test_id}: ${variation}`

  ga(`${test_id}_cro_tracker.send`, event_obj)
}