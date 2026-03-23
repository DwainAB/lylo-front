"use client";

import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

interface InputModeSelectorProps {
  value: "voice" | "click";
  onChange: (value: "voice" | "click") => void;
}

export default function InputModeSelector({ value, onChange }: InputModeSelectorProps) {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  const options = [
    { value: "voice" as const, label: t("configure.inputModeVoice"), icon: "mic" },
    { value: "click" as const, label: t("configure.inputModeClick"), icon: "touch_app" },
  ];

  const infoLines = t("configure.inputModeInfo").split("\n\n");

  return (
    <section className="relative">
      <h3 className="text-text-dark text-xs font-bold uppercase tracking-widest leading-tight mb-2.5 flex items-center gap-2">
        <MaterialIcon name="settings_input_component" className="text-sm" />
        {t("configure.inputModeTitle")}&nbsp;<button
          type="button"
          aria-label="En savoir plus sur le mode de réponse"
          onClick={() => setShowInfo((v) => !v)}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="text-text-dark transition-colors"
        >
          <MaterialIcon name="info" className="text-[14px]" />
        </button>
      </h3>

      {/* Tooltip */}
      {showInfo && (
        <div className="absolute z-20 top-6 right-0 w-64 bg-white border border-primary/15 rounded-lg shadow-lg p-3 text-[11px] text-primary/80 leading-relaxed space-y-2">
          <div className="absolute -top-1.5 right-2 w-2.5 h-2.5 bg-white border-l border-t border-primary/15 rotate-45" />
          {infoLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {options.map((option) => (
          <label key={option.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="input_mode"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 border-primary/10 bg-white/50 text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <MaterialIcon name={option.icon} className="text-base" />
              <span className="text-sm font-bold">{option.label}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
