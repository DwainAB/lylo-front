"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import MaterialIcon from "@/components/ui/MaterialIcon";

type Step = "name" | "gender" | "age" | "allergies";
const STEPS: Step[] = ["name", "gender", "age", "allergies"];

export default function SilentProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<"homme" | "femme" | "">("");
  const [age, setAge] = useState("");
  const [hasAllergies, setHasAllergies] = useState<"non" | "oui" | "">("");
  const [allergies, setAllergies] = useState("");

  const stepIndex = STEPS.indexOf(step);

  const canNext =
    (step === "name" && firstName.trim().length >= 2) ||
    (step === "gender" && gender !== "") ||
    (step === "age" && age !== "" && parseInt(age) > 0) ||
    (step === "allergies" && hasAllergies !== "" && (hasAllergies === "non" || allergies.trim().length > 0));

  const handleNext = () => {
    if (step === "allergies") {
      // Sauvegarder le profil et naviguer vers le questionnaire
      sessionStorage.setItem("silent_profile", JSON.stringify({
        first_name: firstName.trim(),
        gender,
        age,
        has_allergies: hasAllergies,
        ...(hasAllergies === "oui" ? { allergies: allergies.trim() } : {}),
      }));
      router.push("/silent/interaction");
    } else {
      setStep(STEPS[stepIndex + 1]);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-between px-4 pb-6 pt-1 max-w-xl mx-auto w-full min-h-0 relative z-10">

        {/* Progression */}
        <div className="w-full flex flex-col items-center gap-2 shrink-0 mt-16">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= stepIndex ? "bg-primary w-8" : "bg-primary/20 w-4"
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary/50 font-semibold">
            Étape {stepIndex + 1} / {STEPS.length}
          </p>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full gap-8">

          {/* ── Prénom ── */}
          {step === "name" && (
            <>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center text-primary">
                Quel est votre prénom ?
              </h2>
              <input
                autoFocus
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canNext && handleNext()}
                placeholder="Votre prénom..."
                maxLength={30}
                className="w-full max-w-sm text-center text-xl font-light px-5 py-3 rounded-full border-2 border-primary/20 bg-white/70 text-primary placeholder-primary/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </>
          )}

          {/* ── Genre ── */}
          {step === "gender" && (
            <>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center text-primary">
                Vous êtes ?
              </h2>
              <div className="flex gap-4 w-full max-w-sm">
                {(["femme", "homme"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 flex flex-col items-center gap-3 py-6 rounded-2xl border-2 transition-all duration-200 ${
                      gender === g
                        ? "border-primary bg-primary/5 scale-[1.03] shadow-lg shadow-primary/15"
                        : "border-primary/15 bg-white/60 hover:border-primary/30"
                    }`}
                  >
                    <MaterialIcon
                      name={g === "femme" ? "face_3" : "face"}
                      className={`text-5xl ${gender === g ? "text-primary" : "text-primary/40"}`}
                    />
                    <span className={`text-sm font-semibold capitalize tracking-wide ${gender === g ? "text-primary" : "text-primary/50"}`}>
                      {g === "femme" ? "Une femme" : "Un homme"}
                    </span>
                    {gender === g && (
                      <MaterialIcon name="check_circle" className="text-primary text-base" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Âge ── */}
          {step === "age" && (
            <>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center text-primary">
                Quel est votre âge ?
              </h2>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setAge((a) => String(Math.max(16, parseInt(a || "30") - 1)))}
                  className="size-12 flex items-center justify-center rounded-full border-2 border-primary/20 bg-white/70 text-primary hover:border-primary/40 transition-colors"
                >
                  <MaterialIcon name="remove" className="text-xl" />
                </button>
                <div className="size-24 flex items-center justify-center rounded-2xl border-2 border-primary/30 bg-white/80">
                  <span className="text-4xl font-extralight text-primary">{age || "–"}</span>
                </div>
                <button
                  onClick={() => setAge((a) => String(Math.min(99, parseInt(a || "30") + 1)))}
                  className="size-12 flex items-center justify-center rounded-full border-2 border-primary/20 bg-white/70 text-primary hover:border-primary/40 transition-colors"
                >
                  <MaterialIcon name="add" className="text-xl" />
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {[18, 25, 30, 35, 40, 45, 50, 55, 60].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(String(a))}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${
                      age === String(a)
                        ? "border-primary bg-primary text-white"
                        : "border-primary/15 bg-white/60 text-primary/60 hover:border-primary/30"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Allergies ── */}
          {step === "allergies" && (
            <>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center text-primary">
                Avez-vous des allergies ?
              </h2>
              <div className="flex gap-4 w-full max-w-sm">
                {(["non", "oui"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setHasAllergies(v)}
                    className={`flex-1 py-4 rounded-2xl border-2 text-sm font-semibold capitalize tracking-wide transition-all duration-200 ${
                      hasAllergies === v
                        ? "border-primary bg-primary/5 text-primary scale-[1.03] shadow-lg shadow-primary/15"
                        : "border-primary/15 bg-white/60 text-primary/50 hover:border-primary/30"
                    }`}
                  >
                    {v === "oui" ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
              {hasAllergies === "oui" && (
                <input
                  autoFocus
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Précisez vos allergies..."
                  className="w-full max-w-sm text-center text-base font-light px-5 py-3 rounded-full border-2 border-primary/20 bg-white/70 text-primary placeholder-primary/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
              )}
            </>
          )}
        </div>

        {/* Bouton suivant */}
        <div className="shrink-0 flex justify-center">
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            <span>{step === "allergies" ? "Commencer" : "Suivant"}</span>
            <MaterialIcon name={step === "allergies" ? "arrow_forward" : "arrow_forward"} className="text-base" />
          </button>
        </div>
      </main>

      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
