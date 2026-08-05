"use client";

import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  const { t } = useTranslation();

  const personas = [
    { value: "male", label: t("configure.male"), icon: "male" },
    { value: "female", label: t("configure.female"), icon: "female" },
  ];

  return (
    <section>
      <h3 className="text-surface text-xs font-bold uppercase tracking-widest leading-tight mb-1.5 flex items-center gap-2">
        <MaterialIcon name="psychology" className="text-sm" />
        {t("configure.personaTitle")}
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {personas.map((persona) => (
          <label key={persona.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={persona.value}
              checked={value === persona.value}
              onChange={() => onChange(persona.value)}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2.5 px-2 py-2 rounded-lg border-2 border-primary/10 brand-surface-soft text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <MaterialIcon name={persona.icon} className="text-base" />
              <span className="text-sm font-bold">{persona.label}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
