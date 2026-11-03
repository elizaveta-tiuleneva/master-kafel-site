import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getCover, getPairs, localizeProject } from "../lib/projectModel.js";
import { formatProjectDate } from "../lib/format.js";
import BeforeAfterSlider from "./BeforeAfterSlider.jsx";

function DemoBadge({ className = "" }) {
  const { t } = useLanguage();
  return (
    <span
      className={`pointer-events-none absolute rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-navy ${className}`}
    >
      {t.common.demoBadge}
    </span>
  );
}

/**
 * Карточка проекта. Ссылкой являются только фото без сравнения, название
 * и «Подробнее» — иначе перетаскивание ползунка открывало бы страницу.
 */
export default function ProjectCard({ project, compact = false, priority = false }) {
  const { lang, t } = useLanguage();
  const item = localizeProject(project, lang);
  const href = `/portfolio/${project.id}`;
  const pair = compact ? null : getPairs(project)[0];
  const cover = getCover(project);
  const date = formatProjectDate(project.completedAt, lang);
  const meta = [t.categories[project.category], item.district].filter(Boolean).join(" · ");

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-ice-border/70 bg-white shadow-[0_1px_3px_rgba(11,37,69,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(11,37,69,0.10)]">
      <div className="relative">
        {pair ? (
          <BeforeAfterSlider before={pair.before} after={pair.after} priority={priority} />
        ) : (
          <Link to={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden bg-ice-bg" style={{ aspectRatio: "4 / 3" }}>
            {cover ? (
              <img
                src={compact ? cover.thumb : cover.src}
                alt=""
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : null}
          </Link>
        )}
        {project.isDemo ? <DemoBadge className="bottom-3 left-3" /> : null}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5 md:p-6"}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[13px] text-muted">
          <span>{meta}</span>
          {date && !compact ? <span className="tabular-nums">{date}</span> : null}
        </div>
        <h3
          className={`mt-2 font-bold leading-snug text-navy ${compact ? "text-[16px]" : "text-[19px] md:text-[21px]"}`}
        >
          <Link to={href} className="hover:underline decoration-accent decoration-2 underline-offset-4">
            {item.title}
          </Link>
        </h3>
        {!compact && item.summary ? (
          <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-muted">{item.summary}</p>
        ) : null}
        {!compact ? (
          <div className="mt-auto pt-4">
            <Link
              to={href}
              className="inline-flex items-center gap-1.5 border-b-2 border-accent pb-0.5 text-[14px] font-bold text-navy transition-colors hover:text-accent-hover"
            >
              {t.portfolio.more}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
