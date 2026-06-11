"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AvatarSection from "@/components/interaction/AvatarSection";
import AvatarVideo from "@/components/interaction/AvatarVideo";

import FormulaCard from "@/components/recommendations/FormulaCard";
import nextDynamic from "next/dynamic";
const BottomBar = nextDynamic(() => import("@/components/livekit/BottomBar"), { ssr: false });
import { useTranslation } from "@/i18n/LanguageContext";
import { useSession, DEV_MODE } from "@/context/SessionContext";
import MaterialIcon from "@/components/ui/MaterialIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function RecommendationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { formulas: sessionFormulas, endSession, sessionData, requestingEmail, agentName } = useSession();
  const [email, setEmail] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [printStatus, setPrintStatus] = useState<"idle" | "printing" | "done" | "error">("idle");

  const printerLocation = typeof window !== "undefined" ? localStorage.getItem("printer_location") ?? "" : "";

  const [devSingleFormula, setDevSingleFormula] = useState(false);

  const persona = typeof window !== "undefined" ? localStorage.getItem("persona") : null;
  const avatarUrl = persona === "male" ? "/avatar-h.jpg" : "/avatar-f.jpg";
  const avatarEnabled = typeof window !== "undefined" ? localStorage.getItem("avatar") !== "false" : true;

  const handlePrint = async () => {
    const formula = sessionFormulas[0];
    if (!formula || !printerLocation) return;
    setPrintStatus("printing");
    try {
      const size = formula.sizes["30ml"];
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

  const handleSendEmail = async () => {
    if (!sessionData?.session_id || !email) return;
    setSendStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/api/session/${sessionData.session_id}/mail/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email }),
      });
      setSendStatus(res.ok ? "sent" : "error");
    } catch {
      setSendStatus("error");
    }
  };

  const allFormulas = sessionFormulas.map((f, i) => ({
    key: `formula-${i}`,
    name: f.profile,
    sizes: f.sizes,
  }));

  const formulas = DEV_MODE && devSingleFormula ? [allFormulas[0]] : allFormulas;
  const isSingle = formulas.length === 1;
  const showEmail = requestingEmail || (DEV_MODE && devSingleFormula);
  const showResumeButton = DEV_MODE && devSingleFormula;
  const showMailButton = DEV_MODE && devSingleFormula;

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto">
      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col px-3 sm:px-5 pt-2 sm:pt-3 pb-6 max-w-6xl mx-auto w-full relative z-10">

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
                {printerLocation && (
                  printStatus === "done" ? (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <MaterialIcon name="check_circle" className="text-[18px]" />
                      Imprimé
                    </div>
                  ) : (
                    <button
                      onClick={handlePrint}
                      disabled={printStatus === "printing"}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-primary text-sm font-medium border border-primary/25 cursor-pointer shadow-lg shadow-primary/10 hover:bg-white hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {printStatus === "printing"
                        ? <div className="size-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        : <MaterialIcon name="print" className="text-[18px]" />
                      }
                      Imprimer
                    </button>
                  )
                )}
                {printStatus === "error" && (
                  <p className="text-xs text-red-500 text-center">Erreur d&apos;impression.</p>
                )}

                {/* Bouton Voir l'email */}
                {showMailButton && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:brightness-110 transition-all">
                    <MaterialIcon name="mail" className="text-[18px]" />
                    Voir l&apos;email
                  </button>
                )}

                {/* Champ email */}
                {showEmail && (
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-xs font-light text-center text-[#7f6f66] tracking-wide">
                      Recevez votre formule par email
                    </p>
                    {sendStatus === "sent" ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                        <MaterialIcon name="check_circle" className="text-[18px]" />
                        Email envoyé
                      </div>
                    ) : (
                      <div className="flex w-full gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                          placeholder="votre@email.com"
                          disabled={sendStatus === "sending"}
                          className="flex-1 min-w-0 px-3 py-2 rounded-full border border-primary/25 bg-white/60 text-sm text-[#4a3f3a] placeholder-[#b0a49e] focus:outline-none focus:border-primary/50 disabled:opacity-50"
                        />
                        <button
                          onClick={handleSendEmail}
                          disabled={!email || sendStatus === "sending"}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                          {sendStatus === "sending" ? (
                            <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <MaterialIcon name="send" className="text-[16px]" />
                          )}
                        </button>
                      </div>
                    )}
                    {sendStatus === "error" && (
                      <p className="text-xs text-red-500 text-center">
                        Une erreur est survenue. Veuillez réessayer.
                      </p>
                    )}
                  </div>
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
          <div className="flex-1 flex flex-col gap-4 sm:gap-5">

            <div className="shrink-0 text-center max-w-3xl mx-auto">
              <p className="brand-text text-[0.62rem] sm:text-[0.68rem] text-primary/70 mb-2">
                Vos recommandations
              </p>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-extralight tracking-tight text-primary leading-tight">
                Comparez les deux formules en toute lisibilité
              </h3>
            </div>

            <div className="flex flex-col gap-4">

              {/* Cartes */}
              <div className="min-w-0 grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 items-start">
                {formulas.length > 0 ? (
                  formulas.map((formula) => (
                    <FormulaCard
                      key={formula.key}
                      name={formula.name}
                      sizes={formula.sizes}
                      variant="comparison"
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-center text-lg font-light self-center flex-1">
                    {t("recommendations.noFormulas")}
                  </p>
                )}
              </div>

              {/* Email sous les cartes */}
              {requestingEmail && (
                <div className="shrink-0 max-w-xl mx-auto w-full bg-white/85 border border-primary/10 rounded-xl px-4 py-4 sm:px-5 sm:py-5 card-shadow">
                  <p className="text-xs font-light text-center text-[#7f6f66] tracking-wide mb-3">
                    Recevez votre formule par email
                  </p>
                  {sendStatus === "sent" ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                      <MaterialIcon name="check_circle" className="text-[18px]" />
                      Email envoyé
                    </div>
                  ) : (
                    <div className="flex w-full gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                        placeholder="votre@email.com"
                        disabled={sendStatus === "sending"}
                        className="flex-1 min-w-0 px-3 py-2 rounded-full border border-primary/25 bg-white/60 text-sm text-[#4a3f3a] placeholder-[#b0a49e] focus:outline-none focus:border-primary/50 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendEmail}
                        disabled={!email || sendStatus === "sending"}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      >
                        {sendStatus === "sending" ? (
                          <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <MaterialIcon name="send" className="text-[16px]" />
                        )}
                      </button>
                    </div>
                  )}
                  {sendStatus === "error" && (
                    <p className="text-xs text-red-500 text-center">
                      Une erreur est survenue. Veuillez réessayer.
                    </p>
                  )}
                </div>
              )}
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
    </div>
  );
}
