// Сайт может открываться из подпапки (GitHub Pages: /имя-репозитория/).
// BASE_URL берётся из настройки base в vite.config.js и всегда кончается на "/".
const BASE = import.meta.env.BASE_URL;

export const ROUTER_BASENAME = BASE.replace(/\/$/, "") || "/";

/** Адрес страницы сайта для обычных ссылок <a> (новая вкладка и т.п.). */
export function siteUrl(path = "") {
  return `${BASE}${path.replace(/^\//, "")}`;
}
