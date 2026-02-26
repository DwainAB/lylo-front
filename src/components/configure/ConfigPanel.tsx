"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import PersonaSelector from "./PersonaSelector";
import DepthSelector from "./DepthSelector";
import LanguagePicker from "./LanguagePicker";
import ModeSelector from "./ModeSelector";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ConfigPanel() {
  const router = useRouter();
  const [persona, setPersona] = useState("");
  const [depth, setDepth] = useState("");
  const [mode, setMode] = useState("");
  const { t } = useTranslation();

  const isFormComplete = persona !== "" && depth !== "" && mode !== "";

  const handleContinue = () => {
    localStorage.setItem("persona", persona);
    localStorage.setItem("depth", depth);
    localStorage.setItem("mode", mode);
    router.push("/preparation");
  };

  return (
    <div
      className={`
        glass-panel w-full max-w-lg rounded-xl shadow-xl relative z-10 border border-primary/5
        [@media(max-height:620px)]:max-w-2xl
        [@media(max-height:620px)]:grid
        [@media(max-height:620px)]:grid-cols-[2fr_3fr]
      `}
    >
      {/* ── TOP (portrait/tall) / LEFT (short height) : Header ── */}
      <div
        className={`
          p-4 sm:p-6
          [@media(max-height:620px)]:p-5
          [@media(max-height:620px)]:flex
          [@media(max-height:620px)]:flex-col
          [@media(max-height:620px)]:justify-between
          [@media(max-height:620px)]:border-r
          [@media(max-height:620px)]:border-primary/10
        `}
      >
        <div className="text-center [@media(max-height:620px)]:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-6 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
              {t("configure.label")}
            </span>
            <span className="h-px w-6 bg-primary/40" />
          </div>
          <h1 className="text-primary tracking-tight text-2xl sm:text-3xl [@media(max-height:620px)]:text-xl [@media(max-height:620px)]:leading-snug font-bold mb-1.5 font-display">
            {t("configure.title")}
          </h1>
          <p className="text-primary/60 text-xs sm:text-sm font-medium">
            {t("configure.subtitle")}
          </p>
        </div>

        {/* Continue — colonne gauche (petite hauteur) */}
        <button
          disabled={!isFormComplete}
          onClick={handleContinue}
          className="hidden [@media(max-height:620px)]:flex mt-5 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg transition-all hover:scale-[1.02] items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="text-sm">{t("configure.continue")}</span>
          <MaterialIcon name="arrow_forward" className="text-sm" />
        </button>
      </div>

      {/* ── BOTTOM (portrait/tall) / RIGHT (short height) : Form ── */}
      <div
        className={`
          px-4 pb-4 sm:px-6 sm:pb-6
          [@media(max-height:620px)]:p-4
          [@media(max-height:620px)]:overflow-y-auto
          space-y-4
          [@media(max-height:620px)]:space-y-3
        `}
      >
        <LanguagePicker />
        <PersonaSelector value={persona} onChange={setPersona} />
        <DepthSelector value={depth} onChange={setDepth} />
        <ModeSelector value={mode} onChange={setMode} />

        {/* Continue — en bas (hauteur normale) */}
        <div className="pt-1 [@media(max-height:620px)]:hidden">
          <button
            disabled={!isFormComplete}
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span>{t("configure.continue")}</span>
            <MaterialIcon name="arrow_forward" />
          </button>
        </div>
      </div>
    </div>
  );
}
