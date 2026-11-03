export default function PageHeading({ title, lead, align = "left", as = "h1" }) {
  const Tag = as;
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-[680px] text-center" : "max-w-[720px]"}>
      <Tag className="text-[32px] font-bold leading-tight tracking-tight text-navy md:text-[40px]">
        {title}
      </Tag>
      <div
        className={`mt-4 h-[3px] w-12 rounded-full bg-accent ${centered ? "mx-auto" : ""}`}
      />
      {lead ? (
        <p className="mt-4 text-[16px] leading-7 text-muted md:text-[17px]">{lead}</p>
      ) : null}
    </div>
  );
}
