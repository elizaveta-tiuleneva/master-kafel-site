import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteLead, getLead, updateLead } from "../../api/adminLeads.js";
import { useAsync } from "../../hooks/useAsync.js";
import { CATEGORY_LABELS } from "../projectForm.js";
import { LEAD_STATUSES, formatDateTime } from "../leadLabels.js";
import { btn, card, field, label } from "../ui.js";

export default function LeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loader = useCallback(() => getLead(id), [id]);
  const { data: lead, error, loading, reload } = useAsync(loader);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (lead) setNote(lead.admin_note || "");
  }, [lead]);

  async function run(action, okText) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage({ type: "ok", text: okText });
      reload();
    } catch {
      setMessage({ type: "error", text: "Не получилось. Проверьте интернет и попробуйте ещё раз." });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Удалить заявку и её фото? Это нельзя отменить.")) return;
    setBusy(true);
    try {
      await deleteLead(lead);
      navigate("/admin/leads", { replace: true });
    } catch {
      setMessage({ type: "error", text: "Не удалось удалить заявку." });
      setBusy(false);
    }
  }

  if (loading && !lead) return <p className="text-muted">Загрузка…</p>;
  if (error || !lead) {
    return (
      <div className={card}>
        <p className="font-semibold">Заявка не найдена или не загрузилась.</p>
        <Link to="/admin/leads" className={`${btn.secondary} mt-4`}>← Все заявки</Link>
      </div>
    );
  }

  const rows = [
    ["Телефон", lead.phone],
    ["Район", lead.district],
    ["Тип помещения", CATEGORY_LABELS[lead.room_type]],
    ["Площадь", lead.area_m2 ? `${lead.area_m2} м²` : null],
    ["Язык сайта", lead.lang === "ko" ? "корейский" : "русский"],
    ["Получена", formatDateTime(lead.created_at)],
    ["Уведомление в Telegram", lead.notified_at ? "доставлено" : lead.notify_error ? "не доставлено" : "—"],
  ].filter(([, value]) => value);

  return (
    <div className="space-y-6">
      <Link to="/admin/leads" className="text-[15px] font-semibold text-muted hover:text-navy">← Все заявки</Link>

      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-[24px] font-bold">{lead.name}</h1>
          <a href={`tel:${lead.phone}`} className={btn.primary}>Позвонить</a>
        </div>
        <dl className="mt-4 divide-y divide-ice">
          {rows.map(([name, value]) => (
            <div key={name} className="flex justify-between gap-4 py-2.5 text-[15px]">
              <dt className="text-muted">{name}</dt>
              <dd className="text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        {lead.message ? (
          <div className="mt-4">
            <p className={label}>Описание работ</p>
            <p className="whitespace-pre-line rounded bg-ice-bg p-4 text-[15px] leading-7">{lead.message}</p>
          </div>
        ) : null}
      </section>

      {lead.lead_files.length ? (
        <section className={card}>
          <h2 className="text-[19px] font-bold">Фото от клиента · {lead.lead_files.length}</h2>
          <p className="mt-1 text-[13px] text-muted">Ссылки временные: если фото не открывается, обновите страницу.</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {lead.lead_files.map((file) => (
              <li key={file.id}>
                <a href={file.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded bg-ice" style={{ aspectRatio: "1" }}>
                  <img src={file.url} alt="" className="h-full w-full object-cover" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={card}>
        <h2 className="text-[19px] font-bold">Обработка</h2>
        <p className={`${label} mt-4`}>Статус</p>
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((status) => (
            <button
              key={status.id}
              type="button"
              disabled={busy}
              aria-pressed={lead.status === status.id}
              onClick={() => run(() => updateLead(lead.id, { status: status.id }), "Статус изменён.")}
              className={`rounded-[6px] border px-4 py-2 text-[15px] font-semibold ${
                lead.status === status.id ? "border-navy bg-navy text-white" : "border-[#cbd6df] bg-white text-navy"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
        <label htmlFor="lead-note" className={`${label} mt-5`}>Заметка (видна только администраторам)</label>
        <textarea id="lead-note" rows={3} value={note} maxLength={2000} onChange={(event) => setNote(event.target.value)} className={`${field} resize-y`} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => updateLead(lead.id, { admin_note: note.trim() || null }), "Заметка сохранена.")}
            className={btn.secondary}
          >
            Сохранить заметку
          </button>
          <button type="button" disabled={busy} onClick={remove} className={`${btn.danger} ml-auto`}>
            Удалить заявку
          </button>
        </div>
        {message ? (
          <p role="status" className={`mt-3 text-[15px] font-medium ${message.type === "error" ? "text-[#b42318]" : "text-[#1f7a3a]"}`}>
            {message.text}
          </p>
        ) : null}
      </section>
    </div>
  );
}
