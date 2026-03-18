"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AvatarSection from "@/components/interaction/AvatarSection";
import StepProgress from "@/components/interaction/StepProgress";
import SpeakingIndicator from "@/components/interaction/SpeakingIndicator";
import CityGrid from "@/components/interaction/CityGrid";
import GeneratingLoader from "@/components/livekit/GeneratingLoader";
import { useTranslation } from "@/i18n/LanguageContext";
import { useSession, DEV_MODE } from "@/context/SessionContext";

export default function InteractionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sessionState, answers, questionCount, questions, currentQuestionIndex } = useSession();

  // Navigate when state changes
  useEffect(() => {
    if (DEV_MODE) return;
    if (sessionState === "completed") {
      router.push("/recommendations");
    }
  }, [sessionState, router]);

  const currentStep = currentQuestionIndex + 1;
  const totalSteps = questionCount || 4;
  const currentQuestion = questions[currentQuestionIndex];

  const persona = typeof window !== "undefined" ? localStorage.getItem("persona") : null;
  const avatarUrl = persona === "male" ? "/avatar-h.jpg" : "/avatar-f.jpg";

  // Show generating loader overlay
  if (sessionState === "generating_formulas") {
    return <GeneratingLoader />;
  }

  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar showActions={false} transparent />

      {/* Bouton retour accueil */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-6 z-50 flex items-center gap-1.5 text-primary/50 hover:text-primary text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Accueil
      </button>

      <main className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-2 max-w-6xl mx-auto w-full min-h-0 relative z-10">
        {/* Avatar + Question section */}
        <div className="w-full flex flex-col items-center gap-2 shrink-0 mt-16 sm:mt-12">
          <AvatarSection
            name=""
            role=""
            imageUrl={avatarUrl}
          />
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          <h3 className="text-3xl md:text-4xl font-extralight tracking-tight text-center max-w-2xl leading-tight">
            {currentQuestion?.question || t("interaction.waiting")}
          </h3>
        </div>

        {/* Choice selection grid */}
        <CityGrid choices={currentQuestion?.choices || []} />

        {/* Bottom controls */}
        <div className="w-full flex flex-col items-center gap-6 shrink-0 pt-4">
          <SpeakingIndicator />
        </div>
      </main>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
