import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { fetchPublishedProjects } from "../api/projects.js";
import { useAsync } from "../hooks/useAsync.js";
import { isCategory } from "../data/categories.js";
import ProjectCard from "../components/ProjectCard.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import PageHeading from "../components/ui/PageHeading.jsx";
import CategoryFilter from "../components/ui/CategoryFilter.jsx";
import CtaBanner from "../components/ui/CtaBanner.jsx";
import { CardSkeletons, ErrorState } from "../components/ui/LoadStates.jsx";

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("category");
  const filter = isCategory(requested) ? requested : "all";
  const { data: projects, error, loading, reload } = useAsync(fetchPublishedProjects);
  const all = useMemo(() => projects || [], [projects]);
  const hasDemo = all.some((project) => project.isDemo);

  const items = useMemo(
    () => (filter === "all" ? all : all.filter((project) => project.category === filter)),
    [all, filter],
  );

  function changeFilter(id) {
    setSearchParams(id === "all" ? {} : { category: id }, { replace: true });
  }

  let content;
  if (loading) {
    content = <CardSkeletons />;
  } else if (error) {
    content = <ErrorState onRetry={reload} />;
  } else if (items.length === 0) {
    content = (
      <div className="rounded-lg border border-dashed border-ice-border bg-white/60 px-6 py-16 text-center">
        <p className="text-[17px] font-semibold text-navy">
          {all.length === 0 ? t.portfolio.emptyAll : t.portfolio.empty}
        </p>
        {all.length > 0 ? (
          <button
            type="button"
            onClick={() => changeFilter("all")}
            className="mt-4 text-[15px] font-semibold text-navy underline decoration-accent decoration-2 underline-offset-4"
          >
            {t.portfolio.showAll}
          </button>
        ) : null}
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {items.map((project, index) => (
          <ProjectCard key={project.id} project={project} priority={index < 2} />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-14 md:pb-20">
      <PageContainer className="pt-10 md:pt-14">
        <PageHeading align="center" title={t.portfolio.title} lead={t.portfolio.lead} />
        <p className="mx-auto mt-2 max-w-[680px] text-center text-[14px] text-muted">
          {t.portfolio.sliderHint}
        </p>

        {hasDemo ? (
          <p className="mx-auto mt-6 max-w-[760px] rounded border border-accent/50 bg-[#fff7e6] px-4 py-2.5 text-center text-[13px] leading-5 text-navy">
            {t.portfolio.demoBanner}
          </p>
        ) : null}

        <div className="mt-8">
          <CategoryFilter value={filter} onChange={changeFilter} />
        </div>
      </PageContainer>

      <PageContainer className="mt-8 md:mt-10">{content}</PageContainer>

      <PageContainer className="mt-14 md:mt-20">
        <CtaBanner />
      </PageContainer>
    </div>
  );
}
