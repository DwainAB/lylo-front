"use client";

import { useTranslation } from "@/i18n/LanguageContext";

const INTENSITIES = ["légère", "modérée", "intense"] as const;

export default function IntensitySelector() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 px-2">
      <p className="text-center text-sm tracking-widest uppercase text-primary/50 font-medium">
        {t("intensity.subtitle")}
      </p>

      <div className="flex flex-col gap-3">
        {INTENSITIES.map((level) => (
          <div
            key={level}
            className="rounded-xl border border-primary/20 bg-white/50 backdrop-blur-sm px-6 py-4 flex items-center gap-4"
          >
            <div
              className="shrink-0 rounded-full bg-primary/10"
              style={{
                width: level === "légère" ? 10 : level === "modérée" ? 14 : 18,
                height: level === "légère" ? 10 : level === "modérée" ? 14 : 18,
              }}
            />
            <span className="text-sm tracking-widest uppercase font-medium text-primary">
              {t(`intensity.${level}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
