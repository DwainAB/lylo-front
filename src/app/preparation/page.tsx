"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";
import { useSession, DEV_MODE } from "@/context/SessionContext";
import { activeBrand } from "@/lib/brand";
import AvatarVideo from "@/components/interaction/AvatarVideo";
import nextDynamic from "next/dynamic";
const BottomBar = nextDynamic(() => import("@/components/livekit/BottomBar"), { ssr: false });

export default function PreparationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sessionState, startSession, sessionData, agentName, noCreditsError } = useSession();
  const hasStarted = useRef(false);

  // Start session on mount
  useEffect(() => {
    if (DEV_MODE) return;
    if (!hasStarted.current && !sessionData) {
      hasStarted.current = true;
      startSession();
    }
  }, [startSession, sessionData]);

  // Navigate when state changes
  useEffect(() => {
    if (DEV_MODE) return;
    if (sessionState === "questionnaire") {
      router.push("/interaction");
    } else if (sessionState === "completed") {
      router.push("/recommendations");
    }
  }, [sessionState, router]);

  const isConnecting = sessionState === "idle" || sessionState === "connecting";

  if (noCreditsError) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-red-500 font-semibold text-lg">{t("auth.noSessions")}</p>
        <button
          onClick={() => router.push("/configure")}
          className="text-primary text-sm font-medium underline underline-offset-4"
        >
          {t("preparation.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <Navbar showActions={false} transparent />

      {/* Loading overlay */}
      {isConnecting && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background-light/80 backdrop-blur-sm">
          <div className="relative mb-6">
            <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
          <p className="text-primary font-semibold text-lg">
            {t("preparation.connecting")}
          </p>
          <p className="text-primary/60 text-sm mt-1">
            {t("preparation.pleaseWait")}
          </p>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-between px-4 sm:px-6 pb-8 sm:pb-12 pt-2 max-w-4xl mx-auto w-full min-h-0 relative z-10">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative size-32 sm:size-48 md:size-56 rounded-full border-4 border-secondary overflow-hidden bg-white ai-glow">
              <AvatarVideo
                fallbackUrl={typeof window !== "undefined" && localStorage.getItem("persona") === "male" ? "/avatar-h.jpg" : "/avatar-f.jpg"}
                avatarEnabled={typeof window !== "undefined" ? localStorage.getItem("avatar") !== "false" : true}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full">
              {agentName} AI
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              {t("preparation.title")}
            </h1>
            <p className="text-primary/60 max-w-md mx-auto text-base">
              {t(activeBrand.id === "ester" ? "preparation.subtitleCatalog" : "preparation.subtitle")}
            </p>
          </div>

          {/* Instruction cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <MaterialIcon name="mic" className="text-primary text-3xl" />
              <div>
                <h3 className="font-bold text-primary text-sm uppercase tracking-wide">
                  {t("preparation.speakTitle")}
                </h3>
                <p className="text-xs text-primary/60 mt-1 leading-relaxed">
                  {t("preparation.speakDesc")}
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <MaterialIcon name="volume_off" className="text-primary text-3xl" />
              <div>
                <h3 className="font-bold text-primary text-sm uppercase tracking-wide">
                  {t("preparation.quietTitle")}
                </h3>
                <p className="text-xs text-primary/60 mt-1 leading-relaxed">
                  {t("preparation.quietDesc")}
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <MaterialIcon name="wifi" className="text-primary text-3xl" />
              <div>
                <h3 className="font-bold text-primary text-sm uppercase tracking-wide">
                  {t("preparation.connectionTitle")}
                </h3>
                <p className="text-xs text-primary/60 mt-1 leading-relaxed">
                  {t("preparation.connectionDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection status footer */}
        <footer className="w-full max-w-md">
          <div className="flex justify-center mb-3">
            {sessionData && <BottomBar />}
          </div>
          <p className="text-center text-[10px] sm:text-xs text-primary/60 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium opacity-60">
            {t("preparation.footer")}
          </p>
        </footer>
      </main>

      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-5%] size-[400px] bg-secondary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] size-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />
    </div>
  );
}
