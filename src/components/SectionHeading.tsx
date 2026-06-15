interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  accent?: "vivid" | "electric";
}

export default function SectionHeading({ title, subtitle, centered = false, accent = "vivid" }: Props) {
  const dotColor = accent === "electric" ? "#00C2FF" : "#2A5CFF";
  return (
    <div className={centered ? "text-center mb-10" : "mb-10"}>
      <div className={`flex items-center gap-2 mb-3 ${centered ? "justify-center" : ""}`}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
        <h2 className="text-3xl md:text-4xl font-black text-[#F8FAFF] tracking-tight">
          {title}<span style={{ color: "#2A5CFF" }}>.</span>
        </h2>
      </div>
      {subtitle && (
        <p className={`text-[#B0C4FF] text-base leading-relaxed ${centered ? "max-w-xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
