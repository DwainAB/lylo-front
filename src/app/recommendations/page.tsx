"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AvatarSection from "@/components/interaction/AvatarSection";
import AvatarVideo from "@/components/interaction/AvatarVideo";

import FormulaCard from "@/components/recommendations/FormulaCard";
import CatalogFormulaCard from "@/components/recommendations/CatalogFormulaCard";
import FormulaQrCode from "@/components/recommendations/FormulaQrCode";
import nextDynamic from "next/dynamic";
const BottomBar = nextDynamic(() => import("@/components/livekit/BottomBar"), { ssr: false });
import { useTranslation } from "@/i18n/LanguageContext";
import { useSession, DEV_MODE, isCatalogFormula, Formula } from "@/context/SessionContext";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { resolveStoredLanguage } from "@/lib/language";
import { createShareableFormula } from "@/lib/shareableFormula";
import { SizeOption } from "@/components/recommendations/SizeToggle";
import { activeBrand } from "@/lib/brand";

const isEster = activeBrand.id === "ester";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function renderFormula(
  formula: Formula,
  opts: {
    variant: "default" | "comparison";
    className?: string;
    selectedSize: SizeOption;
    onSelectedSizeChange: (size: SizeOption) => void;
  }
) {
  if (isCatalogFormula(formula)) {
    return (
      <CatalogFormulaCard
        brand={formula.brand ?? ""}
        name={formula.name ?? ""}
        family={formula.family}
        topNotes={formula.top_notes}
        heartNotes={formula.heart_notes}
        baseNotes={formula.base_notes}
        matchReason={formula.match_reason}
        imageUrl={formula.image_url}
        variant={opts.variant}
        className={opts.className}
      />
    );
  }
  return (
    <FormulaCard
      name={formula.profile ?? ""}
      sizes={formula.sizes!}
      variant={opts.variant}
      className={opts.className}
      selectedSize={opts.selectedSize}
      onSelectedSizeChange={opts.onSelectedSizeChange}
    />
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { formulas: sessionFormulas, endSession, agentName, sessionData } = useSession();
  const [printStatus, setPrintStatus] = useState<"idle" | "printing" | "done" | "error">("idle");
  const [selectedSize, setSelectedSize] = useState<SizeOption>("30ml");

  const printerLocation = typeof window !== "undefined" ? localStorage.getItem("printer_location") ?? "" : "";

  const [devSingleFormula, setDevSingleFormula] = useState(false);

  const persona = typeof window !== "undefined" ? localStorage.getItem("persona") : null;
  const avatarUrl = persona === "male" ? "/avatar-h.jpg" : "/avatar-f.jpg";
  const avatarEnabled = typeof window !== "undefined" ? localStorage.getItem("avatar") !== "false" : true;

  const handlePrint = async () => {
    const formula = sessionFormulas[0];
    if (!formula || !printerLocation || isCatalogFormula(formula)) return;
    setPrintStatus("printing");
    try {
      const size = formula.sizes![selectedSize];
      const res = await fetch(`${API_BASE}/printers/print-formula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: printerLocation,
          formula: {
            profile: formula.profile,
            notes: {
              top: size.top_notes.map((n) => n.name),
              heart: size.heart_notes.map((n) => n.name),
              base: size.base_notes.map((n) => n.name),
            },
            date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
          },
        }),
      });
      setPrintStatus(res.ok ? "done" : "error");
    } catch {
      setPrintStatus("error");
    }
  };

  const isCatalog = sessionFormulas.length > 0 && isCatalogFormula(sessionFormulas[0]);
  const allFormulas = sessionFormulas.map((f, i) => ({ key: `formula-${i}`, formula: f }));

  const formulas = DEV_MODE && devSingleFormula ? allFormulas.slice(0, 1) : allFormulas;
  const isSingle = formulas.length === 1;
  const showResumeButton = DEV_MODE && devSingleFormula;
  const selectedFormula = sessionFormulas[0];
  const language = resolveStoredLanguage();

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto">
      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col px-3 sm:px-5 pt-2 sm:pt-3 pb-6 max-w-[1400px] mx-auto w-full relative z-10">

        {/* ── Avatar + Titre ── visible uniquement en vue 2 formules ── */}
        {!isSingle && (
          <div className="shrink-0 flex flex-col items-center gap-1 mt-1 sm:mt-3 mb-2 sm:mb-3 [@media(max-height:580px)]:hidden">
            <AvatarSection name="" role="" imageUrl={avatarUrl} avatarEnabled={avatarEnabled} />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight mt-1 sm:mt-2">
              {t(isEster ? "recommendations.titleCatalog" : "recommendations.title")}
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
                                  - QR code
                                  - retour accueil
        ════════════════════════════════════════════════ */}
        {isSingle ? (
          <div className="flex-1 min-h-0 flex items-center justify-center">

            {/* Conteneur centré — h-[500px] fixe la référence commune aux 2 cartes */}
            <div className="w-full max-w-[920px] flex flex-row gap-2.5 sm:gap-3 h-[470px]">

              {/* Carte notes (50 %) — flex-1 min-h-0 min-w-0 déjà dans FormulaCard */}
              {formulas[0] && renderFormula(formulas[0].formula, {
                variant: "default",
                className: "flex-[1.05]",
                selectedSize,
                onSelectedSizeChange: setSelectedSize,
              })}

              {/* Carte avatar + actions (50 %) — mêmes flex-1 min-h-0 min-w-0 */}
              <div className="flex-[0.9] min-h-0 min-w-0 bg-white border border-secondary/30 rounded-xl card-shadow flex flex-col items-center justify-center gap-3 p-3.5 sm:p-4 overflow-hidden">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="size-24 sm:size-28 rounded-full overflow-hidden border-4 border-white ai-glow">
                    <AvatarVideo fallbackUrl={avatarUrl} avatarEnabled={avatarEnabled} />
                  </div>
                  <div className="absolute bottom-1 right-1 size-4 bg-primary rounded-full border-2 border-white" />
                </div>
                <p className="text-xs sm:text-sm font-light tracking-wide italic text-primary">
                  {agentName} AI
                </p>

                {/* Bouton J'ai une question */}
                {showResumeButton && (
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs sm:text-sm font-medium border border-primary/25 cursor-pointer shadow-lg shadow-primary/10 hover:bg-white hover:border-primary/40 transition-all">
                    <MaterialIcon name="mic" className="text-[18px]" />
                    {t("recommendationsPage.resumeQuestion")}
                  </button>
                )}

                {/* Bouton Imprimer (indisponible en mode catalogue — pas de formule à imprimer) */}
                {printerLocation && !isCatalog && (
                  printStatus === "done" ? (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <MaterialIcon name="check_circle" className="text-[18px]" />
                      {t("recommendationsPage.printed")}
                    </div>
                  ) : (
                    <button
                      onClick={handlePrint}
                      disabled={printStatus === "printing"}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs sm:text-sm font-medium border border-primary/25 cursor-pointer shadow-lg shadow-primary/10 hover:bg-white hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {printStatus === "printing"
                        ? <div className="size-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        : <MaterialIcon name="print" className="text-[18px]" />
                      }
                      {t("recommendationsPage.print")}
                    </button>
                  )
                )}
                {printStatus === "error" && (
                  <p className="text-xs text-red-500 text-center">{t("recommendationsPage.printError")}</p>
                )}

                {selectedFormula && !isCatalogFormula(selectedFormula) && (
                  <FormulaQrCode
                    formula={createShareableFormula(selectedFormula.profile!, selectedSize, selectedFormula.sizes!)}
                    language={language}
                    buttonLabel={t("recommendations.qrButton")}
                    title={t("recommendations.qrTitle")}
                    subtitle={t("recommendations.qrSubtitle")}
                    closeLabel={t("recommendations.qrClose")}
                  />
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
            [carte 1] [carte 2]
        ════════════════════════════════════════════════ */
          <div className="flex-1 flex flex-col gap-4 sm:gap-5">

            <div className="shrink-0 text-center max-w-3xl mx-auto">
              <p className="brand-text text-[0.62rem] sm:text-[0.68rem] text-primary/70 mb-2">
                {t("recommendationsPage.yourRecommendations")}
              </p>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-extralight tracking-tight text-primary leading-tight">
                {t("recommendationsPage.compareFormulas")}
              </h3>
            </div>

            <div className="flex flex-col gap-4">

              {/* Cartes */}
              <div className="min-w-0 grid grid-cols-1 min-[480px]:grid-cols-2 gap-2 sm:gap-4 items-start">
                {formulas.length > 0 ? (
                  formulas.map((item, index) => (
                    <div
                      key={item.key}
                      className={
                        formulas.length % 2 === 1 && index === formulas.length - 1
                          ? "min-[480px]:col-span-2 min-[480px]:max-w-[calc(50%-0.5rem)] min-[480px]:mx-auto"
                          : ""
                      }
                    >
                      {renderFormula(item.formula, {
                        variant: "comparison",
                        selectedSize,
                        onSelectedSizeChange: setSelectedSize,
                      })}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center text-lg font-light self-center flex-1">
                    {t(isEster ? "recommendations.noFormulasCatalog" : "recommendations.noFormulas")}
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
          {sessionData && <BottomBar />}
        </div>
      </main>

      {/* Décorations fond */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
