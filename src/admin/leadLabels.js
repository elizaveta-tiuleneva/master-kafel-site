export const LEAD_STATUSES = [
  { id: "new", label: "Новая", className: "bg-[#fff3d6] text-[#8a5a00]" },
  { id: "in_progress", label: "В работе", className: "bg-ice text-navy" },
  { id: "done", label: "Завершена", className: "bg-[#e6f6ea] text-[#1f7a3a]" },
  { id: "spam", label: "Спам", className: "bg-[#f1f1f1] text-[#666]" },
];

export function statusInfo(id) {
  return LEAD_STATUSES.find((status) => status.id === id) || LEAD_STATUSES[0];
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}
