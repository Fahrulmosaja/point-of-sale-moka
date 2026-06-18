export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function formatDuration(startStr: string) {
  const diffMs = Date.now() - new Date(startStr).getTime();
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
