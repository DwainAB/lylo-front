"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import FormulaCard from "@/components/recommendations/FormulaCard";
import PrintView from "@/components/recommendations/PrintView";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Formula } from "@/context/SessionContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function SilentRecommendationsPage() {
  const router = useRouter();

  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedFormula, setConfirmedFormula] = useState<Formula | null>(null);
  const [confirming, setConfirming] = useState(false);

  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("silent_result");
    if (!raw) { router.replace("/"); return; }
    const { session_id, formulas: f } = JSON.parse(raw);
    setSessionId(session_id);
    setFormulas(f || []);
  }, []);

  const handleConfirm = async () => {
    if (selectedIndex === null) return;
    setConfirming(true);
    try {
      const res = await fetch(`${API_BASE}/api/session/${sessionId}/select-formula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula_index: selectedIndex }),
      });
      if (!res.ok) { setConfirming(false); return; }
      const data = await res.json();
      setConfirmedFormula(data.formula);
      setConfirmed(true);
    } catch {
      setConfirming(false);
    }
  };

  const displayFormulas = formulas.map((f, i) => ({ key: `f-${i}`, name: f.profile, sizes: f.sizes }));
  const confirmedDisplay = confirmedFormula
    ? [{ key: "confirmed", name: confirmedFormula.profile, sizes: confirmedFormula.sizes }]
    : [];

  // ── Vue 1 formule confirmée ──────────────────────────────────────────
  if (confirmed && confirmedFormula) {
    return (
      <div className="relative flex h-dvh w-full flex-col overflow-hidden">
        <Navbar showActions={false} transparent />

        <main className="flex-1 min-h-0 flex flex-col px-3 sm:px-5 pt-2 pb-4 max-w-2xl mx-auto w-full relative z-10">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="w-full flex flex-row gap-3 sm:gap-4 h-[500px]">

              {/* Carte formule */}
              <FormulaCard name={confirmedDisplay[0].name} sizes={confirmedDisplay[0].sizes} />

              {/* Carte actions */}
              <div className="flex-1 min-h-0 min-w-0 bg-white border border-secondary/30 rounded-xl card-shadow flex flex-col items-center justify-center gap-5 p-4 sm:p-6 overflow-hidden">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-primary/50 font-semibold mb-1">Votre formule</p>
                  <h2 className="text-xl font-light text-primary">{confirmedFormula.profile}</h2>
                </div>

                {/* Imprimer */}
                <button
                  onClick={() => setShowPrint(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
                >
                  <MaterialIcon name="print" className="text-[18px]" />
                  Imprimer
                </button>

                {/* Retour accueil */}
                <button
                  onClick={() => { sessionStorage.removeItem("silent_result"); sessionStorage.removeItem("silent_profile"); router.push("/"); }}
                  className="text-gray-400 brand-text text-xs hover:text-primary transition-colors cursor-pointer py-1"
                >
                  Retour à l&apos;accueil
                </button>
              </div>
            </div>
          </div>
        </main>

        <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
        <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />

        {showPrint && (
          <PrintView
            formulas={confirmedDisplay}
            agentName="Lylo"
            onClose={() => setShowPrint(false)}
          />
        )}
      </div>
    );
  }

  // ── Vue 2 formules — sélection ────────────────────────────────────────
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <Navbar showActions={false} transparent />

      <main className="flex-1 min-h-0 flex flex-col px-3 sm:px-5 pt-2 pb-0 max-w-6xl mx-auto w-full relative z-10">

        <div className="shrink-0 flex flex-col items-center gap-1 mt-3 mb-3">
          <h3 className="text-xl sm:text-2xl font-extralight tracking-tight text-center text-primary">
            Choisissez votre formule
          </h3>
          <p className="text-xs text-primary/50 font-light">
            Cliquez sur celle qui vous correspond
          </p>
        </div>

        {/* Cartes sélectionnables */}
        <div className="flex-1 min-h-0 flex flex-row gap-3 sm:gap-4">
          {displayFormulas.map((f, i) => (
            <div
              key={f.key}
              onClick={() => setSelectedIndex(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedIndex(i);
                }
              }}
              tabIndex={0}
              role="button"
              className={`flex-1 min-h-0 min-w-0 text-left rounded-xl transition-all duration-300 border-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedIndex === i
                  ? "border-primary scale-[1.02] shadow-xl shadow-primary/20"
                  : "border-transparent hover:border-primary/30"
              }`}
            >
              <FormulaCard name={f.name} sizes={f.sizes} />
              {selectedIndex === i && (
                <div className="flex justify-center mt-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest">
                    <MaterialIcon name="check_circle" className="text-xs" />
                    Sélectionnée
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bouton confirmer */}
        <div className="shrink-0 flex justify-center py-4">
          <button
            onClick={handleConfirm}
            disabled={selectedIndex === null || confirming}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {confirming ? (
              <>
                <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Confirmation...</span>
              </>
            ) : (
              <>
                <span>Valider mon choix</span>
                <MaterialIcon name="check" className="text-base" />
              </>
            )}
          </button>
        </div>
      </main>

      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
