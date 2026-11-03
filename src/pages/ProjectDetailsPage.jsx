import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { fetchProject, fetchPublishedProjects } from "../api/projects.js";
import { useAsync } from "../hooks/useAsync.js";
import {
  getCover,
  getPairs,
  getSimilarProjects,
  localizeProject,
} from "../lib/projectModel.js";
import { ErrorState } from "../components/ui/LoadStates.jsx";
import { PHONES } from "../data/images.js";
import { formatArea, formatProjectDate } from "../lib/format.js";
import BeforeAfterSlider from "../components/BeforeAfterSlider.jsx";
import Lightbox from "../components/Lightbox.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import Icon from "../components/Icon.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import CtaBanner from "../components/ui/CtaBanner.jsx";

function NotFound() {
  const { t } = useLanguage();
  return (
    <PageContainer className="py-20 text-center">
      <h1 className="text-[28px] font-bold text-navy">{t.project.notFound}</h1>
      <p className="mt-3 text-muted">{t.project.notFoundText}</p>
      <Link
        to="/portfolio"
        className="mt-6 inline-flex rounded-[5px] bg-accent px-6 py-3 font-bold text-navy hover:bg-accent-hover"
      >
        {t.project.back}
      </Link>
    </PageContainer>
  );
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const loader = useCallback(
    () => Promise.all([fetchProject(id), fetchPublishedProjects()]),
    [id],
  );
  const { data, error, loading, reload } = useAsync(loader);

  // Новая страница проекта открывается с начала, в том числе из «Похожих работ».
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <PageContainer className="py-20 text-center text-muted" aria-busy="true">
        {t.common.loading}
      </PageContainer>
    );
  }
  if (error) {
    return (
      <PageContainer className="py-16">
        <ErrorState onRetry={reload} />
      </PageContainer>
    );
  }

  const [project, all] = data;
  if (!project) return <NotFound />;
  return <ProjectDetails key={project.id} project={project} all={all} />;
}

