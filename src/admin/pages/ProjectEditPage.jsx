import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProject, getProject, TEXT_FIELDS, updateProject } from "../../api/adminProjects.js";
import PhotoSection from "../components/PhotoSection.jsx";
import {
  CATEGORY_IDS,
  CATEGORY_LABELS,
  FIELD_HINTS,
  FIELD_LABELS,
  effectiveCover,
  emptyForm,
  formFromRow,
  rowFromForm,
  validateForm,
} from "../projectForm.js";
import { btn, card, field, label } from "../ui.js";
import { siteUrl } from "../../lib/siteUrl.js";

const MULTILINE = new Set(["summary", "task", "work", "result"]);

function TextFields({ lang, form, onChange }) {
  return (
    <div className="space-y-4">
      {TEXT_FIELDS.map((name) => {
        const key = `${name}_${lang}`;
        const id = `field-${key}`;
        const required = name === "title" || name === "district";
        return (
          <div key={key}>
            <label htmlFor={id} className={label}>
              {FIELD_LABELS[name]}
              {required ? <span className="text-[#b42318]"> *</span> : null}
            </label>
            {MULTILINE.has(name) ? (
              <textarea
                id={id}
                rows={name === "summary" ? 2 : 4}
                value={form[key]}
                onChange={(event) => onChange(key, event.target.value)}
                className={`${field} resize-y leading-6`}
              />
            ) : (
              <input
                id={id}
                type="text"
                value={form[key]}
                onChange={(event) => onChange(key, event.target.value)}
                className={field}
              />
            )}
            {FIELD_HINTS[name] ? <p className="mt-1 text-[13px] text-muted">{FIELD_HINTS[name]}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [row, setRow] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(() => JSON.stringify(emptyForm()));
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(
    async ({ resetForm }) => {
      try {
        const data = await getProject(id);
        if (!data) {
          setLoadError(true);
          return;
        }
        setRow(data);
        if (resetForm) {
          const next = formFromRow(data);
          setForm(next);
          setSaved(JSON.stringify(next));
        }
        setLoadError(false);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    if (!isNew) load({ resetForm: true });
  }, [isNew, load]);

  const dirty = JSON.stringify(form) !== saved;

  // Предупреждение при закрытии вкладки с несохранёнными изменениями.
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const photosByKind = useMemo(() => {
    const groups = { before: [], after: [], gallery: [] };
    (row?.project_photos || []).forEach((photo) => groups[photo.kind]?.push(photo));
    return groups;
  }, [row]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage(null);
  }

  async function save(nextStatus) {
    const status = nextStatus || row?.status || "draft";
    const problems = validateForm(form, { forPublish: status === "published" });
    if (problems.length) {
      setMessage({ type: "error", items: problems });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const fields = { ...rowFromForm(form), status };
      if (isNew) {
        const newId = await createProject(fields);
        setSaved(JSON.stringify(form));
        navigate(`/admin/projects/${newId}`, { replace: true });
        return;
      }
      await updateProject(id, fields);
      setSaved(JSON.stringify(form));
      await load({ resetForm: false });
      const texts = {
        published: row?.status === "published" ? "Изменения сохранены и уже видны на сайте." : "Проект опубликован.",
        draft: row?.status === "published" ? "Проект снят с публикации." : "Черновик сохранён.",
      };
      setMessage({ type: "ok", text: texts[status] });
    } catch {
      setMessage({ type: "error", items: ["Не удалось сохранить. Проверьте интернет и попробуйте ещё раз."] });
    } finally {
      setSaving(false);
    }
  }

  function leave(event) {
    if (dirty && !window.confirm("Есть несохранённые изменения. Уйти без сохранения?")) {
      event.preventDefault();
    }
  }

  if (loading) return <p className="text-muted">Загрузка…</p>;
  if (loadError) {
    return (
      <div className={card}>
        <p className="font-semibold">Проект не найден или не загрузился.</p>
        <Link to="/admin" className={`${btn.secondary} mt-4`}>← Все работы</Link>
      </div>
    );
  }

  const published = row?.status === "published";
  const coverId = row ? effectiveCover(row)?.id : null;

  return (
    <div className="pb-28">
      <Link to="/admin" onClick={leave} className="text-[15px] font-semibold text-muted hover:text-navy">
        ← Все работы
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-[26px] font-bold">{isNew ? "Новая работа" : form.title_ru || "Без названия"}</h1>
        {!isNew ? (
          <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${published ? "bg-[#e6f6ea] text-[#1f7a3a]" : "bg-ice text-muted"}`}>
            {published ? "● Опубликован" : "○ Черновик"}
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        <section className={card}>
          <h2 className="text-[19px] font-bold">Основное</h2>
          <p className={`${label} mt-4`}>Категория</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORY_IDS.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={form.category === category}
                onClick={() => update("category", category)}
                className={`rounded-[6px] border px-3 py-3 text-[15px] font-semibold ${
                  form.category === category ? "border-navy bg-navy text-white" : "border-[#cbd6df] bg-white text-navy hover:bg-ice-bg"
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="field-month" className={label}>Дата выполнения (месяц)</label>
              <input id="field-month" type="month" value={form.month} onChange={(event) => update("month", event.target.value)} className={field} />
              <p className="mt-1 text-[13px] text-muted">Необязательно</p>
            </div>
            <div>
              <label htmlFor="field-area" className={label}>Площадь, м²</label>
              <input id="field-area" type="text" inputMode="decimal" value={form.area} onChange={(event) => update("area", event.target.value)} className={field} placeholder="Например: 6,5" />
              <p className="mt-1 text-[13px] text-muted">Необязательно</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className={card}>
            <h2 className="text-[19px] font-bold">Тексты на русском</h2>
            <div className="mt-4">
              <TextFields lang="ru" form={form} onChange={update} />
            </div>
          </section>
          <section className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[19px] font-bold">Тексты на корейском</h2>
              <button type="button" disabled className={btn.small} title="Подключим на следующем этапе">
                Перевести с русского
              </button>
            </div>
            <p className="mt-1 text-[13px] text-muted">
              Автоматический перевод подключим на следующем этапе. Пока заполните вручную.
            </p>
            <div className="mt-4">
              <TextFields lang="ko" form={form} onChange={update} />
            </div>
          </section>
        </div>

        {isNew ? (
          <section className={`${card} text-center`}>
            <p className="text-[16px] font-semibold">Фотографии</p>
            <p className="mt-1 text-muted">Сохраните черновик — после этого можно будет добавить фото.</p>
          </section>
        ) : (
          <>
            <PhotoSection
              projectId={id}
              kind="before"
              title="Фото «До»"
              hint="Первое фото «До» сравнивается с первым «После», второе — со вторым. Снимайте с одной точки."
              photos={photosByKind.before}
              coverId={coverId}
              onChanged={() => load({ resetForm: false })}
            />
            <PhotoSection
              projectId={id}
              kind="after"
              title="Фото «После»"
              hint="Если «До» нет, на сайте будет обычное фото без сравнения."
              photos={photosByKind.after}
              coverId={coverId}
              onChanged={() => load({ resetForm: false })}
            />
            <PhotoSection
              projectId={id}
              kind="gallery"
              title="Дополнительные фото"
              hint="Процесс работы, детали, другие ракурсы."
              photos={photosByKind.gallery}
              coverId={coverId}
              onChanged={() => load({ resetForm: false })}
            />
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dbe4ec] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
          <div className="min-w-0 flex-1 text-[14px]" aria-live="polite">
            {message?.type === "error" ? (
              <ul className="font-medium text-[#b42318]">
                {message.items.map((text) => <li key={text}>{text}</li>)}
              </ul>
            ) : message ? (
              <span className="font-medium text-[#1f7a3a]">{message.text}</span>
            ) : dirty ? (
              <span className="text-muted">Есть несохранённые изменения</span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {published ? (
              <>
                <button type="button" disabled={saving} onClick={() => save("draft")} className={btn.secondary}>
                  Снять с публикации
                </button>
                <a href={siteUrl(`portfolio/${id}`)} target="_blank" rel="noreferrer" className={btn.secondary}>
                  На сайте ↗
                </a>
                <button type="button" disabled={saving} onClick={() => save("published")} className={btn.primary}>
                  {saving ? "Сохранение…" : "Сохранить"}
                </button>
              </>
            ) : (
              <>
                <button type="button" disabled={saving} onClick={() => save("draft")} className={btn.secondary}>
                  {saving ? "Сохранение…" : "Сохранить черновик"}
                </button>
                {!isNew ? (
                  <a
                    href={siteUrl(`portfolio/${id}`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (dirty && !window.confirm("Предпросмотр покажет последнюю сохранённую версию. Открыть?")) {
                        event.preventDefault();
                      }
                    }}
                    className={btn.secondary}
                  >
                    Предпросмотр ↗
                  </a>
                ) : null}
                <button type="button" disabled={saving} onClick={() => save("published")} className={btn.primary}>
                  Опубликовать
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
