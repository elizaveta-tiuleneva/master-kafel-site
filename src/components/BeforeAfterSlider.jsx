import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const KEY_STEP = 5;
const KEY_STEP_LARGE = 10;
// У краёв подпись прячется, чтобы не закрывать ручку.
const LABEL_HIDE_EDGE = 16;

/**
 * Сравнение «до / после»: фото «после» лежит снизу, фото «до» сверху
 * и обрезается через clip-path. Положение хранится в CSS-переменной
 * и обновляется без перерисовки React, поэтому движение плавное.
 */
export default function BeforeAfterSlider({
  before,
  after,
  aspect = "4 / 3",
  initial = 50,
  priority = false,
  className = "",
}) {
  const { t } = useLanguage();
  const rootRef = useRef(null);
  const handleRef = useRef(null);
  const beforeLabelRef = useRef(null);
  const afterLabelRef = useRef(null);
  const position = useRef(initial);
  const frame = useRef(0);
  const touchStart = useRef(null);
  const dragging = useRef(null);

  const render = useCallback(() => {
    frame.current = 0;
    const value = position.current;
    rootRef.current?.style.setProperty("--pos", `${value}%`);
    handleRef.current?.setAttribute("aria-valuenow", String(Math.round(value)));
    if (beforeLabelRef.current) {
      beforeLabelRef.current.style.opacity = value < LABEL_HIDE_EDGE ? "0" : "1";
    }
    if (afterLabelRef.current) {
      afterLabelRef.current.style.opacity = value > 100 - LABEL_HIDE_EDGE ? "0" : "1";
    }
  }, []);

  const setPosition = useCallback(
    (value) => {
      position.current = Math.min(100, Math.max(0, value));
      if (!frame.current) frame.current = requestAnimationFrame(render);
    },
    [render],
  );

  useEffect(() => {
    render();
    return () => cancelAnimationFrame(frame.current);
  }, [render]);

  function positionFromEvent(event) {
    const rect = rootRef.current.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * 100;
  }

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging.current = event.pointerId;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Без захвата перетаскивание всё равно работает внутри фото.
    }
    if (event.pointerType === "mouse") {
      event.preventDefault();
      setPosition(positionFromEvent(event));
      handleRef.current?.focus({ preventScroll: true });
    } else {
      // На сенсорном экране ждём движения: короткое касание или
      // вертикальная прокрутка страницы не должны дёргать разделитель.
      touchStart.current = { x: event.clientX, moved: false };
    }
  }

  function handlePointerMove(event) {
    if (dragging.current !== event.pointerId) return;
    if (touchStart.current) touchStart.current.moved = true;
    setPosition(positionFromEvent(event));
  }

  function handlePointerUp(event) {
    if (dragging.current !== event.pointerId) return;
    if (touchStart.current && !touchStart.current.moved) {
      setPosition(positionFromEvent(event));
    }
    dragging.current = null;
    touchStart.current = null;
  }

  // Браузер забрал жест под вертикальную прокрутку — разделитель не трогаем.
  function handlePointerCancel() {
    dragging.current = null;
    touchStart.current = null;
  }

  function handleKeyDown(event) {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const actions = {
      ArrowLeft: () => setPosition(position.current - step),
      ArrowDown: () => setPosition(position.current - step),
      ArrowRight: () => setPosition(position.current + step),
      ArrowUp: () => setPosition(position.current + step),
      Home: () => setPosition(0),
      End: () => setPosition(100),
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  const imageClass =
    "absolute inset-0 h-full w-full select-none object-cover pointer-events-none";

  return (
    <div
      ref={rootRef}
      className={`relative cursor-ew-resize touch-pan-y select-none overflow-hidden bg-ice-bg ${className}`}
      style={{ aspectRatio: aspect, "--pos": `${initial}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <img
        src={after.src}
        alt={`${t.common.after}`}
        draggable="false"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={imageClass}
      />
      <img
        src={before.src}
        alt={`${t.common.before}`}
        draggable="false"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={imageClass}
        style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
      />

      <span
        ref={beforeLabelRef}
        className="pointer-events-none absolute left-3 top-3 rounded bg-navy/85 px-2.5 py-1 text-[12px] font-semibold text-white transition-opacity duration-200"
      >
        {t.common.before}
      </span>
      <span
        ref={afterLabelRef}
        className="pointer-events-none absolute right-3 top-3 rounded bg-navy/85 px-2.5 py-1 text-[12px] font-semibold text-white transition-opacity duration-200"
      >
        {t.common.after}
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.35)]"
        style={{ left: "var(--pos)" }}
      />
      <div
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-label={t.common.sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={initial}
        aria-valuetext={`${t.common.before} / ${t.common.after}`}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_2px_10px_rgba(11,37,69,0.3)] outline-none focus-visible:ring-4 focus-visible:ring-accent"
        style={{ left: "var(--pos)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 7l-5 5 5 5M15 7l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
