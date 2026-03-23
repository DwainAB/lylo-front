"use client";

import { useSession } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";
import MaterialIcon from "@/components/ui/MaterialIcon";

function Dots() {
  return (
    <div className="flex gap-1.5">
      <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDuration: "1.5s" }} />
      <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "1.5s" }} />
      <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1.5s" }} />
    </div>
  );
}

export default function SpeakingIndicator() {
  const { agentName, agentState, clickSelectionMode } = useSession();
  const { t } = useTranslation();

  if (clickSelectionMode !== null) {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/30 bg-white/50 backdrop-blur-sm flex items-center gap-3 text-primary shadow-sm">
        <MaterialIcon name="touch_app" className="text-[18px]" />
        <span className="text-sm tracking-widest font-medium lowercase">
          {t("interaction.clickSelectHint")}
        </span>
      </div>
    );
  }

  if (agentState === "initializing") {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm flex items-center gap-4 text-primary shadow-sm">
        <Dots />
        <span className="text-sm tracking-widest italic font-light lowercase">
          {t("interaction.connecting")}
        </span>
      </div>
    );
  }

  if (agentState === "speaking") {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/30 bg-white/50 backdrop-blur-sm flex items-center gap-4 text-primary shadow-sm">
        <Dots />
        <span className="text-sm tracking-widest italic font-light lowercase">
          {t("interaction.agentSpeaking").replace("{name}", agentName)}
        </span>
      </div>
    );
  }

  if (agentState === "thinking") {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm flex items-center gap-4 text-primary/60 shadow-sm">
        <Dots />
        <span className="text-sm tracking-widest italic font-light lowercase">
          {t("interaction.agentThinking")}
        </span>
      </div>
    );
  }

  if (agentState === "listening") {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/40 bg-primary/5 backdrop-blur-sm flex items-center gap-3 text-primary shadow-sm">
        <MaterialIcon name="mic" className="text-[18px] animate-pulse" />
        <span className="text-sm tracking-widest font-medium lowercase">
          {t("interaction.agentListening")}
        </span>
      </div>
    );
  }

  if (agentState === "idle") {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/10 bg-white/30 backdrop-blur-sm flex items-center gap-3 text-primary/40 shadow-sm">
        <MaterialIcon name="mic_off" className="text-[18px]" />
        <span className="text-sm tracking-widest italic font-light lowercase">
          {t("interaction.agentIdle")}
        </span>
      </div>
    );
  }

  return null;
}
