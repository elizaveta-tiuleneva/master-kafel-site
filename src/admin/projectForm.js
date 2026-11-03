import { CATEGORY_IDS } from "../data/categories.js";
import { translations } from "../i18n/translations.js";
import { TEXT_FIELDS } from "../api/adminProjects.js";

export const CATEGORY_LABELS = translations.ru.categories;
export { CATEGORY_IDS };

export const FIELD_LABELS = {
  title: "Название",
  district: "Район",
  summary: "Краткое описание (2 строки на карточке)",
  task: "Исходная задача",
  work: "Выполненные работы",
  result: "Результат",
};

export const FIELD_HINTS = {
  district: "Например: Тэджон, Юсон-гу",
  work: "Каждый пункт — с новой строки",
};

export function emptyForm() {
  const form = { category: "bathroom", month: "", area: "" };
  TEXT_FIELDS.forEach((name) => {
    form[`${name}_ru`] = "";
    form[`${name}_ko`] = "";
  });
  return form;
}

export function formFromRow(row) {
  const form = {
    category: row.category,
    month: row.completed_on ? row.completed_on.slice(0, 7) : "",
    area: row.area_m2 === null || row.area_m2 === undefined ? "" : String(row.area_m2),
  };
  TEXT_FIELDS.forEach((name) => {
    form[`${name}_ru`] = row[`${name}_ru`] || "";
    form[`${name}_ko`] = row[`${name}_ko`] || "";
  });
  return form;
}

function parseArea(value) {
  const text = value.trim().replace(",", ".");
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) && number > 0 && number < 100000 ? number : NaN;
}

export function rowFromForm(form) {
  const row = {
    category: form.category,
    completed_on: form.month ? `${form.month}-01` : null,
    area_m2: parseArea(form.area),
  };
  TEXT_FIELDS.forEach((name) => {
    row[`${name}_ru`] = form[`${name}_ru`].trim();
    row[`${name}_ko`] = form[`${name}_ko`].trim();
  });
  return row;
}

/** Список понятных сообщений; пустой — можно сохранять. */
export function validateForm(form, { forPublish }) {
  const problems = [];
  if (!CATEGORY_IDS.includes(form.category)) problems.push("Выберите категорию.");
  if (Number.isNaN(parseArea(form.area))) problems.push("Площадь — укажите число, например 6 или 6,5.");
  if (forPublish) {
    if (!form.title_ru.trim()) problems.push("Заполните название на русском.");
    if (!form.district_ru.trim()) problems.push("Заполните район на русском.");
    if (!form.title_ko.trim()) problems.push("Заполните название на корейском.");
    if (!form.district_ko.trim()) problems.push("Заполните район на корейском.");
  }
  return problems;
}

export function canPublish(row) {
  return ["title_ru", "title_ko", "district_ru", "district_ko"].every((key) => row[key]?.trim());
}

/** Главная фото: выбранная вручную или первое «После». */
export function effectiveCover(row) {
  const photos = row.project_photos || [];
  return (
    photos.find((photo) => photo.id === row.cover_photo_id) ||
    photos.find((photo) => photo.kind === "after") ||
    photos[0] ||
    null
  );
}
