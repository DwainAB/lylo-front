"use client";

import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

interface ModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const { t } = useTranslation();

  const modes = [
    { value: "guided", label: t("configure.modeGuided"), icon: "route", description: t("configure.modeGuidedDesc") },
    { value: "discovery", label: t("configure.modeDiscovery"), icon: "explore", description: t("configure.modeDiscoveryDesc") },
  ];

  return (
    <section>
      <h3 className="text-text-dark text-xs font-bold uppercase tracking-widest leading-tight mb-2.5 flex items-center gap-2">
        <MaterialIcon name="tune" className="text-sm" />
        {t("configure.modeTitle")}
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {modes.map((mode) => (
          <label key={mode.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="mode"
              value={mode.value}
              checked={value === mode.value}
              onChange={() => onChange(mode.value)}
              className="peer hidden"
            />
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 border-primary/10 bg-white/50 text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <MaterialIcon name={mode.icon} className="text-base" />
              <span className="text-sm font-bold">{mode.label}</span>
              <span className="text-[10px] font-normal opacity-80 text-center leading-tight">{mode.description}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
