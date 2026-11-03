import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { PHONES } from "../../data/images.js";
import Icon from "../Icon.jsx";

export default function CtaBanner() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-navy px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-10">
      <div className="max-w-[560px]">
        <h2 className="text-[24px] font-bold leading-snug md:text-[28px]">
          {t.common.ctaTitle}
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-white/80">{t.common.ctaText}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          to="/consultation"
          className="inline-flex items-center justify-center gap-3 rounded-[5px] bg-accent px-6 py-3 text-[15px] font-bold text-navy transition-colors hover:bg-accent-hover"
        >
          {t.common.consult}
          <span aria-hidden="true">↗</span>
        </Link>
        <a
          href={PHONES.callHref}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-white/30 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Icon name="call" className="text-[18px]" />
          {PHONES.call}
        </a>
      </div>
    </div>
  );
}
