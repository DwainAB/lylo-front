"use client";

import { useState, useEffect } from "react";
import ChoiceCard from "./ChoiceCard";
import { Choice, useSession } from "@/context/SessionContext";

interface ChoiceGridProps {
  choices: Choice[];
}

export default function ChoiceGrid({ choices }: ChoiceGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [clickSelected, setClickSelected] = useState<string[]>([]);
  const { hiddenChoices, clickSelectionMode, submitClickAnswer } = useSession();

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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full py-4 h-full max-h-[62vh] sm:max-h-[55vh]">
        {visibleChoices.map((choice) => (
          <ChoiceCard
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
