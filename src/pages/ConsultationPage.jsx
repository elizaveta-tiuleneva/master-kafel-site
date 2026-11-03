import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { PHONES } from "../data/images.js";
import { CATEGORY_IDS } from "../data/categories.js";
import { LeadSubmitError, submitLead } from "../api/leads.js";
import { MAX_FILES, checkFile, emptyLead, validateLead } from "../lib/leadForm.js";
import Icon from "../components/Icon.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import FormField from "../components/ui/FormField.jsx";
import { inputClass } from "../components/ui/inputClass.js";

const FIELD_ORDER = ["name", "phone", "district", "roomType", "area", "message", "consent"];

function PhotoPicker({ files, onAdd, onRemove, error }) {
  const { t } = useLanguage();
  const c = t.consultation;
  const inputRef = useRef(null);

  return (
    <div>
      <span className="mb-1.5 block text-[14px] font-semibold text-navy">{c.photos}</span>
      <div
        className={`rounded-[5px] border border-dashed p-4 ${
          error ? "border-[#b42318] bg-[#fff7f6]" : "border-[#9fb3c6] bg-[#f7f9fb]"
        }`}
      >
        {files.length ? (
          <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {files.map((item) => (
              <li key={item.id} className="relative aspect-square overflow-hidden rounded bg-ice">
                <img
                  src={item.preview}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-navy/70 px-1 py-0.5 text-[10px] text-white">
                  {item.file.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`${c.removePhoto}: ${item.file.name}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-navy shadow"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={files.length >= MAX_FILES}
            className="inline-flex items-center gap-2 rounded-[5px] border border-navy bg-white px-4 py-2 text-[14px] font-semibold text-navy hover:bg-ice-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="add_photo_alternate" className="text-[20px]" />
            {c.photosButton}
          </button>
          <span className="text-[13px] text-muted">{c.photosHint}</span>
        </div>
        <input
          ref={inputRef}
          id="lead-photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            onAdd(Array.from(event.target.files || []));
            event.target.value = "";
          }}
        />
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-[13px] font-medium text-[#b42318]">{error}</p>
      ) : null}
    </div>
  );
}

export default function ConsultationPage() {
  const { t } = useLanguage();
  const c = t.consultation;
  const formRef = useRef(null);
  const [form, setForm] = useState(emptyLead);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(
    () => () => filesRef.current.forEach((item) => URL.revokeObjectURL(item.preview)),
    [],
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function addFiles(selected) {
    const room = MAX_FILES - files.length;
    const accepted = [];
    const problems = [];
    for (const file of selected) {
      const problem = checkFile(file);
      if (problem) {
        problems.push(c.errors[problem].replace("{name}", file.name));
        continue;
      }
      if (accepted.length >= room) {
        problems.push(c.errors.tooMany);
        break;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      });
    }
    setFiles((current) => [...current, ...accepted]);
    setFileError(problems.join(" "));
  }

  function removeFile(id) {
    setFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((item) => item.id !== id);
    });
    setFileError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    const found = validateLead(form);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitLead(form, files.map((item) => item.file));
      files.forEach((item) => URL.revokeObjectURL(item.preview));
      setFiles([]);
      setForm(emptyLead);
      setStatus("success");
    } catch (error) {
      // Данные формы сохраняются, чтобы посетитель мог повторить отправку.
      const notConfigured = error instanceof LeadSubmitError && error.code === "not_configured";
      setSubmitError(notConfigured ? c.errors.notConfigured : c.errors.failed);
      setStatus("idle");
    }
  }

  const errorText = (field) => (errors[field] ? c.errors[errors[field]] : "");
  const describedBy = (field) => (errors[field] ? `lead-${field}-error` : undefined);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <PageContainer className="py-6 md:py-14">
      <div className="grid grid-cols-1 items-stretch gap-4 lg:gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
        <section className="rounded-lg bg-navy px-5 py-6 text-white sm:px-6 md:px-10 lg:py-12">
          <h1 className="text-[24px] font-bold leading-tight md:text-[34px]">{c.infoTitle}</h1>
          <div className="mt-3 h-[3px] w-12 rounded-full bg-accent lg:mt-4" />
          {/* На телефоне — короткая версия, чтобы форма была сразу под блоком. */}
          <p className="mt-4 text-[15px] leading-6 text-white/85 lg:hidden">{c.infoShort}</p>
          <div className="mt-6 hidden space-y-4 text-[16px] leading-7 text-white/85 lg:block">
            {c.infoParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-5 border-t border-white/15 pt-5 lg:mt-8 lg:pt-6">
            <p className="hidden text-[15px] text-white/85 lg:block">{c.phoneLead}</p>
            <div className="flex flex-wrap items-center justify-between gap-3 lg:mt-3 lg:justify-start lg:gap-4">
              <a href={PHONES.callHref} className="text-[22px] font-bold tracking-tight text-white hover:text-accent md:text-[28px]">
                {PHONES.call}
              </a>
              <a
                href={PHONES.callHref}
                className="inline-flex items-center gap-2 rounded-[5px] bg-accent px-4 py-2.5 text-[14px] font-bold text-navy transition-colors hover:bg-accent-hover"
              >
                <Icon name="call" className="text-[18px]" />
                {t.common.call}
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#dbe4ec] bg-white px-5 py-7 shadow-[0_1px_3px_rgba(11,37,69,0.06)] sm:px-8 md:py-10">
          <h2 className="text-[24px] font-bold text-navy md:text-[28px]">{c.formTitle}</h2>

          {status === "success" ? (
            <div role="status" className="mt-6 rounded-lg border border-[#b7e0c2] bg-[#effaf2] p-6 text-center">
              <Icon name="check_circle" className="text-[40px] text-[#1f7a3a]" />
              <p className="mt-2 text-[18px] font-bold text-navy">{c.successTitle}</p>
              <p className="mt-1 text-[15px] text-muted">{c.successText}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 text-[14px] font-semibold text-navy underline decoration-accent decoration-2 underline-offset-4"
              >
                {c.sendAnother}
              </button>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-6 space-y-5">
              {hasErrors ? (
                <p role="alert" className="rounded border border-[#f1b8b0] bg-[#fff7f6] px-4 py-2.5 text-[14px] font-medium text-[#b42318]">
                  {c.errors.summary}
                </p>
              ) : null}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField id="lead-name" label={c.name} required requiredLabel={c.required} error={errorText("name")}>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder={c.namePlaceholder}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy("name")}
                    aria-required="true"
                    className={`${inputClass(errors.name)} h-12`}
                  />
                </FormField>
                <FormField id="lead-phone" label={c.phone} required requiredLabel={c.required} error={errorText("phone")}>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder={c.phonePlaceholder}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={describedBy("phone")}
                    aria-required="true"
                    className={`${inputClass(errors.phone)} h-12`}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField id="lead-district" label={c.district}>
                  <input
                    id="lead-district"
                    name="district"
                    type="text"
                    maxLength={100}
                    value={form.district}
                    onChange={(event) => update("district", event.target.value)}
                    placeholder={c.districtPlaceholder}
                    className={`${inputClass(false)} h-12`}
                  />
                </FormField>
                <FormField id="lead-roomType" label={c.roomType}>
                  <select
                    id="lead-roomType"
                    name="roomType"
                    value={form.roomType}
                    onChange={(event) => update("roomType", event.target.value)}
                    className={`${inputClass(false)} h-12 ${form.roomType ? "" : "text-[#8a9bb0]"}`}
                  >
                    <option value="">{c.roomTypePlaceholder}</option>
                    {CATEGORY_IDS.map((id) => (
                      <option key={id} value={id} className="text-navy">
                        {c.roomTypes[id]}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField id="lead-area" label={c.area} error={errorText("area")}>
                  <input
                    id="lead-area"
                    name="area"
                    type="text"
                    inputMode="decimal"
                    maxLength={8}
                    value={form.area}
                    onChange={(event) => update("area", event.target.value)}
                    placeholder={c.areaPlaceholder}
                    aria-invalid={Boolean(errors.area)}
                    aria-describedby={describedBy("area")}
                    className={`${inputClass(errors.area)} h-12`}
                  />
                </FormField>
              </div>

              <FormField id="lead-message" label={c.message}>
                <textarea
                  id="lead-message"
                  name="message"
                  rows={5}
                  maxLength={2000}
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  placeholder={c.messagePlaceholder}
                  className={`${inputClass(false)} resize-y py-3 leading-6`}
                />
              </FormField>

              <PhotoPicker files={files} onAdd={addFiles} onRemove={removeFile} error={fileError} />

              <div>
                <label
                  className={`flex items-start gap-3 rounded-[5px] border px-4 py-3 text-[14px] leading-6 text-[#334d68] ${
                    errors.consent ? "border-[#b42318] bg-[#fff7f6]" : "border-[#dbe4ec] bg-[#f7f9fb]"
                  }`}
                >
                  <input
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => update("consent", event.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={describedBy("consent")}
                    className="mt-1 h-4 w-4 shrink-0 accent-navy"
                  />
                  <span>
                    {c.consent}{" "}
                    <Link to="/privacy" className="font-semibold text-navy underline underline-offset-2">
                      {c.privacyLink}
                    </Link>
                    <span className="ml-0.5 text-[#b42318]" aria-hidden="true">*</span>
                  </span>
                </label>
                {errors.consent ? (
                  <p id="lead-consent-error" className="mt-1.5 text-[13px] font-medium text-[#b42318]">
                    {errorText("consent")}
                  </p>
                ) : null}
              </div>

              {submitError ? (
                <p role="alert" className="rounded border border-[#f1b8b0] bg-[#fff7f6] px-4 py-3 text-[14px] font-medium leading-6 text-[#b42318]">
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-[5px] bg-accent px-6 py-3.5 text-[16px] font-bold text-navy transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
              >
                {status === "sending" ? c.sending : c.submit}
                {status === "sending" ? null : <span aria-hidden="true">↗</span>}
              </button>
            </form>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
