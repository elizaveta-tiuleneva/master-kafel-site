import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const SWIPE_DISTANCE = 50;

/** Полноэкранный просмотр фото: стрелки, свайп, Esc, счётчик. */
export default function Lightbox({ photos, index, onIndexChange, onClose }) {
  const { t } = useLanguage();
  const closeRef = useRef(null);
  const swipeStart = useRef(null);
  const total = photos.length;
  const photo = photos[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + total) % total);
      if (event.key === "ArrowRight") onIndexChange((index + 1) % total);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, total, onClose, onIndexChange]);

  // Соседние фото загружаются заранее, чтобы листание было без задержки.
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const next = photos[(i + total) % total];
      if (next) new Image().src = next.src;
    });
  }, [index, photos, total]);

  if (!photo) return null;

  const go = (step) => onIndexChange((index + step + total) % total);
  const buttonClass =
    "flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-accent";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.common.lightbox.label}
      className="fixed inset-0 z-[100] flex flex-col bg-[#071a30]/95"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="text-[14px] font-semibold tabular-nums">
          {index + 1} / {total}
          {photo.caption ? (
            <span className="ml-3 font-normal text-white/70">{photo.caption}</span>
          ) : null}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.common.lightbox.close}
          className={buttonClass}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 pb-4 sm:px-20"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (swipeStart.current === null) return;
          const distance = event.clientX - swipeStart.current;
          swipeStart.current = null;
          if (total > 1 && Math.abs(distance) > SWIPE_DISTANCE) go(distance < 0 ? 1 : -1);
        }}
      >
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.caption || ""}
          draggable="false"
          className="max-h-full max-w-full select-none rounded object-contain"
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.common.lightbox.prev}
              className={`${buttonClass} absolute left-3 top-1/2 hidden -translate-y-1/2 sm:flex`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.common.lightbox.next}
              className={`${buttonClass} absolute right-3 top-1/2 hidden -translate-y-1/2 sm:flex`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
