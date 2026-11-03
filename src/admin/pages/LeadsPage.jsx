import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { listLeads } from "../../api/adminLeads.js";
import { useAsync } from "../../hooks/useAsync.js";
import { CATEGORY_LABELS } from "../projectForm.js";
import { LEAD_STATUSES, formatDateTime, statusInfo } from "../leadLabels.js";
import { btn, card } from "../ui.js";

export default function LeadsPage() {
  const [filter, setFilter] = useState("all");
  const loader = useCallback(() => listLeads(filter), [filter]);
  const { data, error, loading, reload } = useAsync(loader);

  const filters = [{ id: "all", label: "Все" }, ...LEAD_STATUSES];

  return (
    <div>
      <h1 className="text-[26px] font-bold">Заявки</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`rounded-full border px-4 py-1.5 text-[14px] font-semibold ${
              filter === item.id ? "border-navy bg-navy text-white" : "border-[#cbd6df] bg-white text-navy"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading && !data ? <p className="text-muted">Загрузка…</p> : null}
        {error ? (
          <div className={card}>
            <p className="font-semibold text-[#b42318]">Не удалось загрузить заявки.</p>
            <button type="button" onClick={reload} className={`${btn.secondary} mt-3`}>Повторить</button>
          </div>
        ) : null}
        {data && data.length === 0 ? (
          <div className={`${card} text-center`}>
            <p className="text-[17px] font-semibold">Заявок пока нет</p>
            <p className="mt-1 text-muted">Приём заявок с сайта подключим на следующем этапе.</p>
          </div>
        ) : null}
        {data?.map((lead) => {
          const status = statusInfo(lead.status);
          return (
            <Link
              key={lead.id}
              to={`/admin/leads/${lead.id}`}
              className={`${card} flex flex-col gap-1 hover:border-navy/40 sm:flex-row sm:items-center sm:gap-4`}
            >
              <span className={`w-fit rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${status.className}`}>
                {status.label}
              </span>
              <span className="text-[17px] font-bold">{lead.name}</span>
              <span className="text-[15px] text-navy">{lead.phone}</span>
              <span className="text-[14px] text-muted sm:ml-auto">
                {[CATEGORY_LABELS[lead.room_type], lead.district, formatDateTime(lead.created_at)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
