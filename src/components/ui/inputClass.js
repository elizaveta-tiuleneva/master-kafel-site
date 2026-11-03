export const inputClass = (invalid) =>
  `w-full rounded-[5px] border bg-[#f7f9fb] px-3.5 text-[15px] text-navy placeholder:text-[#8a9bb0] outline-none transition-colors focus:bg-white focus:ring-2 ${
    invalid
      ? "border-[#b42318] bg-[#fff7f6] focus:ring-[#b42318]/20"
      : "border-[#cbd6df] focus:border-navy focus:ring-navy/10"
  }`;
