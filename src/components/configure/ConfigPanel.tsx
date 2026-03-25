"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import PersonaSelector from "./PersonaSelector";
import DepthSelector from "./DepthSelector";
import LanguagePicker from "./LanguagePicker";
import ModeSelector from "./ModeSelector";
import InputModeSelector from "./InputModeSelector";
import ConnectionTest from "@/components/preparation/ConnectionTest";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ConfigPanel() {
  const router = useRouter();
  const [persona, setPersona] = useState("");
  const [depth, setDepth] = useState("");
  const [mode, setMode] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "click">("voice");
  const [avatar, setAvatar] = useState(true);
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

  const isFormComplete = persona !== "" && depth !== "" && mode !== "";

  const handleContinue = () => {
    localStorage.setItem("persona", persona);
    localStorage.setItem("depth", depth);
    localStorage.setItem("mode", mode);
    localStorage.setItem("input_mode", inputMode);
    localStorage.setItem("avatar", String(avatar));
    router.push("/preparation");
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
          <LanguagePicker />
          <PersonaSelector value={persona} onChange={setPersona} />
          <DepthSelector value={depth} onChange={setDepth} />
          <ModeSelector value={mode} onChange={setMode} />
        </div>

        {/* Right */}
        <div className="space-y-4">
          <InputModeSelector value={inputMode} onChange={setInputMode} />

          {/* Avatar toggle */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">
              {t("configure.avatarTitle")}
            </p>
            <button
              type="button"
              onClick={() => setAvatar((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-primary/15 bg-white/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <MaterialIcon name={avatar ? "videocam" : "videocam_off"} className="text-primary text-[18px]" />
                <span className="text-xs font-semibold text-primary">
                  {avatar ? t("configure.avatarOn") : t("configure.avatarOff")}
                </span>
              </div>
              <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${avatar ? "bg-primary" : "bg-primary/20"}`}>
                <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 ${avatar ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>
            <p className="text-[10px] text-[#9c8880] leading-relaxed px-1">
              {t("configure.avatarHint")}
            </p>
          </div>

          {/* Fullscreen toggle */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">
              Affichage
            </p>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-primary/15 bg-white/40 hover:bg-primary/5 transition-all"
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
        <span>{t("configure.continue")}</span>
        <MaterialIcon name="arrow_forward" />
      </button>
    </div>
  );
}
