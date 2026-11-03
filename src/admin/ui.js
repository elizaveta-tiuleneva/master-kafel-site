// Общие классы админ-панели: крупные кнопки и поля, понятные на телефоне.
export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-[6px] bg-accent px-5 py-3 text-[15px] font-bold text-navy transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-[6px] border border-navy bg-white px-5 py-3 text-[15px] font-semibold text-navy transition-colors hover:bg-ice-bg disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#e3b4ad] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#b42318] transition-colors hover:bg-[#fff7f6] disabled:opacity-60",
  small:
    "inline-flex items-center justify-center gap-1 rounded-[5px] border border-[#cbd6df] bg-white px-2.5 py-1.5 text-[13px] font-semibold text-navy hover:bg-ice-bg disabled:cursor-not-allowed disabled:opacity-40",
};

export const field =
  "w-full rounded-[6px] border border-[#cbd6df] bg-white px-3.5 py-2.5 text-[16px] text-navy placeholder:text-[#8a9bb0] outline-none focus:border-navy focus:ring-2 focus:ring-navy/10";

export const label = "mb-1.5 block text-[15px] font-semibold text-navy";

export const card = "rounded-lg border border-[#dbe4ec] bg-white p-5 sm:p-6";
