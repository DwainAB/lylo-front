"use client";

import { useTranslation } from "@/i18n/LanguageContext";

export default function GeneratingLoader() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-light/90 backdrop-blur-md">
      {/* Animated perfume bottle icon */}
      <div className="relative mb-8">
        <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl animate-bounce" style={{ animationDuration: "2s" }}>
              science
            </span>
          </div>
        </div>

        {/* Floating note particles */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute size-3 rounded-full bg-primary/30"
            style={{
              top: "10%",
              left: `${30 + i * 20}%`,
              animation: `float-particle 2.5s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
        {t("generating.title")}
      </h2>
      <p className="text-sm text-[#7f6f66] max-w-xs text-center">
        {t("generating.subtitle")}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-2 rounded-full bg-primary"
            style={{
              animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-40px) scale(1.5); opacity: 0.8; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
