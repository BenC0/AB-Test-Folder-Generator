export default function croLog(source, event) {
  window.cro_log = window.cro_log || [];
  var id = (window.cro_log.length === 0) ? 1 : window.cro_log.length + 1;
  window.cro_log.push({
    "id": id,
    "source": source,
    "event": event
  });
}