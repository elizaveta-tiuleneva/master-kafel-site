export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif)$/i;

export const emptyLead = {
  name: "",
  phone: "",
  district: "",
  roomType: "",
  area: "",
  message: "",
  consent: false,
};

export function normalizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

export function parseArea(value) {
  const text = String(value).trim().replace(",", ".");
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) && number > 0 && number <= 10000 ? number : NaN;
}

/** Возвращает объект { поле: ключ ошибки } для t.consultation.errors. */
export function validateLead(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "name";

  const digits = normalizePhone(form.phone).replace(/^\+/, "");
  if (!form.phone.trim()) errors.phone = "phone";
  else if (digits.length < 9 || digits.length > 13) errors.phone = "phoneInvalid";

  if (Number.isNaN(parseArea(form.area))) errors.area = "area";
  if (!form.consent) errors.consent = "consent";
  return errors;
}

// HEIC с iPhone браузер иногда отдаёт с пустым type — тогда смотрим расширение.
export function checkFile(file) {
  const typeOk = ALLOWED_TYPES.includes(file.type) || (!file.type && ALLOWED_EXTENSIONS.test(file.name));
  if (!typeOk) return "badType";
  if (file.size > MAX_FILE_SIZE) return "tooBig";
  return null;
}
