"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import MaterialIcon from "@/components/ui/MaterialIcon";
import FormulaCard from "@/components/recommendations/FormulaCard";
import { useTranslation } from "@/i18n/LanguageContext";
import { FormulaSize } from "@/context/SessionContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface Formula {
  profile: string;
  sizes: {
    "10ml": FormulaSize;
    "30ml": FormulaSize;
    "50ml": FormulaSize;
  };
  session_id?: string;
}

export default function QuizResultsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("recap_email") ?? "" : "";

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("quiz_formulas") : null;
    if (!raw) { router.push("/quiz"); return; }
    try { setFormulas(JSON.parse(raw)); } catch { router.push("/quiz"); }
  }, [router]);

  const sessionId = formulas[0]?.session_id ?? null;

  const handleSendEmail = async () => {
    if (!sessionId || !savedEmail) return;
    setSendStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/api/session/${sessionId}/mail/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: savedEmail }),
      });
      setSendStatus(res.ok ? "sent" : "error");
    } catch {
      setSendStatus("error");
    }
  };

  if (formulas.length === 0) return null;

  const selectedFormula = chosen !== null ? formulas[chosen] : null;

  return (
    <div className="relative min-h-dvh w-full flex flex-col bg-stone-50 overflow-hidden">
      <Navbar showActions={false} transparent />

      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-cream rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 pb-10 relative z-10 max-w-4xl mx-auto w-full gap-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-6 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">{t("quiz.resultsLabel")}</span>
            <span className="h-px w-6 bg-primary/40" />
          </div>
          <h1 className="text-primary tracking-tight text-2xl sm:text-3xl font-bold mb-1.5 font-display">
            {chosen === null ? t("quiz.resultsTitle") : t("quiz.resultsTitleChosen")}
          </h1>
          <p className="text-primary/60 text-xs sm:text-sm font-medium">
            {chosen === null ? t("quiz.resultsSubtitle") : t("quiz.resultsSubtitleChosen")}
          </p>
        </div>

        {/* ── Sélection : 2 formules côte à côte ── */}
        {chosen === null && (
          <div className="w-full flex flex-row gap-3 sm:gap-4 h-[420px] sm:h-[480px]">
            {formulas.map((formula, i) => (
              <div
                key={i}
                onClick={() => setChosen(i)}
                className="flex-1 min-w-0 cursor-pointer rounded-xl border-2 border-transparent hover:border-primary transition-all hover:scale-[1.01] overflow-hidden"
              >
                <FormulaCard name={formula.profile} sizes={formula.sizes} />
              </div>
            ))}
          </div>
        )}

        {/* ── Formule choisie + actions ── */}
        {chosen !== null && selectedFormula && (
          <>
            <div className="w-full flex flex-row gap-3 sm:gap-4 h-[420px] sm:h-[480px]">
              <FormulaCard name={selectedFormula.profile} sizes={selectedFormula.sizes} />
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">

              {/* Changer de choix */}
              <button
                onClick={() => { setChosen(null); setSendStatus("idle"); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-primary/25 text-primary text-sm font-semibold shadow-sm hover:bg-primary/5 transition-all"
              >
                <MaterialIcon name="swap_horiz" className="text-[18px]" />
                {t("quiz.changeChoice")}
              </button>

              {/* Print */}
              {sessionId && (
                <button
                  onClick={() => window.open(`${API_BASE}/api/session/${sessionId}/formula/pdf`, "_blank")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-primary/25 text-primary text-sm font-semibold shadow-sm hover:bg-primary/5 transition-all"
                >
                  <MaterialIcon name="print" className="text-[18px]" />
                  {t("quiz.print")}
                </button>
              )}

              {/* Email — uniquement si renseigné dans configure */}
              {savedEmail && (
                sendStatus === "sent" ? (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <MaterialIcon name="check_circle" className="text-[18px]" />
                    {t("quiz.emailSent")}
                  </div>
                ) : (
                  <button
                    onClick={handleSendEmail}
                    disabled={sendStatus === "sending"}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sendStatus === "sending"
                      ? <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      : <><MaterialIcon name="mail" className="text-[16px]" /><span>{t("quiz.sendEmail")}</span></>
                    }
                  </button>
                )
              )}
              {sendStatus === "error" && (
                <p className="text-xs text-red-500">{t("quiz.emailError")}</p>
              )}
            </div>
          </>
        )}

        {/* Back home */}
        <button
          onClick={() => { localStorage.removeItem("quiz_formulas"); router.push("/"); }}
          className="text-gray-400 brand-text text-xs hover:text-primary transition-colors cursor-pointer py-1"
        >
          {t("recommendations.returnHome")}
        </button>
      </main>
    </div>
  );
}
