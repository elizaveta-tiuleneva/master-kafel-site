import { CATEGORY_IDS } from "../../data/categories.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function CategoryFilter({ value, onChange }) {
  const { t } = useLanguage();
  const options = [
    { id: "all", label: t.portfolio.all },
    ...CATEGORY_IDS.map((id) => ({ id, label: t.categories[id] })),
  ];

  return (
    <div
      role="group"
      aria-label={t.portfolio.filterLabel}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active
                ? "border-navy bg-navy text-white"
                : "border-ice-border bg-white text-muted hover:border-navy/40 hover:text-navy"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
