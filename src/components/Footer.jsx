
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Footer() {
  const { lang } = useLanguage();
  const isKo = lang === "ko";

  const navigation = [
    { label: isKo ? "홈" : "Главная", to: "/" },
    { label: isKo ? "시공 안내" : "Услуги", to: "/services" },
    { label: isKo ? "시공사례" : "Примеры работ", to: "/portfolio" },
    {
      label: isKo ? "견적문의" : "Расчёт стоимости",
      to: "/consultation",
    },
  ];

  return (
    <footer className="border-t border-[#cbd6df] bg-[#e2e9f0] text-[#0b2545]">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-7">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1fr_1fr] md:gap-8">
          {/* Компания */}
          <div className="min-w-0">
            <h3 className="mb-4 text-[18px] font-bold leading-6">
              {isKo ? "마스터 타일" : "MASTER КАФЕЛЬ"}
            </h3>

            <p className="max-w-[380px] text-[14px] leading-7 text-[#536b84]">
              {isKo
                ? "대전 및 인근 지역에서 타일 시공과 실내 마감 공사를 진행합니다. 욕실, 주방, 바닥 등 다양한 공간의 시공을 전문으로 하며, 2025년부터 활동하고 있습니다."
                : "Укладка плитки и отделочные работы в Тэджоне и регионе. Ванные комнаты, кухни, полы и другие помещения. Работаем с 2025 года."}
            </p>
          </div>

          {/* Навигация */}
          <div className="min-w-0 md:justify-self-center">
            <h3 className="mb-4 text-[16px] font-bold leading-6">
              {isKo ? "바로가기" : "Навигация"}
            </h3>

            <nav className="flex flex-col items-start gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-[14px] font-medium text-[#536b84] transition-colors hover:text-[#0b2545]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Контакты */}
          <div className="min-w-0 md:justify-self-end">
            <h3 className="mb-4 text-[16px] font-bold leading-6">
              {isKo ? "문의하기" : "Контакты"}
            </h3>

            <a
              href="tel:01038427914"
              className="block text-[20px] font-bold tracking-tight hover:text-[#d48a00]"
            >
              010-3842-7914
            </a>

            <p className="mt-2 text-[14px] leading-6 text-[#536b84]">
              {isKo ? (
                <>
                  대전 및 인근 지역 상담
                  <br />
                  방문 가능
                </>
              ) : (
                <>
                  Консультации и выезд по Тэджону
                  <br />
                  и близлежащим районам
                </>
              )}
            </p>

            <Link
              to="/consultation"
              className="mt-5 inline-flex items-center gap-3 rounded-[5px] bg-[#f59e0b] px-5 py-3 text-[14px] font-bold text-[#0b2545] transition-colors hover:bg-[#e89a08]"
            >
              {isKo ? "견적 문의하기" : "Получить консультацию"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#cbd6df] pt-5 text-[13px] text-[#536b84] md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {isKo ? "마스터 타일" : "MASTER КАФЕЛЬ"}.
            {isKo ? " All rights reserved." : " Все права защищены."}
          </p>

          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="hover:text-[#0b2545]">
              {isKo ? "개인정보처리방침" : "Политика конфиденциальности"}
            </Link>

            <Link to="/consultation" className="hover:text-[#0b2545]">
              {isKo ? "문의하기" : "Контакты"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
