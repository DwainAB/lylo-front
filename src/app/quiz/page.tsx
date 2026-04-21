"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChoiceCard from "@/components/interaction/ChoiceCard";
import AnswerConfirmation from "@/components/interaction/AnswerConfirmation";
import StepProgress from "@/components/interaction/StepProgress";
import GeneratingLoader from "@/components/livekit/GeneratingLoader";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface QuestionChoice { label: string; image?: string; }
interface Question { id: number; question: string; choices: QuestionChoice[]; }
interface QuizAnswer { question_id: number; question_text: string; top_2: string[]; bottom_2: string[]; }
interface Profile { gender: "homme" | "femme" | ""; age: string; pregnant: boolean | null; has_allergies: boolean | null; allergies: string; }

type Step = "profile" | "questionnaire";
type Phase = "top2" | "bottom2" | "confirm";
type ProfileStep = "gender" | "age" | "pregnant" | "allergies" | "allergies_detail";

function BigButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-4 rounded-xl border-2 text-base font-semibold transition-all
        ${selected
          ? "border-primary bg-primary text-white shadow-lg scale-[1.02]"
          : "border-primary/15 bg-white/60 text-primary/70 hover:border-primary/40 hover:bg-primary/5"
        }`}
    >
      {label}
    </button>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>("profile");
  const [profileStep, setProfileStep] = useState<ProfileStep>("gender");
  const [profile, setProfile] = useState<Profile>({
    gender: "", age: "", pregnant: null, has_allergies: null, allergies: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("top2");
  const [top2, setTop2] = useState<string[]>([]);
  const [bottom2, setBottom2] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const language = typeof window !== "undefined" ? localStorage.getItem("language") ?? "fr" : "fr";
  const depth = typeof window !== "undefined" ? localStorage.getItem("depth") ?? "12" : "12";
  const questionCount = parseInt(depth) || 12;

  useEffect(() => {
    if (step !== "questionnaire") return;
    setLoading(true);
    fetch(`${API_BASE}/api/questions?count=${questionCount}&language=${language}`)
      .then((r) => { if (!r.ok) throw new Error("Erreur chargement"); return r.json(); })
      .then((data) => setQuestions(Array.isArray(data) ? data : data.questions ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [step]);

  // ── Navigation profil ────────────────────────────────────────────────────
  const advanceProfile = useCallback((updates: Partial<Profile>) => {
    const next = { ...profile, ...updates };
    setProfile(next);

    if (profileStep === "gender") {
      setProfileStep("age");
    } else if (profileStep === "age") {
      setProfileStep(next.gender === "femme" ? "pregnant" : "allergies");
    } else if (profileStep === "pregnant") {
      setProfileStep("allergies");
    } else if (profileStep === "allergies") {
      if (updates.has_allergies === true) setProfileStep("allergies_detail");
      else setStep("questionnaire");
    } else if (profileStep === "allergies_detail") {
      setStep("questionnaire");
    }
  }, [profile, profileStep]);

  // ── Questionnaire ────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];

  const handleTopSelect = useCallback((label: string) => {
    setTop2((prev) => {
      if (prev.includes(label)) return prev.filter((l) => l !== label);
      if (prev.length >= 2) return prev;
      return [...prev, label];
    });
  }, []);

  const handleBottomSelect = useCallback((label: string) => {
    setBottom2((prev) => {
      if (prev.includes(label)) return prev.filter((l) => l !== label);
      if (prev.length >= 2) return prev;
      return [...prev, label];
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!currentQuestion) return;
    const allLabels = currentQuestion.choices.map((c) => c.label);
    const remaining = allLabels.filter((l) => !top2.includes(l) && !bottom2.includes(l));
    const answer: QuizAnswer = {
      question_id: currentQuestion.id,
      question_text: currentQuestion.question,
      top_2: top2,
      bottom_2: bottom2.length === 2 ? bottom2 : [...bottom2, ...remaining].slice(0, 2),
    };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setPhase("top2"); setTop2([]); setBottom2([]);
    } else {
      submitAnswers(newAnswers);
    }
  }, [currentQuestion, top2, bottom2, answers, currentIndex, questions.length]);

  const submitAnswers = async (finalAnswers: QuizAnswer[]) => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/formulas/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          gender: profile.gender,
          age: profile.age,
          has_allergies: profile.has_allergies ? "oui" : "non",
          allergies: profile.allergies || undefined,
          pregnant: profile.pregnant ?? false,
          answers: finalAnswers,
        }),
      });
      if (!res.ok) throw new Error("Erreur génération");
      const data = await res.json();
      localStorage.setItem("quiz_formulas", JSON.stringify(data.formulas ?? []));
      router.push("/quiz/results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setGenerating(false);
    }
  };

  if (generating) return <GeneratingLoader />;
  if (error) return (
    <div className="relative h-dvh w-full flex flex-col bg-stone-50">
      <Navbar showActions={false} transparent />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-500 text-sm text-center">{error}</p>
        <button onClick={() => router.push("/configure")} className="text-primary text-sm underline">{t("quiz.back")}</button>
      </main>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // PROFIL — une question à la fois
  // ══════════════════════════════════════════════════════════════════════
  if (step === "profile") {
    const profileSteps: ProfileStep[] = ["gender", "age", "pregnant", "allergies", "allergies_detail"];
    const visibleSteps = profileSteps.filter((s) => {
      if (s === "pregnant" && profile.gender !== "femme") return false;
      if (s === "allergies_detail" && !profile.has_allergies) return false;
      return true;
    });
    const currentProfileIndex = visibleSteps.indexOf(profileStep);
    const totalProfileSteps = visibleSteps.length;

    return (
      <div className="relative flex h-dvh w-full flex-col">
        <Navbar showActions={false} transparent />

        <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          <div className="w-full max-w-lg flex flex-col items-center gap-8">

            {/* Progress */}
            <StepProgress currentStep={currentProfileIndex + 1} totalSteps={totalProfileSteps} />

            {/* Question genre */}
            {profileStep === "gender" && (
              <div className="w-full flex flex-col items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center leading-tight">
                  {t("quiz.profileGenderQuestion")}
                </h2>
                <div className="flex gap-4 w-full max-w-xs">
                  <BigButton label={t("quiz.profileMale")} selected={profile.gender === "homme"} onClick={() => advanceProfile({ gender: "homme", pregnant: false })} />
                  <BigButton label={t("quiz.profileFemale")} selected={profile.gender === "femme"} onClick={() => advanceProfile({ gender: "femme" })} />
                </div>
              </div>
            )}

            {/* Question âge */}
            {profileStep === "age" && (
              <div className="w-full flex flex-col items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center leading-tight">
                  {t("quiz.profileAgeQuestion")}
                </h2>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 border-primary/15 bg-white/60 w-full max-w-xs">
                  <MaterialIcon name="cake" className="text-primary text-[20px] shrink-0" />
                  <input
                    type="number"
                    min={10} max={110}
                    value={profile.age}
                    onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && profile.age.trim() && advanceProfile({})}
                    placeholder={t("quiz.profileAgePlaceholder")}
                    autoFocus
                    className="flex-1 bg-transparent text-base font-medium text-primary placeholder:text-primary/35 outline-none"
                  />
                </div>
                <button
                  disabled={!profile.age.trim()}
                  onClick={() => advanceProfile({})}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-lg shadow-xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {t("quiz.continue")} <MaterialIcon name="arrow_forward" />
                </button>
              </div>
            )}

            {/* Question enceinte */}
            {profileStep === "pregnant" && (
              <div className="w-full flex flex-col items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center leading-tight">
                  {t("quiz.profilePregnantQuestion")}
                </h2>
                <div className="flex gap-4 w-full max-w-xs">
                  <BigButton label={t("quiz.yes")} selected={profile.pregnant === true} onClick={() => advanceProfile({ pregnant: true })} />
                  <BigButton label={t("quiz.no")} selected={profile.pregnant === false} onClick={() => advanceProfile({ pregnant: false })} />
                </div>
              </div>
            )}

            {/* Question allergies */}
            {profileStep === "allergies" && (
              <div className="w-full flex flex-col items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center leading-tight">
                  {t("quiz.profileAllergiesQuestion")}
                </h2>
                <div className="flex gap-4 w-full max-w-xs">
                  <BigButton label={t("quiz.yes")} selected={profile.has_allergies === true} onClick={() => advanceProfile({ has_allergies: true })} />
                  <BigButton label={t("quiz.no")} selected={profile.has_allergies === false} onClick={() => advanceProfile({ has_allergies: false })} />
                </div>
              </div>
            )}

            {/* Détail allergies */}
            {profileStep === "allergies_detail" && (
              <div className="w-full flex flex-col items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-center leading-tight">
                  {t("quiz.profileAllergiesDetailQuestion")}
                </h2>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 border-primary/15 bg-white/60 w-full max-w-xs">
                  <MaterialIcon name="warning" className="text-primary text-[20px] shrink-0" />
                  <input
                    type="text"
                    value={profile.allergies}
                    onChange={(e) => setProfile((p) => ({ ...p, allergies: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && profile.allergies.trim() && advanceProfile({})}
                    placeholder={t("quiz.profileAllergiesPlaceholder")}
                    autoFocus
                    className="flex-1 bg-transparent text-base font-medium text-primary placeholder:text-primary/35 outline-none"
                  />
                </div>
                <button
                  disabled={!profile.allergies.trim()}
                  onClick={() => advanceProfile({})}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-lg shadow-xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {t("quiz.continue")} <MaterialIcon name="arrow_forward" />
                </button>
              </div>
            )}

            {/* Retour */}
            {currentProfileIndex > 0 && (
              <button
                onClick={() => setProfileStep(visibleSteps[currentProfileIndex - 1])}
                className="text-primary/40 text-xs hover:text-primary transition-colors flex items-center gap-1"
              >
                <MaterialIcon name="arrow_back" className="text-[14px]" />
                {t("quiz.back")}
              </button>
            )}
          </div>
        </main>

        <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
        <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // QUESTIONNAIRE
  // ══════════════════════════════════════════════════════════════════════
  if (loading) return (
    <div className="relative h-dvh w-full flex flex-col bg-stone-50">
      <Navbar showActions={false} transparent />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="size-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-primary/60 text-sm font-medium">{t("quiz.loading")}</p>
      </main>
    </div>
  );

  const visibleChoices = phase === "bottom2"
    ? currentQuestion?.choices.filter((c) => !top2.includes(c.label)) ?? []
    : currentQuestion?.choices ?? [];
  const selected = phase === "top2" ? top2 : phase === "bottom2" ? bottom2 : [];
  const phaseHint = phase === "top2" ? t("quiz.hintTop2") : phase === "bottom2" ? t("quiz.hintBottom2") : "";

  return (
    <div className="relative flex h-dvh w-full flex-col">
      <Navbar showActions={false} transparent />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-4 pt-1 max-w-6xl mx-auto w-full min-h-0 relative z-10">
        <div className="w-full flex flex-col items-center gap-2 shrink-0">
          <StepProgress currentStep={currentIndex + 1} totalSteps={questions.length} />
          <h3 className="text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight">
            {currentQuestion?.question}
          </h3>
          {phaseHint && <p className="text-xs text-primary/40 tracking-widest uppercase">{phaseHint}</p>}
        </div>

        {phase === "confirm" ? (
          <AnswerConfirmation
            top2={top2.map((label) => ({ label, image: currentQuestion?.choices.find((c) => c.label === label)?.image ? `${API_BASE}${currentQuestion.choices.find((c) => c.label === label)!.image}` : undefined }))}
            bottom2={bottom2.map((label) => ({ label, image: currentQuestion?.choices.find((c) => c.label === label)?.image ? `${API_BASE}${currentQuestion.choices.find((c) => c.label === label)!.image}` : undefined }))}
          />
        ) : (
          <div className="relative w-full max-w-5xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full" style={{ height: "42vh" }}>
              {visibleChoices.map((choice) => (
                <ChoiceCard key={choice.label} name={choice.label}
                  imageUrl={choice.image ? `${API_BASE}${choice.image}` : undefined}
                  selected={selected.includes(choice.label)} clickable
                  onSelect={phase === "top2" ? handleTopSelect : handleBottomSelect}
                />
              ))}
            </div>
          </div>
        )}

        <div className="shrink-0 py-3 flex justify-center">
          {phase === "top2" && (
            <button disabled={top2.length < 2} onClick={() => setPhase("bottom2")}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-lg shadow-xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
              {t("quiz.continue")}
            </button>
          )}
          {phase === "bottom2" && (
            <button disabled={bottom2.length < 2} onClick={() => setPhase("confirm")}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-lg shadow-xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
              {t("quiz.continue")}
            </button>
          )}
          {phase === "confirm" && (
            <button onClick={handleConfirm}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-lg shadow-xl transition-all hover:scale-[1.02]">
              {currentIndex + 1 < questions.length ? t("quiz.next") : t("quiz.submit")}
            </button>
          )}
        </div>
      </main>
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
