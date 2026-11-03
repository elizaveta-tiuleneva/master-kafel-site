import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const buttonClass = (value) =>
    `px-2 py-1 rounded transition-colors ${
      lang === value
        ? "bg-white text-navy font-bold shadow-xs"
        : "text-muted hover:text-navy"
    }`;

  return (
    <div
      aria-label="Language selection"
      className="flex items-center bg-ice/80 border border-ice-border/60 p-1 rounded text-[11px] font-semibold tracking-wide"
      role="group"
    >
      <button
        className={buttonClass("ko")}
        type="button"
        onClick={() => setLang("ko")}
      >
        한국어
      </button>
      <span className="px-1 text-muted/40">|</span>
      <button
        className={buttonClass("ru")}
        type="button"
        onClick={() => setLang("ru")}
      >
        RU
      </button>
    </div>
  );
}
