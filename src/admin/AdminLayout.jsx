import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./authContext.js";
import { siteUrl } from "../lib/siteUrl.js";

const navClass = ({ isActive }) =>
  `rounded-[5px] px-3 py-2 text-[15px] font-semibold ${
    isActive ? "bg-navy text-white" : "text-navy hover:bg-ice"
  }`;

export default function AdminLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-page text-navy">
      <header className="border-b border-[#dbe4ec] bg-white">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <span className="mr-auto text-[16px] font-bold">
            MASTER КАФЕЛЬ <span className="font-normal text-muted">· админ-панель</span>
          </span>
          <nav className="flex items-center gap-1">
            <NavLink to="/admin" end className={navClass}>
              Работы
            </NavLink>
            <NavLink to="/admin/leads" className={navClass}>
              Заявки
            </NavLink>
            <a href={siteUrl()} target="_blank" rel="noreferrer" className="px-3 py-2 text-[15px] font-semibold text-muted hover:text-navy">
              Сайт ↗
            </a>
          </nav>
          <div className="flex items-center gap-3 text-[14px] text-muted">
            <span className="hidden max-w-[220px] truncate sm:inline">{user?.email}</span>
            <button type="button" onClick={signOut} className="font-semibold text-navy underline underline-offset-2">
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
