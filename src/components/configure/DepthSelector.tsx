"use client";

import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

interface DepthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DepthSelector({ value, onChange }: DepthSelectorProps) {
  const { t } = useTranslation();

  const depths = [
    { value: "1", label: "1", sublabel: t("configure.quick") },
    { value: "4", label: "4", sublabel: t("configure.standard") },
    { value: "12", label: "12", sublabel: t("configure.deep") },
  ];

  return (
    <section>
      <h3 className="text-text-dark text-xs font-bold uppercase tracking-widest leading-tight mb-2.5 flex items-center gap-2">
        <MaterialIcon name="query_stats" className="text-sm" />
        {t("configure.depthTitle")}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {depths.map((depth) => (
          <label key={depth.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="questions"
              value={depth.value}
              checked={value === depth.value}
              onChange={() => onChange(depth.value)}
              className="peer hidden"
            />
            <div className="flex flex-col items-center justify-center gap-1 py-3 rounded-lg border-2 border-primary/10 bg-white/50 text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <span className="text-sm font-bold">{depth.label}</span>
              <span className="text-[10px] uppercase font-medium opacity-80">
                {depth.sublabel}
              </span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
