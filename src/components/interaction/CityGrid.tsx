"use client";

import { useState, useEffect } from "react";
import CityCard from "./CityCard";
import { Choice, useSession } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";

interface CityGridProps {
  choices: Choice[];
}

export default function CityGrid({ choices }: CityGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [clickSelected, setClickSelected] = useState<string[]>([]);
  const { hiddenChoices, clickSelectionMode, submitClickAnswer } = useSession();
  const { t } = useTranslation();

  // Reset selection when choices change (new question)
  useEffect(() => {
    setSelected(null);
    setClickSelected([]);
  }, [choices]);

  // Log + reset click selection when mode changes
  useEffect(() => {
    console.warn("🟢 [CLICK MODE] clickSelectionMode changé →", clickSelectionMode, "| cartes cliquables:", clickSelectionMode !== null);
    if (clickSelectionMode === null) {
      setClickSelected([]);
    }
  }, [clickSelectionMode]);

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const visibleChoices = choices.filter(
    (choice) => !hiddenChoices.some((h) => normalize(h) === normalize(choice.label))
  );

  // Quand 2 cartes sont sélectionnées, on envoie la réponse (dans un effect pour éviter setState pendant render)
  useEffect(() => {
    if (clickSelected.length === 2) {
      submitClickAnswer(clickSelected);
      setClickSelected([]);
    }
  }, [clickSelected, submitClickAnswer]);

  const handleCardSelect = (label: string) => {
    if (clickSelectionMode !== null) {
      // Mode clic : sélection multiple jusqu'à 2
      setClickSelected((prev) => {
        if (prev.includes(label)) return prev.filter((l) => l !== label);
        return [...prev, label];
      });
    } else {
      // Mode voix : sélection visuelle simple (pas d'action)
      setSelected(label);
    }
  };

  return (
    <div className="relative w-full max-w-5xl flex-1 min-h-0">
      {clickSelectionMode !== null && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full bg-primary text-white text-[11px] font-semibold tracking-wide shadow-md whitespace-nowrap">
          {t("interaction.clickSelectHint")} ({clickSelected.length}/2)
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full py-4 h-full max-h-[62vh] sm:max-h-[55vh]">
        {visibleChoices.map((choice) => (
          <CityCard
            key={choice.label}
            name={choice.label}
            imageUrl={choice.image ? `${process.env.NEXT_PUBLIC_API_URL}${choice.image}` : undefined}
            selected={
              clickSelectionMode !== null
                ? clickSelected.includes(choice.label)
                : selected === choice.label
            }
            clickable={clickSelectionMode !== null}
            onSelect={handleCardSelect}
          />
        ))}
      </div>
    </div>
  );
}
