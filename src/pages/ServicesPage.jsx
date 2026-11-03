import { useLanguage } from "../i18n/LanguageContext.jsx";
import { CATEGORIES } from "../data/categories.js";
import ServiceCard from "../components/ServiceCard.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import PageHeading from "../components/ui/PageHeading.jsx";
import CtaBanner from "../components/ui/CtaBanner.jsx";

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <div className="pb-14 md:pb-20">
      <PageContainer className="pt-10 md:pt-14">
        <PageHeading title={t.services.title} lead={t.services.lead} />
      </PageContainer>

      <PageContainer className="mt-10 md:mt-14">
        <div className="divide-y divide-[#d5dfe7]">
          {CATEGORIES.map((category, index) => {
            const copy = t.services.items[category.id];
            return (
              <div key={category.id} className="py-10 first:pt-0 md:py-14">
                <ServiceCard
                  number={String(index + 1).padStart(2, "0")}
                  title={t.categories[category.id]}
                  text={copy.text}
                  points={copy.points}
                  image={category.image}
                  to={`/portfolio?category=${category.id}`}
                  linkLabel={t.services.viewWorks}
                  reversed={index % 2 === 1}
                />
              </div>
            );
          })}
        </div>
      </PageContainer>

      <section className="bg-[#e7edf2] py-12 md:py-16">
        <PageContainer>
          <h2 className="text-[28px] font-bold text-navy md:text-[34px]">
            {t.services.processTitle}
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {t.services.steps.map((step, index) => (
              <li
                key={step.title}
                className={`border-t-[3px] pt-4 ${index === 0 ? "border-accent" : "border-[#cbd6df]"}`}
              >
                <span className="text-[30px] font-bold leading-none text-navy">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[17px] font-bold leading-snug text-navy">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <PageContainer className="mt-14 md:mt-20">
        <CtaBanner />
      </PageContainer>
    </div>
  );
}
