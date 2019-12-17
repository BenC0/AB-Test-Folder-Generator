export default function bc_log_event(source, event) {
  window.bc_log = window.bc_log || [];
  var id = (window.bc_log.length === 0) ? 1 : window.bc_log.length;
  window.bc_log.push({
    "id": id,
    "source": source,
    "event": event
  });
}