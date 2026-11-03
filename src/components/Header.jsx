import logoRu from "../assets/logos/master-kafel-ru.png";
import logoKo from "../assets/logos/master-tile-ko.png";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { PHONES } from "../data/images.js";
import Icon from "./Icon.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const links = [
  { to: "/", key: "home" },
  { to: "/services", key: "services" },
  { to: "/portfolio", key: "portfolio" },
  { to: "/consultation", key: "consultation" },
];

export default function Header() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "text-navy font-bold border-b-2 border-accent pb-1"
      : "text-[15px] font-semibold text-muted hover:text-navy transition-colors pb-1";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-page/90 backdrop-blur-xl border-b border-ice-border/60 shadow-[0_1px_8px_rgba(11,37,69,0.05)]">
      <div className="h-20 w-full max-w-[1600px] mx-auto px-5 sm:px-7 grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center text-navy shrink-0" aria-label={t.brand}>
          <img key={lang} src={lang === "ko" ? logoKo : logoRu} alt={t.brand} className="h-14 sm:h-16 w-auto max-w-[210px] sm:max-w-[260px] object-contain" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "inline"; }} />
          <span style={{display:"none"}} className="text-base sm:text-lg font-bold">{t.brand}</span>
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-10 whitespace-nowrap">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navClass}
              end={link.to === "/"}
            >
              {t.nav[link.key]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <LanguageSwitcher />
          <a
            className="hidden sm:inline-flex items-center justify-center px-3 py-2 bg-accent hover:bg-accent-hover text-navy font-bold text-[15px] rounded min-h-10 shadow-sm"
            href={PHONES.callHref}
          >
            <Icon name="call" className="mr-1 text-[18px]" />
            {t.nav.call}
          </a>
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded border border-ice-border bg-white text-navy"
            type="button"
            aria-expanded={open}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} className="text-[22px]" />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="lg:hidden border-t border-ice-border bg-page px-4 py-3 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navClass}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
            >
              {t.nav[link.key]}
            </NavLink>
          ))}
          <a
            className="inline-flex items-center justify-center px-3 py-2 bg-accent text-navy font-bold rounded"
            href={PHONES.callHref}
          >
            {t.nav.call}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
