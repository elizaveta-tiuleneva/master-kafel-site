import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

import heroImage from "../assets/img/hero/hero.png";

import bathroomImage from "../assets/img/services/bathroom.png";
import kitchenImage from "../assets/img/services/kitchen.png";
import verandaImage from "../assets/img/services/veranda.png";
import interiorImage from "../assets/img/services/interior-finishing.png";

import logoRu from "../assets/logos/master-kafel-ru.png";
import logoKo from "../assets/logos/master-tile-ko.png";

const services = [
  {
    id: "bathroom",
    image: bathroomImage,
    ru: "Ванные комнаты",
    ko: "욕실",
  },
  {
    id: "kitchen",
    image: kitchenImage,
    ru: "Кухни",
    ko: "주방",
  },
  {
    id: "veranda",
    image: verandaImage,
    ru: "Веранды",
    ko: "베란다",
  },
  {
    id: "interior",
    image: interiorImage,
    ru: "Отделка помещений",
    ko: "실내",
  },
];

const copy = {
  ru: {
    title: "Укладка плитки и ремонт",
    intro:
      "Плиточные работы в ванных комнатах, кухнях и других помещениях. Обсудим ваш проект и подберём подходящее решение.",
    cta: "Получить консультацию",
    services: "Наши работы",
    servicesLead:
      "Выберите направление, чтобы посмотреть примеры оформления и ремонта.",
    about: "О компании",
    aboutHeading: "Ремонт, в котором важна каждая деталь.",
    aboutParagraphs: [
      "MASTER КАФЕЛЬ — небольшая команда мастеров, которая с 2025 года занимается укладкой плитки и отделочными работами в Южной Корее.",
      "Мы внимательно относимся к пожеланиям заказчиков, обсуждаем детали ремонта и подбираем решения с учётом особенностей каждого помещения.",
      "Ванные комнаты, кухни, веранды и другие помещения — мы хотим, чтобы обновлённое пространство было удобным и радовало вас каждый день.",
    ],
  },
  ko: {
    title: "타일 시공 및 리모델링",
    intro:
      "욕실, 주방 및 다양한 공간의 타일 시공. 현장에 맞는 시공 방법을 함께 상담해 드립니다.",
    cta: "무료 상담 문의",
    services: "시공 분야",
    servicesLead: "관심 있는 분야를 선택해 시공 예시를 확인해 보세요.",
    about: "회사 소개",
    aboutHeading: "작은 디테일까지 소중하게 생각합니다.",
    aboutParagraphs: [
      "마스터 타일은 2025년부터 한국에서 타일 시공과 실내 마감 공사를 진행해 온 소규모 시공팀입니다.",
      "고객님의 의견에 귀 기울이고, 공간의 특성과 현장 상황을 고려해 적합한 시공 방법을 함께 고민합니다.",
      "욕실과 주방, 베란다 등 다양한 공간에서 일상에 편안함을 더하는 시공을 지향합니다.",
    ],
  },
};

