"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import PersonaSelector from "./PersonaSelector";
import DepthSelector from "./DepthSelector";
import LanguagePicker from "./LanguagePicker";
import ModeSelector from "./ModeSelector";
import InputModeSelector from "./InputModeSelector";
import ChildModeSelector from "./ChildModeSelector";
import ConnectionTest from "@/components/preparation/ConnectionTest";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ConfigPanel() {
  const router = useRouter();
  const [persona, setPersona] = useState("");
  const [depth, setDepth] = useState("");
  const [mode, setMode] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "click">("voice");
  const [avatar] = useState(false);
  const [childMode, setChildMode] = useState(false);
  const { t } = useTranslation();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const isFormComplete = childMode || (persona !== "" && depth !== "" && mode !== "");

  const handleContinue = () => {
    if (childMode) {
      router.push("/children/profile");
    } else {
      localStorage.setItem("child_mode", "false");
      localStorage.setItem("persona", persona);
      localStorage.setItem("depth", depth);
      localStorage.setItem("mode", mode);
      localStorage.setItem("input_mode", inputMode);
      localStorage.setItem("avatar", String(avatar));
      router.push("/preparation");
    }
  };

  return (
    <div className="glass-panel w-full max-w-2xl rounded-xl shadow-xl relative z-10 border border-primary/5 p-6 sm:p-8 space-y-6">

      {/* ── Header ── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="h-px w-6 bg-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
            {t("configure.label")}
          </span>
          <span className="h-px w-6 bg-primary/40" />
        </div>
        <h1 className="text-primary tracking-tight text-2xl sm:text-3xl font-bold mb-1.5 font-display">
          {t("configure.title")}
        </h1>
        <p className="text-primary/60 text-xs sm:text-sm font-medium">
          {t("configure.subtitle")}
        </p>
      </div>

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

        {/* Left */}
        <div className="space-y-4">
          <ChildModeSelector value={childMode} onChange={setChildMode} />

          {!childMode && (
            <>
              <LanguagePicker />
              <PersonaSelector value={persona} onChange={setPersona} />
              <DepthSelector value={depth} onChange={setDepth} />
            </>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          {!childMode && (
            <>
              <ModeSelector value={mode} onChange={setMode} />
              <InputModeSelector value={inputMode} onChange={setInputMode} />

            </>
          )}

          {/* Fullscreen toggle */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">
              Affichage
            </p>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-primary/10 bg-white/50 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <MaterialIcon name={isFullscreen ? "fullscreen_exit" : "fullscreen"} className="text-primary text-[18px]" />
                <span className="text-xs font-semibold text-primary">
                  {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                </span>
              </div>
              <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isFullscreen ? "bg-primary" : "bg-primary/20"}`}>
                <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 ${isFullscreen ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>
          </div>

          <ConnectionTest />
        </div>
      </div>

      {/* ── Continue button ── */}
      <button
        disabled={!isFormComplete}
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span>{t("configure.start")}</span>
        <MaterialIcon name="arrow_forward" />
      </button>
    </div>
  );
}
