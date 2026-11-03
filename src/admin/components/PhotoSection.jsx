import { useRef, useState } from "react";
import { deletePhoto, setCoverPhoto, swapPhotoPositions, uploadPhoto } from "../../api/adminProjects.js";
import { ImageResizeError } from "../../lib/imageResize.js";
import { photoUrl } from "../../lib/supabase.js";
import { btn, card } from "../ui.js";

function uploadErrorText(error, name) {
  if (error instanceof ImageResizeError) {
    if (error.code === "tooBig") return `«${name}»: файл больше 20 МБ.`;
    if (error.code === "notImage") return `«${name}»: это не фотография.`;
    if (error.code === "unsupported") {
      return `«${name}»: этот формат не открывается в браузере. Сохраните фото как JPEG и загрузите снова.`;
    }
  }
  return `«${name}»: не удалось загрузить. Проверьте интернет и попробуйте ещё раз.`;
}

/**
 * Блок фото одного вида («До», «После» или «Дополнительные»).
 * После любого изменения вызывает onChanged, чтобы редактор перечитал проект.
 */
export default function PhotoSection({ projectId, kind, title, hint, photos, coverId, onChanged }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setErrors([]);
    const problems = [];
    let position = photos.length ? Math.max(...photos.map((photo) => photo.position)) + 1 : 0;

    for (let i = 0; i < files.length; i += 1) {
      setProgress({ current: i + 1, total: files.length });
      try {
        await uploadPhoto(projectId, kind, files[i], position);
        position += 1;
      } catch (error) {
        problems.push(uploadErrorText(error, files[i].name));
      }
    }
    setProgress(null);
    setErrors(problems);
    onChanged();
  }

  async function act(action) {
    setBusy(true);
    setErrors([]);
    try {
      await action();
    } catch {
      setErrors(["Не получилось. Проверьте интернет и попробуйте ещё раз."]);
    } finally {
      setBusy(false);
      onChanged();
    }
  }

  const uploading = Boolean(progress);

  return (
    <section className={card}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-bold">
            {title} <span className="text-[15px] font-semibold text-muted">· {photos.length}</span>
          </h2>
          {hint ? <p className="mt-1 max-w-[560px] text-[14px] leading-6 text-muted">{hint}</p> : null}
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={btn.secondary}
        >
          {uploading ? `Загрузка ${progress.current} из ${progress.total}…` : "+ Добавить фото"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {errors.length ? (
        <ul role="alert" className="mt-3 space-y-1 rounded bg-[#fff7f6] px-4 py-3 text-[14px] text-[#b42318]">
          {errors.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ) : null}

      {photos.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => {
            const isCover = photo.id === coverId;
            return (
              <li key={photo.id} className={`overflow-hidden rounded-md border ${isCover ? "border-accent ring-2 ring-accent" : "border-[#dbe4ec]"}`}>
                <div className="relative bg-ice" style={{ aspectRatio: "4 / 3" }}>
                  <img src={photoUrl(photo.thumb_path || photo.storage_path)} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded bg-navy/85 px-2 py-0.5 text-[12px] font-bold text-white">
                    {index + 1}
                  </span>
                  {isCover ? (
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-accent px-2 py-0.5 text-[12px] font-bold text-navy">
                      ★ Главная
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1 p-2">
                  <button
                    type="button"
                    className={btn.small}
                    disabled={busy || index === 0}
                    onClick={() => act(() => swapPhotoPositions(photo, photos[index - 1]))}
                    aria-label="Переместить левее"
                    title="Переместить левее"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={btn.small}
                    disabled={busy || index === photos.length - 1}
                    onClick={() => act(() => swapPhotoPositions(photo, photos[index + 1]))}
                    aria-label="Переместить правее"
                    title="Переместить правее"
                  >
                    →
                  </button>
                  {!isCover ? (
                    <button
                      type="button"
                      className={btn.small}
                      disabled={busy}
                      onClick={() => act(() => setCoverPhoto(projectId, photo.id))}
                    >
                      ★ Главная
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={`${btn.small} text-[#b42318]`}
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm("Удалить это фото?")) act(() => deletePhoto(photo));
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded border border-dashed border-[#cbd6df] px-4 py-6 text-center text-[14px] text-muted">
          Фото пока нет
        </p>
      )}
    </section>
  );
}