function ProjectDetails({ project, all }) {
  const { lang, t } = useLanguage();
  const item = localizeProject(project, lang);
  const pairs = getPairs(project);
  const [pairIndex, setPairIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const date = formatProjectDate(project.completedAt, lang);
  const area = formatArea(project.areaM2, t.common.areaUnit, lang);
  const categoryLabel = t.categories[project.category];
  const similar = getSimilarProjects(project, all);

  // Все фото для просмотра: результат, дополнительные, затем «до».
  const photos = useMemo(() => {
    const { before, after, gallery } = project.photos;
    return [
      ...after.map((photo) => ({ ...photo, caption: t.common.after })),
      ...gallery.map((photo) => ({ ...photo, caption: "" })),
      ...before.map((photo) => ({ ...photo, caption: t.common.before })),
    ];
  }, [project, t]);

  const cover = getCover(project);
  const facts = [
    { label: t.project.district, value: item.district },
    { label: t.project.category, value: categoryLabel },
    { label: t.project.date, value: date },
    { label: t.project.area, value: area },
  ].filter((fact) => fact.value);

  return (
    <div className="pb-14 md:pb-20">
      <PageContainer className="pt-8 md:pt-10">
        <nav aria-label="breadcrumb" className="text-[13px] text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-navy">{t.common.home}</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to="/portfolio" className="hover:text-navy">{t.portfolio.title}</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to={`/portfolio?category=${project.category}`} className="hover:text-navy">
                {categoryLabel}
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mt-5 max-w-[860px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-ice-border bg-white px-2.5 py-1 text-[12px] font-semibold text-navy">
              {categoryLabel}
            </span>
            {project.isDemo ? (
              <span className="rounded bg-accent px-2.5 py-1 text-[12px] font-bold text-navy">
                {t.common.demoBadge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-navy md:text-[38px]">
            {item.title}
          </h1>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-muted">
            {[item.district, date, area].filter(Boolean).map((value) => (
              <span key={value}>{value}</span>
            ))}
          </p>
          {item.summary ? (
            <p className="mt-4 max-w-[720px] text-[17px] leading-8 text-[#334d68]">{item.summary}</p>
          ) : null}
          {project.status === "draft" ? (
            <p role="status" className="mt-4 rounded border border-navy/30 bg-ice px-4 py-2.5 text-[14px] font-semibold text-navy">
              {t.project.draftBanner}
            </p>
          ) : null}
          {project.isDemo ? (
            <p className="mt-4 rounded border border-accent/50 bg-[#fff7e6] px-4 py-2.5 text-[13px] text-navy">
              {t.project.demoNote}
            </p>
          ) : null}
        </header>
      </PageContainer>

      <PageContainer className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div className="min-w-0">
          {pairs.length > 0 ? (
            <section>
              <BeforeAfterSlider
                key={pairIndex}
                before={pairs[pairIndex].before}
                after={pairs[pairIndex].after}
                priority
                className="rounded-lg"
              />
              {pairs.length > 1 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pairs.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-pressed={index === pairIndex}
                      onClick={() => setPairIndex(index)}
                      className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold ${
                        index === pairIndex
                          ? "border-navy bg-navy text-white"
                          : "border-ice-border bg-white text-muted hover:text-navy"
                      }`}
                    >
                      {t.project.pair} {index + 1}
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          ) : cover ? (
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={t.project.openPhoto}
              className="block w-full overflow-hidden rounded-lg bg-ice-bg"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img src={cover.src} alt="" className="h-full w-full object-cover" />
            </button>
          ) : null}

          {item.task ? (
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-navy">{t.project.task}</h2>
              <p className="mt-3 max-w-[720px] whitespace-pre-line text-[16px] leading-8 text-[#334d68]">
                {item.task}
              </p>
            </section>
          ) : null}

          {item.work?.length ? (
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-navy">{t.project.features}</h2>
              <ol className="mt-4 space-y-3">
                {item.work.map((feature, index) => (
                  <li key={feature} className="flex items-start gap-3 text-[16px] leading-7 text-[#334d68]">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ice text-[13px] font-bold text-navy">
                      {index + 1}
                    </span>
                    {feature}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {item.result ? (
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-navy">{t.project.result}</h2>
              <p className="mt-3 max-w-[720px] whitespace-pre-line text-[16px] leading-8 text-[#334d68]">
                {item.result}
              </p>
            </section>
          ) : null}

          {photos.length > 1 ? (
            <section className="mt-10">
              <h2 className="text-[22px] font-bold text-navy">
                {t.project.gallery}
                <span className="ml-2 text-[16px] font-semibold text-muted">{photos.length}</span>
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo, index) => (
                  <button
                    key={`${photo.src}-${index}`}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`${t.project.openPhoto} ${index + 1}`}
                    className="group relative overflow-hidden rounded-md bg-ice-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <img
                      src={photo.thumb}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {photo.caption ? (
                      <span className="absolute left-2 top-2 rounded bg-navy/85 px-2 py-0.5 text-[11px] font-semibold text-white">
                        {photo.caption}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-ice-border/80 bg-white p-6">
            {facts.length ? (
              <dl className="divide-y divide-ice">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex justify-between gap-4 py-3 text-[15px] first:pt-0">
                    <dt className="text-muted">{fact.label}</dt>
                    <dd className="text-right font-semibold text-navy">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="mt-5 border-t border-ice pt-5">
              <p className="text-[16px] font-bold text-navy">{t.project.asideTitle}</p>
              <p className="mt-1 text-[14px] leading-6 text-muted">{t.project.asideText}</p>
              <Link
                to="/consultation"
                className="mt-4 flex items-center justify-center gap-2 rounded-[5px] bg-accent px-5 py-3 text-[15px] font-bold text-navy transition-colors hover:bg-accent-hover"
              >
                {t.common.consult}
                <span aria-hidden="true">↗</span>
              </Link>
              <a
                href={PHONES.callHref}
                className="mt-2 flex items-center justify-center gap-2 rounded-[5px] border border-ice-border px-5 py-3 text-[15px] font-semibold text-navy hover:bg-ice-bg"
              >
                <Icon name="call" className="text-[18px]" />
                {PHONES.call}
              </a>
            </div>
          </div>
          <Link
            to="/portfolio"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-navy"
          >
            <span aria-hidden="true">←</span>
            {t.project.back}
          </Link>
        </aside>
      </PageContainer>

      {similar.length ? (
        <PageContainer as="section" className="mt-16 md:mt-20">
          <h2 className="text-[24px] font-bold text-navy md:text-[28px]">{t.project.similar}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((other) => (
              <ProjectCard key={other.id} project={other} compact />
            ))}
          </div>
        </PageContainer>
      ) : null}

      <PageContainer className="mt-14 md:mt-20">
        <CtaBanner />
      </PageContainer>

      {lightboxIndex !== null ? (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}
