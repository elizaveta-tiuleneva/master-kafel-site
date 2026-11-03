import { Link } from "react-router-dom";

/** Ряд «фото | текст» на странице услуг; reversed меняет стороны местами. */
export default function ServiceCard({
  number,
  title,
  text,
  points = [],
  image,
  to,
  linkLabel,
  reversed = false,
}) {
  return (
    <article className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12 lg:gap-16">
      <Link
        to={to}
        tabIndex={-1}
        aria-hidden="true"
        className={`group block overflow-hidden rounded-lg bg-slate-300 ${reversed ? "md:order-2" : ""}`}
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </Link>

      <div className={reversed ? "md:order-1" : ""}>
        <p className="text-[13px] font-semibold tracking-[0.2em] text-[#58708a]">{number}</p>
        <h2 className="mt-1 text-[26px] font-bold leading-tight text-navy md:text-[32px]">
          {title}
        </h2>
        <p className="mt-3 text-[16px] leading-7 text-muted md:text-[17px]">{text}</p>
        {points.length ? (
          <ul className="mt-5 space-y-2.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] leading-6 text-[#334d68] md:text-[16px]">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {point}
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          to={to}
          className="mt-6 inline-flex items-center gap-2 rounded-[5px] border border-navy px-5 py-2.5 text-[15px] font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
