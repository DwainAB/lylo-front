"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AvatarSection from "@/components/interaction/AvatarSection";
import AvatarVideo from "@/components/interaction/AvatarVideo";

import FormulaCard from "@/components/recommendations/FormulaCard";
import PrintView from "@/components/recommendations/PrintView";
import nextDynamic from "next/dynamic";
const BottomBar = nextDynamic(() => import("@/components/livekit/BottomBar"), { ssr: false });
import { useTranslation } from "@/i18n/LanguageContext";
import { useSession, DEV_MODE } from "@/context/SessionContext";
import MaterialIcon from "@/components/ui/MaterialIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function RecommendationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { formulas: sessionFormulas, endSession, sessionData, agentName } = useSession();
  const [showPrint, setShowPrint] = useState(false);

  const [devSingleFormula, setDevSingleFormula] = useState(false);

  const persona = typeof window !== "undefined" ? localStorage.getItem("persona") : null;
  const avatarUrl = persona === "male" ? "/avatar-h.jpg" : "/avatar-f.jpg";
  const avatarEnabled = typeof window !== "undefined" ? localStorage.getItem("avatar") !== "false" : true;

  const handlePrint = () => setShowPrint(true);

  const allFormulas = sessionFormulas.map((f, i) => ({
    key: `formula-${i}`,
    name: f.profile,
    sizes: f.sizes,
  }));

  const formulas = DEV_MODE && devSingleFormula ? [allFormulas[0]] : allFormulas;
  const isSingle = formulas.length === 1;
  const showResumeButton = DEV_MODE && devSingleFormula;
  const showMailButton = isSingle;

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <Navbar showActions={false} transparent />

      <main className="flex-1 min-h-0 flex flex-col px-3 sm:px-5 pt-2 sm:pt-3 pb-0 max-w-6xl mx-auto w-full relative z-10">

        {/* ── Avatar + Titre ── visible uniquement en vue 2 formules ── */}
        {!isSingle && (
          <div className="shrink-0 flex flex-col items-center gap-1 mt-1 sm:mt-3 mb-2 sm:mb-3 [@media(max-height:580px)]:hidden">
            <AvatarSection name="" role="" imageUrl={avatarUrl} avatarEnabled={avatarEnabled} />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight mt-1 sm:mt-2">
              {t("recommendations.title")}
            </h3>
          </div>
        )}

        {/* ── Toggle dev mode ── */}
        {DEV_MODE && (
          <div className="shrink-0 flex items-center justify-center gap-1 mb-2">
            <button
              onClick={() => setDevSingleFormula(false)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                !devSingleFormula
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-primary/50 border-primary/20 hover:border-primary/40"
              }`}
            >
              2 formules
            </button>
            <button
              onClick={() => setDevSingleFormula(true)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                devSingleFormula
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-primary/50 border-primary/20 hover:border-primary/40"
              }`}
            >
              1 formule choisie
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            VUE 1 FORMULE
            [FormulaCard ~50%] | [Carte avatar ~50%]
                                  - avatar
                                  - J'ai une question
                                  - email
                                  - retour accueil
        ════════════════════════════════════════════════ */}
        {isSingle ? (
          <div className="flex-1 min-h-0 flex items-center justify-center">

            {/* Conteneur centré — h-[500px] fixe la référence commune aux 2 cartes */}
            <div className="w-full max-w-2xl flex flex-row gap-3 sm:gap-4 h-[500px]">

              {/* Carte notes (50 %) — flex-1 min-h-0 min-w-0 déjà dans FormulaCard */}
              {formulas[0] && (
                <FormulaCard name={formulas[0].name} sizes={formulas[0].sizes} />
              )}

              {/* Carte avatar + actions (50 %) — mêmes flex-1 min-h-0 min-w-0 */}
              <div className="flex-1 min-h-0 min-w-0 bg-white border border-secondary/30 rounded-xl card-shadow flex flex-col items-center justify-center gap-4 sm:gap-5 p-4 sm:p-6 overflow-hidden">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="size-28 sm:size-36 rounded-full overflow-hidden border-4 border-white ai-glow">
                    <AvatarVideo fallbackUrl={avatarUrl} avatarEnabled={avatarEnabled} />
                  </div>
                  <div className="absolute bottom-1 right-1 size-4 bg-primary rounded-full border-2 border-white" />
                </div>
                <p className="text-sm font-light tracking-wide italic text-primary">
                  {agentName} AI
                </p>

                {/* Bouton J'ai une question */}
                {showResumeButton && (
                  <button className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-primary text-sm font-medium border border-primary/25 cursor-pointer shadow-lg shadow-primary/10 hover:bg-white hover:border-primary/40 transition-all">
                    <MaterialIcon name="mic" className="text-[18px]" />
                    J&apos;ai une question
                  </button>
                )}

                {/* Bouton Imprimer */}
                {showMailButton && (
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
                  >
                    <MaterialIcon name="print" className="text-[18px]" />
                    Imprimer
                  </button>
                )}

                {/* Retour accueil */}
                <button
                  onClick={() => { endSession(); router.push("/"); }}
                  className="text-gray-400 brand-text text-xs hover:text-primary transition-colors cursor-pointer py-1"
                >
                  {t("recommendations.returnHome")}
                </button>

              </div>
            </div>
          </div>

        ) : (

        /* ════════════════════════════════════════════════
            VUE 2 FORMULES
            [carte 1] [carte 2]   [email si demandé]
        ════════════════════════════════════════════════ */
          <div className="flex-1 min-h-0 flex flex-col gap-3">

            <div className="flex-1 min-h-0 flex flex-col sm:flex-row gap-3 sm:gap-4">

              {/* Cartes côte à côte */}
              <div className="flex-1 min-h-0 min-w-0 flex flex-row gap-2 sm:gap-3">
                {formulas.length > 0 ? (
                  formulas.map((formula) => (
                    <FormulaCard
                      key={formula.key}
                      name={formula.name}
                      sizes={formula.sizes}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-center text-lg font-light self-center flex-1">
                    {t("recommendations.noFormulas")}
                  </p>
                )}
              </div>
            </div>

            {/* Retour accueil */}
            <div className="shrink-0 flex justify-center pb-4">
              <button
                onClick={() => { endSession(); router.push("/"); }}
                className="text-gray-400 brand-text text-xs hover:text-primary transition-colors cursor-pointer py-1"
              >
                {t("recommendations.returnHome")}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center shrink-0 py-3">
          <BottomBar />
        </div>
      </main>

      {/* Décorations fond */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />

      {/* Vue d'impression */}
      {showPrint && (
        <PrintView
          formulas={formulas}
          agentName={agentName ?? "Lylo"}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
}
