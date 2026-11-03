import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteProject, listProjects, updateProject } from "../../api/adminProjects.js";
import { useAsync } from "../../hooks/useAsync.js";
import { photoUrl } from "../../lib/supabase.js";
import { formatProjectDate } from "../../lib/format.js";
import { CATEGORY_LABELS, canPublish, effectiveCover } from "../projectForm.js";
import { btn, card } from "../ui.js";

function StatusBadge({ status }) {
  return status === "published" ? (
    <span className="rounded-full bg-[#e6f6ea] px-2.5 py-0.5 text-[13px] font-semibold text-[#1f7a3a]">
      ● Опубликован
    </span>
  ) : (
    <span className="rounded-full bg-ice px-2.5 py-0.5 text-[13px] font-semibold text-muted">
      ○ Черновик
    </span>
  );
}

export default function ProjectsPage() {
  const { data, error, loading, reload } = useAsync(listProjects);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);

  async function run(id, action, okText) {
    setBusyId(id);
    setMessage(null);
    try {
      await action();
      setMessage({ type: "ok", text: okText });
      reload();
    } catch {
      setMessage({ type: "error", text: "Не получилось. Проверьте интернет и попробуйте ещё раз." });
    } finally {
      setBusyId(null);
    }
  }

  function togglePublish(project) {
    if (project.status === "draft" && !canPublish(project)) {
      setMessage({
        type: "error",
        text: "Чтобы опубликовать, заполните название и район на русском и корейском. Нажмите «Изменить».",
      });
      return;
    }
    const next = project.status === "published" ? "draft" : "published";
    run(
      project.id,
      () => updateProject(project.id, { status: next }),
      next === "published" ? "Проект опубликован." : "Проект снят с публикации.",
    );
  }

  function remove(project) {
    const name = project.title_ru || "без названия";
    if (!window.confirm(`Удалить проект «${name}» и все его фотографии? Это нельзя отменить.`)) return;
    run(project.id, () => deleteProject(project), "Проект удалён.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[26px] font-bold">Наши работы</h1>
        <Link to="/admin/projects/new" className={btn.primary}>
          + Добавить работу
        </Link>
      </div>

      {message ? (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`mt-4 rounded px-4 py-3 text-[15px] font-medium ${
            message.type === "error" ? "bg-[#fff7f6] text-[#b42318]" : "bg-[#effaf2] text-[#1f7a3a]"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {loading && !data ? <p className="text-muted">Загрузка…</p> : null}
        {error ? (
          <div className={card}>
            <p className="font-semibold text-[#b42318]">Не удалось загрузить список.</p>
            <button type="button" onClick={reload} className={`${btn.secondary} mt-3`}>Повторить</button>
          </div>
        ) : null}
        {data && data.length === 0 ? (
          <div className={`${card} text-center`}>
            <p className="text-[17px] font-semibold">Пока нет ни одной работы</p>
            <p className="mt-1 text-muted">Нажмите «Добавить работу», чтобы создать первую.</p>
          </div>
        ) : null}

        {data?.map((project) => {
          const cover = effectiveCover(project);
          const date = formatProjectDate(project.completed_on, "ru");
          const busy = busyId === project.id;
          return (
            <article key={project.id} className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center`}>
              <Link
                to={`/admin/projects/${project.id}`}
                className="block h-24 w-full shrink-0 overflow-hidden rounded bg-ice sm:w-32"
              >
                {cover ? (
                  <img src={photoUrl(cover.thumb_path || cover.storage_path)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[13px] text-muted">Нет фото</span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={project.status} />
                  <span className="text-[14px] text-muted">
                    {[CATEGORY_LABELS[project.category], project.district_ru, date].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <h2 className="mt-1.5 truncate text-[18px] font-bold">
                  {project.title_ru || <span className="text-muted">Без названия</span>}
                </h2>
                <p className="text-[13px] text-muted">
                  Фото: {project.project_photos.length}
                  {project.title_ru && !project.title_ko ? " · нет перевода на корейский" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/projects/${project.id}`} className={btn.secondary}>
                  Изменить
                </Link>
                <button type="button" disabled={busy} onClick={() => togglePublish(project)} className={btn.secondary}>
                  {project.status === "published" ? "Снять с публикации" : "Опубликовать"}
                </button>
                <button type="button" disabled={busy} onClick={() => remove(project)} className={btn.danger}>
                  Удалить
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
