"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AvatarSection from "@/components/interaction/AvatarSection";
import AnswerButton from "@/components/interaction/AnswerButton";
import FormulaCard from "@/components/recommendations/FormulaCard";
import { useTranslation } from "@/i18n/LanguageContext";

const ROSE_AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCIjXIXxFHeF0IZ1fGfF2SkT_DOMGHF13GvAeKVjmEc8d7kEFrp1ptpN8bbF0db9LBI1sIhbzIh37IBuhGgu8ZRENOJDESI2ePdufvyAlrVNWDpVTgMkYVhXmEqQLCEddI6bB_3rJ45Dk2SO_H5TgxI3We52-1o2yMu4ZU-i5j0LlIyejnZpqCaHNNFZo_FrU-ITbryhbGUg6pMd7I_N6ZNRxWJYotXb4-lH9Ci63Or4mGQjZ-6370Y4X3R6U3pDewybfy73SRyO4c";

export default function RecommendationsPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const formulas = [
    {
      key: "mysticBloom",
      name: t("recommendations.formulas.mysticBloom.name"),
      noteGroups: [
        { label: t("recommendations.noteLabels.top"), notes: t("recommendations.formulas.mysticBloom.top") },
        { label: t("recommendations.noteLabels.heart"), notes: t("recommendations.formulas.mysticBloom.heart") },
        { label: t("recommendations.noteLabels.base"), notes: t("recommendations.formulas.mysticBloom.base") },
      ],
    },
    {
      key: "citrusElegance",
      name: t("recommendations.formulas.citrusElegance.name"),
      noteGroups: [
        { label: t("recommendations.noteLabels.top"), notes: t("recommendations.formulas.citrusElegance.top") },
        { label: t("recommendations.noteLabels.heart"), notes: t("recommendations.formulas.citrusElegance.heart") },
        { label: t("recommendations.noteLabels.base"), notes: t("recommendations.formulas.citrusElegance.base") },
      ],
    },
  ];

  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-2 max-w-6xl mx-auto w-full min-h-0 relative z-10">
        {/* Avatar + Title section */}
        <div className="w-full flex flex-col items-center gap-2 shrink-0 mt-12">
          <AvatarSection
            name=""
            role=""
            imageUrl={ROSE_AVATAR_URL}
          />
          <h3 className="text-3xl md:text-4xl font-extralight tracking-tight text-center max-w-2xl leading-tight mt-4">
            {t("recommendations.title")}
          </h3>
        </div>

        {/* Formula cards */}
        <div className="flex flex-row gap-6 w-full max-w-5xl justify-center">
          {formulas.map((formula) => (
            <FormulaCard
              key={formula.key}
              name={formula.name}
              noteGroups={formula.noteGroups}
            />
          ))}
        </div>

        {/* Bottom controls */}
        <div className="w-full flex flex-col items-center gap-6 shrink-0 pt-4">
          <div className="flex flex-col items-center gap-2">
            <AnswerButton />
          </div>
          <button onClick={() => router.push("/")} className="text-gray-400 brand-text text-[0.7rem] hover:text-primary transition-colors cursor-pointer">
            {t("recommendations.returnHome")}
          </button>
        </div>
      </main>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
