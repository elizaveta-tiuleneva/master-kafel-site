// "2026-05" или "2026-05-14" → «май 2026» / «2026년 5월».
export function formatProjectDate(value, lang) {
  if (!value) return null;
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return null;
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "ru-RU", {
    year: "numeric",
    month: "long",
  })
    .format(date)
    .replace(/\s*г\.$/, "");
}

export function formatArea(value, unit, lang) {
  if (value === null || value === undefined || value === "") return null;
  const number = new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "ru-RU", {
    maximumFractionDigits: 1,
  }).format(value);
  return `${number} ${unit}`;
}
