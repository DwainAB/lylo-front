"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { CHILD_QUESTIONS, FLOATING_ELEMENTS, Choice } from "@/data/childrenQuestions";
import ChildChoiceCard from "@/components/children/ChildChoiceCard";

const FONT_HEADLINE = "'Plus Jakarta Sans', sans-serif";

export default function ChildInteractionPage() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<"top" | "bottom" | "confirm">("top");
  const [selected, setSelected] = useState<string[]>([]);
  const [hiddenChoices, setHiddenChoices] = useState<string[]>([]);
  const [topSelected, setTopSelected] = useState<Choice[]>([]);
  const [bottomSelected, setBottomSelected] = useState<Choice[]>([]);

  const totalSteps = CHILD_QUESTIONS.length;
  const currentQuestion = CHILD_QUESTIONS[questionIndex];
  const progress = (questionIndex / totalSteps) * 100;

  const visibleChoices = currentQuestion.choices.filter((c) => !hiddenChoices.includes(c.label));

  // Retourne l'index original dans la liste complète pour garder la cohérence des couleurs
  const colorIndexOf = (label: string) => currentQuestion.choices.findIndex((c) => c.label === label);

  const toggleChoice = (label: string) => {
    setSelected((prev) => {
      if (prev.includes(label)) return prev.filter((v) => v !== label);
      if (prev.length >= 2) return prev;
      return [...prev, label];
    });
  };

  const handleSubmit = () => {
    if (selected.length !== 2) return;
    if (phase === "top") {
      setTopSelected(currentQuestion.choices.filter((c) => selected.includes(c.label)));
      setHiddenChoices(selected);
      setSelected([]);
      setPhase("bottom");
    } else if (phase === "bottom") {
      setBottomSelected(currentQuestion.choices.filter((c) => selected.includes(c.label)));
      setSelected([]);
      setPhase("confirm");
    }
  };

  const handleConfirm = () => {
    setHiddenChoices([]);
    setTopSelected([]);
    setBottomSelected([]);
    setPhase("top");
    if (questionIndex + 1 >= totalSteps) {
      router.push("/children/recommendations");
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  const handleGoBack = () => {
    setSelected(bottomSelected.map((c) => c.label));
    setBottomSelected([]);
    setPhase("bottom");
  };

  const canSubmit = selected.length === 2;
  const buttonText = phase === "bottom" ? "Ces deux me plaisent moins !" : "Je choisis ces deux-là !";

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        backgroundColor: "#FFF9E6",
        backgroundImage: "radial-gradient(circle at 2px 2px, #FFEB99 1px, transparent 0)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* Éléments flottants décoratifs */}
      {FLOATING_ELEMENTS.map(({ icon, color, cls, delay, size }) => (
        <div
          key={icon}
          className={`fixed ${cls} opacity-30 pointer-events-none`}
          style={{ animation: "child-floating 3s ease-in-out infinite", animationDelay: delay }}
        >
          <span className={`material-symbols-outlined ${size}`} style={{ color }}>{icon}</span>
        </div>
      ))}

      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-4 pt-1 max-w-6xl mx-auto w-full min-h-0 relative z-10">

        {/* Progression + question */}
        <div className="w-full flex flex-col items-center gap-1 shrink-0 mt-16 sm:mt-14">
          <div className="flex items-center gap-2 mb-1" style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "0.85rem", color: "#FF6B6B" }}>
            <span className="material-symbols-outlined text-lg p-0.5 rounded-md text-white" style={{ backgroundColor: "#FF6B6B" }}>quiz</span>
            <span>Question {questionIndex + 1} / {totalSteps}</span>
          </div>
          <div className="w-full max-w-xs h-3 bg-white rounded-full overflow-hidden mb-1" style={{ border: "2px solid #FFD3D3" }}>
            <div
              className="h-full rounded-full transition-[width] duration-700 progress-water"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </div>
          <h3
            className="text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight"
            style={{ fontFamily: FONT_HEADLINE, color: "#51311c" }}
          >
            {phase === "confirm"
              ? "C'est bien tes choix ?"
              : phase === "bottom"
              ? currentQuestion.questionBottom
              : currentQuestion.questionTop}
          </h3>
        </div>

        {/* Grille de sélection (phases top / bottom) */}
        {phase !== "confirm" && (
          <>
            <div className="relative w-full max-w-5xl flex-1 min-h-0" style={{ maxHeight: "52vh" }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full py-2 h-full">
                {visibleChoices.map((choice, i) => (
                  <ChildChoiceCard
                    key={choice.label}
                    choice={choice}
                    cardIndex={i}
                    mode={phase}
                    selected={selected.includes(choice.label)}
                    onClick={() => toggleChoice(choice.label)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center shrink-0 py-3">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: FONT_HEADLINE,
                  background: canSubmit ? "linear-gradient(135deg,#FF6B6B,#FF8E8E)" : "#d1d5db",
                  boxShadow: canSubmit ? "0 8px 24px -4px rgba(255,107,107,0.5)" : "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  opacity: canSubmit ? 1 : 0.6,
                }}
              >
                <span>{buttonText}</span>
                <span className="material-symbols-outlined text-base">auto_fix_high</span>
              </button>
            </div>
          </>
        )}

        {/* Phase de confirmation */}
        {phase === "confirm" && (
          <>
            <div className="relative w-full max-w-5xl flex-1 min-h-0 flex flex-col gap-2 py-2" style={{ maxHeight: "52vh" }}>

              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-2 mb-1 ml-1 shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ color: "#FF6B6B", fontVariationSettings: '"FILL" 1' }}>favorite</span>
                  <span className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: FONT_HEADLINE, color: "#FF6B6B" }}>J&apos;adore</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0">
                  {topSelected.map((choice) => (
                    <ChildChoiceCard key={choice.label} choice={choice} cardIndex={colorIndexOf(choice.label)} mode="liked" />
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-2 mb-1 ml-1 shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ color: "#9CA3AF", fontVariationSettings: '"FILL" 1' }}>thumb_down</span>
                  <span className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: FONT_HEADLINE, color: "#9CA3AF" }}>J&apos;aime moins</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0">
                  {bottomSelected.map((choice) => (
                    <ChildChoiceCard key={choice.label} choice={choice} cardIndex={colorIndexOf(choice.label)} mode="disliked" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 shrink-0 py-3">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                style={{ fontFamily: FONT_HEADLINE, background: "#E5E7EB", color: "#6B7280", cursor: "pointer" }}
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Je veux changer</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
                style={{ fontFamily: FONT_HEADLINE, background: "linear-gradient(135deg,#FF6B6B,#FF8E8E)", boxShadow: "0 8px 24px -4px rgba(255,107,107,0.5)" }}
              >
                <span>C'est bon !</span>
                <span className="material-symbols-outlined text-base">check_circle</span>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
