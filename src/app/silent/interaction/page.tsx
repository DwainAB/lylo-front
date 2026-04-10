"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import MaterialIcon from "@/components/ui/MaterialIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface Choice {
  label: string;
  image?: string;
}

interface Question {
  id: number;
  question: string;
  choices: Choice[];
}

type SelectionPhase = "top_2" | "bottom_2" | "done";

interface Answer {
  question_id: number;
  question_text: string;
  top_2: string[];
  bottom_2: string[];
}

export default function SilentInteractionPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<SelectionPhase>("top_2");
  const [top2, setTop2] = useState<string[]>([]);
  const [bottom2, setBottom2] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const language = typeof window !== "undefined"
    ? (localStorage.getItem("avatarLocale") || "fr")
    : "fr";
  const depth = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("depth") || "1", 10)
    : 1;

  // Charger les questions depuis l'API (même endpoint que les autres modes)
  useEffect(() => {
    async function load() {
      try {
        // On crée une session temporaire juste pour récupérer les questions enrichies
        const res = await fetch(`${API_BASE}/api/session/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            question_count: depth,
            mode: "silent",
            input_mode: "silent",
            voice_gender: localStorage.getItem("persona") || "female",
            avatar: false,
          }),
        });
        if (!res.ok) { router.replace("/"); return; }
        const data = await res.json();
        // Récupérer les questions avec images
        const sessionRes = await fetch(`${API_BASE}/api/session/${data.session_id}`);
        const sessionInfo = await sessionRes.json();
        setQuestions(sessionInfo.questions || []);
        // Stocker session_id temporaire pour le submit final
        sessionStorage.setItem("silent_session_id", data.session_id);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentQuestion = questions[qIndex];
  const totalSteps = questions.length;

  // Choix visibles selon la phase
  const hiddenInBottom = top2;
  const visibleChoices = phase === "bottom_2"
    ? (currentQuestion?.choices || []).filter(c => !hiddenInBottom.includes(c.label))
    : (currentQuestion?.choices || []);

  const selected = phase === "top_2" ? top2 : bottom2;
  const maxSelect = 2;

  const toggleChoice = (label: string) => {
    if (phase === "top_2") {
      setTop2(prev =>
        prev.includes(label)
          ? prev.filter(l => l !== label)
          : prev.length < maxSelect ? [...prev, label] : prev
      );
    } else {
      setBottom2(prev =>
        prev.includes(label)
          ? prev.filter(l => l !== label)
          : prev.length < maxSelect ? [...prev, label] : prev
      );
    }
  };

  const handleNext = async () => {
    if (phase === "top_2") {
      // Passer à la sélection bottom_2
      setPhase("bottom_2");
      setBottom2([]);
      return;
    }

    // Sauvegarder la réponse de cette question
    const newAnswer: Answer = {
      question_id: currentQuestion.id,
      question_text: currentQuestion.question,
      top_2: top2,
      bottom_2: bottom2,
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (qIndex + 1 < totalSteps) {
      // Question suivante
      setQIndex(i => i + 1);
      setPhase("top_2");
      setTop2([]);
      setBottom2([]);
    } else {
      // Toutes les questions répondues → soumettre
      await submit(newAnswers);
    }
  };

  const submit = async (allAnswers: Answer[]) => {
    setSubmitting(true);
    try {
      const profileRaw = sessionStorage.getItem("silent_profile");
      const profile = profileRaw ? JSON.parse(profileRaw) : {};
      const email = typeof window !== "undefined"
        ? (JSON.parse(localStorage.getItem("auth_user") || "{}").email || null)
        : null;

      const formulaType = localStorage.getItem("formula_type") || null;

      const res = await fetch(`${API_BASE}/api/session/silent-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          answers: allAnswers,
          language,
          formula_type: formulaType,
          email,
        }),
      });

      if (!res.ok) { setSubmitting(false); return; }
      const data = await res.json();

      // Stocker les résultats pour la page recommendations
      sessionStorage.setItem("silent_result", JSON.stringify({
        session_id: data.session_id,
        formulas: data.formulas,
      }));

      router.push("/silent/recommendations");
    } catch {
      setSubmitting(false);
    }
  };

  const canNext = selected.length === maxSelect;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="size-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm font-light text-primary/60 tracking-wide">Génération de vos formules...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-between px-4 pb-4 pt-1 max-w-5xl mx-auto w-full min-h-0 relative z-10">

        {/* En-tête : progression + question */}
        <div className="w-full flex flex-col items-center gap-2 shrink-0 mt-14 sm:mt-10">
          {/* Barre de progression */}
          <div className="flex items-center gap-2 w-full max-w-xs">
            <span className="text-[10px] text-primary/50 font-semibold tracking-widest uppercase shrink-0">
              {qIndex + 1} / {totalSteps}
            </span>
            <div className="flex-1 h-1.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((qIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Badge de phase */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all ${
            phase === "top_2"
              ? "bg-primary/10 text-primary"
              : "bg-rose-100 text-rose-500"
          }`}>
            <MaterialIcon
              name={phase === "top_2" ? "favorite" : "heart_broken"}
              className="text-xs"
            />
            {phase === "top_2" ? "Vos 2 préférés" : "Vos 2 moins aimés"}
          </div>

          {/* Question */}
          <h3 className="text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight">
            {phase === "top_2"
              ? currentQuestion?.question
              : "Et parmi les autres, lesquels vous attirent le moins ?"}
          </h3>
        </div>

        {/* Grille de choix */}
        <div className="relative w-full max-w-5xl flex-1 min-h-0 py-2">
          <div className={`grid gap-2 sm:gap-3 w-full h-full max-h-[52vh] ${
            visibleChoices.length <= 2
              ? "grid-cols-2 max-w-sm mx-auto"
              : "grid-cols-2 sm:grid-cols-3"
          }`}>
            {visibleChoices.map((choice) => {
              const isSelected = selected.includes(choice.label);
              const isMax = selected.length >= maxSelect && !isSelected;
              return (
                <button
                  key={choice.label}
                  onClick={() => !isMax && toggleChoice(choice.label)}
                  disabled={isMax}
                  className={`relative h-full min-h-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    isSelected
                      ? phase === "top_2"
                        ? "border-primary scale-[1.03] shadow-lg shadow-primary/20"
                        : "border-rose-400 scale-[1.03] shadow-lg shadow-rose-400/20"
                      : isMax
                      ? "border-transparent opacity-40 cursor-not-allowed"
                      : "border-transparent hover:border-primary/40 cursor-pointer"
                  }`}
                >
                  {/* Image */}
                  {choice.image ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700"
                      style={{ backgroundImage: `url('${API_BASE}${choice.image}')` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900" />
                  )}

                  {/* Overlay sélection */}
                  {isSelected && (
                    <div className={`absolute inset-0 ${
                      phase === "top_2" ? "bg-primary/20" : "bg-rose-400/20"
                    } flex items-center justify-center`}>
                      <div className={`size-8 rounded-full flex items-center justify-center ${
                        phase === "top_2" ? "bg-primary" : "bg-rose-400"
                      }`}>
                        <MaterialIcon name="check" className="text-white text-base" />
                      </div>
                    </div>
                  )}

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/30 backdrop-blur-sm py-2 sm:py-3 text-center">
                    <span className="text-white text-[10px] sm:text-xs tracking-widest uppercase font-semibold drop-shadow-md">
                      {choice.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bouton Suivant */}
        <div className="shrink-0 flex items-center gap-4 py-2">
          {/* Compteur de sélection */}
          <div className="flex gap-1.5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`size-2.5 rounded-full transition-all duration-300 ${
                  i < selected.length
                    ? phase === "top_2" ? "bg-primary" : "bg-rose-400"
                    : "bg-primary/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            <span>
              {phase === "top_2"
                ? "Continuer"
                : qIndex + 1 < totalSteps
                ? "Question suivante"
                : "Voir mes formules"}
            </span>
            <MaterialIcon
              name={phase === "top_2" || qIndex + 1 < totalSteps ? "arrow_forward" : "auto_awesome"}
              className="text-base"
            />
          </button>
        </div>
      </main>

      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
