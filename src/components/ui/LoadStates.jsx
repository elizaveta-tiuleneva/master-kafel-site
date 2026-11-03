import { useLanguage } from "../../i18n/LanguageContext.jsx";

export function CardSkeletons({ count = 4 }) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10" aria-busy="true">
      <span className="sr-only">{t.common.loading}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-ice-border/70 bg-white">
          <div className="animate-pulse bg-ice" style={{ aspectRatio: "4 / 3" }} />
          <div className="space-y-3 p-6">
            <div className="h-3 w-1/3 animate-pulse rounded bg-ice" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-ice" />
            <div className="h-3 w-full animate-pulse rounded bg-ice" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  const { t } = useLanguage();
  return (
    <div role="alert" className="rounded-lg border border-[#f1b8b0] bg-[#fff7f6] px-6 py-12 text-center">
      <p className="text-[16px] font-semibold text-[#b42318]">{t.common.loadError}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-[5px] border border-navy bg-white px-5 py-2 text-[15px] font-semibold text-navy hover:bg-ice-bg"
        >
          {t.common.retry}
        </button>
      ) : null}
    </div>
  );
}
