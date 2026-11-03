export default function FormField({ id, label, required, requiredLabel, error, hint, className = "", children }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-semibold text-navy">
        {label}
        {required ? (
          <span className="ml-0.5 text-[#b42318]" title={requiredLabel} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1 text-[13px] font-medium text-[#b42318]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
