"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

const FONT_HEADLINE = "'Plus Jakarta Sans', sans-serif";
type Step = "welcome" | "name" | "age" | "gender";
const FORM_STEPS: Exclude<Step, "welcome">[] = ["name", "age", "gender"];

export default function ChildProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<"boy" | "girl" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "name") inputRef.current?.focus();
  }, [step]);

  const goNext = () => {
    const idx = FORM_STEPS.indexOf(step as Exclude<Step, "welcome">);
    if (idx < FORM_STEPS.length - 1) {
      setStep(FORM_STEPS[idx + 1]);
    } else {
      router.push("/children/interaction");
    }
  };

  const canNext =
    (step === "name" && name.trim().length >= 2) ||
    (step === "age" && age !== null) ||
    (step === "gender" && gender !== null);

  const stepIndex = FORM_STEPS.indexOf(step as Exclude<Step, "welcome">);

  const questions: Partial<Record<Step, string>> = {
    name: "Comment tu t'appelles ?",
    age: "Tu as quel âge ?",
    gender: "Tu es une fille ou un garçon ?",
  };

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        backgroundColor: "#FFF9E6",
        backgroundImage: "radial-gradient(circle at 2px 2px, #FFEB99 1px, transparent 0)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* Décorations flottantes — identiques à la page interaction */}
      {([
        { icon: "star",         color: "#FF6B6B", cls: "top-20 left-[5%]",     delay: "0s",   size: "text-5xl" },
        { icon: "auto_awesome", color: "#4ECDC4", cls: "top-36 right-[8%]",    delay: "1s",   size: "text-4xl" },
        { icon: "bubble_chart", color: "#FFD93D", cls: "bottom-16 left-[8%]",  delay: "0.5s", size: "text-5xl" },
        { icon: "favorite",     color: "#FF6B6B", cls: "bottom-32 right-[5%]", delay: "1.5s", size: "text-4xl", fill: true },
      ] as const).map(({ icon, color, cls, delay, size, fill }) => (
        <div
          key={icon}
          className={`fixed ${cls} opacity-30 pointer-events-none`}
          style={{ animation: "child-floating 3s ease-in-out infinite", animationDelay: delay }}
        >
          <span
            className={`material-symbols-outlined ${size}`}
            style={{ color, ...(fill ? { fontVariationSettings: '"FILL" 1' } : {}) }}
          >
            {icon}
          </span>
        </div>
      ))}

      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-between px-4 pb-2 pt-1 max-w-6xl mx-auto w-full min-h-0 relative z-10">

        {/* Haut : indicateur d'étapes + question — masqué sur welcome */}
        {step !== "welcome" && (
          <div className="w-full flex flex-col items-center gap-1 shrink-0 mt-16 sm:mt-14">
            <div className="flex items-center gap-2 mb-1" style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "0.85rem", color: "#FF6B6B" }}>
              <span className="material-symbols-outlined text-lg p-0.5 rounded-md text-white" style={{ backgroundColor: "#FF6B6B" }}>person</span>
              <span>Étape {stepIndex + 1} / {FORM_STEPS.length}</span>
            </div>
            <div className="w-full max-w-xs h-3 bg-white rounded-full overflow-hidden mb-1" style={{ border: "2px solid #FFD3D3" }}>
              <div
                className="h-full rounded-full transition-[width] duration-700 progress-water"
                style={{ width: `${((stepIndex + 1) / FORM_STEPS.length) * 100}%` }}
              />
            </div>
            <h3
              className="text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight"
              style={{ fontFamily: FONT_HEADLINE, color: "#51311c" }}
            >
              {questions[step]}
            </h3>
          </div>
        )}

        {/* Contenu central */}
        <div className={`relative w-full max-w-lg flex-1 min-h-0 flex items-center justify-center ${step === "welcome" ? "mt-16 sm:mt-14" : ""}`}>

          {/* ── Écran de bienvenue ── */}
          {step === "welcome" && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div
                className="flex items-center gap-2"
                style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "0.85rem", color: "#FF6B6B" }}
              >
                <span className="material-symbols-outlined text-lg p-0.5 rounded-md text-white" style={{ backgroundColor: "#FF6B6B", fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
                <span>Lylo Kids</span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-extralight tracking-tight leading-tight max-w-xs"
                style={{ fontFamily: FONT_HEADLINE, color: "#51311c" }}
              >
                Bienvenue ! On va créer ta formule magique 🪄
              </h1>
              <button
                onClick={() => setStep("name")}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: FONT_HEADLINE,
                  background: "linear-gradient(135deg,#FF6B6B,#FF8E8E)",
                  boxShadow: "0 8px 24px -4px rgba(255,107,107,0.5)",
                }}
              >
                <span>Commencer</span>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>rocket_launch</span>
              </button>
            </div>
          )}

          {/* ── Étape 1 : Prénom ── */}
          {step === "name" && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-full relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canNext && goNext()}
                  placeholder="Tape ton prénom..."
                  maxLength={20}
                  className="w-full text-center outline-none transition-all duration-200"
                  style={{
                    fontFamily: FONT_HEADLINE,
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    height: "3.5rem",
                    borderRadius: "0.75rem",
                    border: "2px solid",
                    borderColor: name.trim().length >= 2 ? "#4ECDC4" : "#FFD3D3",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: "#51311c",
                    padding: "0 3.5rem 0 1rem",
                    boxShadow: name.trim().length >= 2 ? "0 0 0 4px rgba(78,205,196,0.15)" : "none",
                  }}
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ animation: "child-floating 2s ease-in-out infinite", color: "#FFD93D" }}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>auto_fix_high</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 2 : Âge ── */}
          {step === "age" && (
            <div className="w-full flex flex-col items-center gap-5">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setAge((a) => Math.max(3, (a ?? 7) - 1))}
                  className="flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
                  style={{
                    width: "2.75rem", height: "2.75rem",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    border: "2px solid rgba(255,107,107,0.25)",
                  }}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ color: "#FF6B6B" }}>remove</span>
                </button>

                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "5rem", height: "5rem",
                    borderRadius: "0.75rem",
                    border: "2px solid",
                    borderColor: age !== null ? "#4ECDC4" : "#FFD3D3",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    boxShadow: age !== null ? "0 0 0 4px rgba(78,205,196,0.15)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "2rem", color: age !== null ? "#51311c" : "#D1D5DB" }}>
                    {age ?? "?"}
                  </span>
                </div>

                <button
                  onClick={() => setAge((a) => Math.min(15, (a ?? 7) + 1))}
                  className="flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
                  style={{
                    width: "2.75rem", height: "2.75rem",
                    backgroundColor: "rgba(78,205,196,0.1)",
                    border: "2px solid rgba(78,205,196,0.25)",
                  }}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ color: "#4ECDC4" }}>add</span>
                </button>
              </div>

              {/* Raccourcis âges */}
              <div className="flex flex-wrap justify-center gap-2">
                {[5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className="transition-all duration-150 active:scale-90"
                    style={{
                      padding: "0.25rem 0.85rem",
                      borderRadius: "9999px",
                      fontFamily: FONT_HEADLINE,
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      border: "2px solid",
                      borderColor: age === a ? "#FF6B6B" : "rgba(255,107,107,0.2)",
                      backgroundColor: age === a ? "#FF6B6B" : "rgba(255,255,255,0.7)",
                      color: age === a ? "white" : "#FF6B6B",
                    }}
                  >
                    {a} ans
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Étape 3 : Genre ── */}
          {step === "gender" && (
            <div className="flex gap-4 w-full max-w-sm">
              {/* Fille */}
              <button
                onClick={() => setGender("girl")}
                className="flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl transition-all duration-200 active:scale-95"
                style={{
                  border: "2px solid",
                  borderColor: gender === "girl" ? "#FF6B6B" : "rgba(255,107,107,0.2)",
                  backgroundColor: gender === "girl" ? "rgba(255,107,107,0.08)" : "rgba(255,255,255,0.7)",
                  boxShadow: gender === "girl" ? "0 8px 24px -4px rgba(255,107,107,0.3)" : "none",
                  transform: gender === "girl" ? "scale(1.03)" : "scale(1)",
                }}
              >
                <span className="material-symbols-outlined text-5xl" style={{ color: "#FF6B6B", fontVariationSettings: '"FILL" 1' }}>face_3</span>
                <span style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "0.95rem", color: "#FF6B6B" }}>Fille</span>
                {gender === "girl" && (
                  <span className="material-symbols-outlined text-base" style={{ color: "#FF6B6B", fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                )}
              </button>

              {/* Garçon */}
              <button
                onClick={() => setGender("boy")}
                className="flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl transition-all duration-200 active:scale-95"
                style={{
                  border: "2px solid",
                  borderColor: gender === "boy" ? "#4ECDC4" : "rgba(78,205,196,0.2)",
                  backgroundColor: gender === "boy" ? "rgba(78,205,196,0.08)" : "rgba(255,255,255,0.7)",
                  boxShadow: gender === "boy" ? "0 8px 24px -4px rgba(78,205,196,0.3)" : "none",
                  transform: gender === "boy" ? "scale(1.03)" : "scale(1)",
                }}
              >
                <span className="material-symbols-outlined text-5xl" style={{ color: "#4ECDC4", fontVariationSettings: '"FILL" 1' }}>face</span>
                <span style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "0.95rem", color: "#4ECDC4" }}>Garçon</span>
                {gender === "boy" && (
                  <span className="material-symbols-outlined text-base" style={{ color: "#4ECDC4", fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bouton — identique à la page interaction, masqué sur welcome */}
        <div className={`flex justify-center shrink-0 py-3 ${step === "welcome" ? "invisible" : ""}`}>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
            style={{
              fontFamily: FONT_HEADLINE,
              background: canNext ? "linear-gradient(135deg,#FF6B6B,#FF8E8E)" : "#d1d5db",
              boxShadow: canNext ? "0 8px 24px -4px rgba(255,107,107,0.5)" : "none",
              cursor: canNext ? "pointer" : "not-allowed",
              opacity: canNext ? 1 : 0.6,
            }}
          >
            <span>{step === "gender" ? "C'est parti !" : "Suivant"}</span>
            <span className="material-symbols-outlined text-base">
              {step === "gender" ? "rocket_launch" : "arrow_forward"}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