function HeroSection({ lang, c }) {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "20px 24px 48px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="h-[420px] sm:h-[500px] lg:h-[580px]"
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          borderRadius: "6px",
          backgroundColor: "#46515c",
        }}
      >
        <img
          src={heroImage}
          alt={
            lang === "ko" ? "타일 시공 참고 이미지" : "Пример плиточной отделки"
          }
          fetchPriority="high"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,20,30,0.78) 0%, rgba(10,20,30,0.4) 50%, rgba(10,20,30,0.05) 100%)",
          }}
        />

        <div
          className="px-6 sm:px-12 lg:px-20"
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "700px", color: "#ffffff" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                marginBottom: "20px",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {lang === "ko" ? "마스터 타일" : "MASTER КАФЕЛЬ"}
            </p>

            <h1
              className={
                lang === "ko"
                  ? "text-[38px] sm:text-[56px] lg:text-[72px]"
                  : "text-[36px] sm:text-[52px] lg:text-[68px]"
              }
              style={{
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: lang === "ko" ? "-0.045em" : "-0.035em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {c.title}
            </h1>

            <p
              className={
                lang === "ko"
                  ? "text-[17px] sm:text-[19px]"
                  : "text-base sm:text-lg"
              }
              style={{
                maxWidth: "520px",
                lineHeight: 1.8,
                marginTop: "24px",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {c.intro}
            </p>

            <Link
              to="/consultation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                marginTop: "32px",
                padding: "15px 28px",
                backgroundColor: "#f59e0b",
                color: "#0b2545",
                borderRadius: "5px",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {c.cta}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ lang, c }) {
  return (
    <section className="bg-[#e7edf2] py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-6">
        <div className="mb-8 md:mb-11">
          <h2 className="text-3xl font-bold tracking-tight text-[#0b2545] md:text-[40px]">
            {c.services}
          </h2>

          <p className="mt-3 text-[#526780]">{c.servicesLead}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/portfolio?category=${service.id}`}
              className="group relative aspect-[3/4.3] overflow-hidden rounded-[9px] bg-slate-300"
            >
              <img
                src={service.image}
                alt={service[lang] || service.ru}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

              <span className="absolute bottom-5 left-4 right-3 text-lg font-semibold text-white md:bottom-7 md:left-6 md:text-2xl">
                {service[lang] || service.ru}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



function AboutSection({ lang }) {
  const isKo = lang === "ko";

  const content = isKo
    ? {
        label: "MASTER TILE",
        heading: "회사 소개",
        since: "2025년부터",
        sinceText: "한국에서 타일 시공 및 실내 마감 작업",
        title: "작은 디테일까지 소중하게 생각합니다.",
        description:
          "마스터 타일은 2025년부터 한국에서 타일 시공과 실내 마감 작업을 진행해 온 소규모 시공팀입니다. 고객님의 의견에 귀 기울이고, 공간의 특성과 현장 상황을 고려하여 적합한 시공 방법을 함께 고민합니다.",
        benefits: [
          "고객의 요구에 맞춘 상담",
          "작은 부분까지 세심한 시공",
          "욕실 · 주방 · 베란다 · 실내 공간",
        ],
      }
    : {
        label: "MASTER КАФЕЛЬ",
        heading: "О компании",
        since: "С 2025 года",
        sinceText: "Плиточные и отделочные работы в Южной Корее",
        title: "Ремонт, в котором важна каждая деталь.",
        description:
          "MASTER КАФЕЛЬ — небольшая команда мастеров, которая с 2025 года занимается укладкой плитки и отделочными работами в Южной Корее. Мы прислушиваемся к пожеланиям заказчиков, учитываем особенности помещений и вместе подбираем подходящие решения.",
        benefits: [
          "Индивидуальный подход к каждому заказу",
          "Внимание к деталям и аккуратная работа",
          "Ванные комнаты, кухни, веранды и другие помещения",
        ],
      };

  const logo = isKo ? logoKo : logoRu;

  return (
    <section className="bg-[#eef2f5] py-12 md:py-14">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-16 lg:px-8">

        {/* Левая часть */}
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt={content.label}
            loading="lazy"
            className="mb-5 h-auto w-[175px] object-contain sm:w-[205px]"
          />

          <p className="mb-2 text-[13px] font-semibold tracking-[0.2em] text-[#58708a]">
            {content.label}
          </p>

          <h2 className="text-[34px] font-bold leading-tight text-[#0b2545] md:text-[40px]">
            {content.heading}
          </h2>

          <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-[#f59e0b]" />

          <div className="mt-7 text-center">
            <p className="text-[25px] font-bold text-[#0b2545]">
              {content.since}
            </p>

            <p className="mt-2 max-w-[320px] text-[16px] leading-7 text-[#61758a]">
              {content.sinceText}
            </p>
          </div>
        </div>

        {/* Правая часть */}
        <div>
          <h3 className="mb-5 text-[27px] font-bold leading-snug text-[#0b2545] md:text-[32px]">
            {content.title}
          </h3>

          <p className="max-w-[690px] text-[18px] leading-[1.8] text-[#526a83]">
            {content.description}
          </p>

          <div className="my-7 h-px w-full bg-[#cdd9e3]" />

          <div className="space-y-4">
            {content.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3"
              >
                <span className="mt-[4px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e0eaf2] text-[#0b2545]">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </span>

                <span className="text-[17px] leading-7 text-[#334d68]">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



// function AboutSection({ lang, c }) {
//   const isKo = lang === "ko";

//   return (
//     <section className="bg-[#eef2f5] py-12 md:py-16">
//       <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 md:grid-cols-[0.85fr_1.15fr] md:gap-16 lg:px-10">
//         <div className="flex flex-col items-start">
//           <img
//             src={isKo ? logoKo : logoRu}
//             alt={isKo ? "마스터 타일" : "MASTER КАФЕЛЬ"}
//             className="mb-6 h-32 w-auto max-w-full object-contain object-left md:h-40"
//           />

//           <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#59708a]">
//             {isKo ? "MASTER TILE" : "MASTER КАФЕЛЬ"}
//           </p>

//           <h2 className="text-3xl font-bold tracking-tight text-[#0b2545] md:text-4xl">
//             {c.about}
//           </h2>

//           <div className="mt-5 h-[3px] w-14 rounded-full bg-[#f59e0b]" />
//         </div>

//         <div className="max-w-[650px]">
//           <h3 className="mb-5 text-xl font-semibold leading-snug text-[#0b2545] md:text-2xl">
//             {c.aboutHeading}
//           </h3>

//           <div className="space-y-4 text-[15px] leading-[1.9] text-[#526780] md:text-base">
//             {c.aboutParagraphs.map((paragraph, index) => (
//               <p key={index}>{paragraph}</p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function HomePage() {
  const { lang } = useLanguage();
  const currentLang = lang === "ko" ? "ko" : "ru";
  const c = copy[currentLang];

  return (
    <main className="w-full bg-page text-navy">
      <HeroSection lang={currentLang} c={c} />
      <ServicesSection lang={currentLang} c={c} />
      <AboutSection lang={currentLang} c={c} />
    </main>
  );
}
