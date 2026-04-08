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
  const { hiddenChoices, clickSelectionMode, submitClickAnswer, questionnaireStepData } = useSession();

  const { step, currentChoice, top2, bottom2 } = questionnaireStepData;

  // Reset selection when choices change (new question)
  useEffect(() => {
    setSelected(null);
    setClickSelected([]);
  }, [choices]);

  // Reset click selection when mode changes
  useEffect(() => {
    console.warn("🟢 [CLICK MODE] clickSelectionMode changé →", clickSelectionMode, "| cartes cliquables:", clickSelectionMode !== null);
    if (clickSelectionMode === null) {
      setClickSelected([]);
    }
  }, [clickSelectionMode]);

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  // ── Quelles cartes afficher selon l'étape ────────────────────────────────
  let visibleChoices: Choice[];

  if (step === "justification_top_1" || step === "justification_top_2") {
    // Afficher uniquement le choix dont on parle
    const focus = currentChoice;
    visibleChoices = focus
      ? choices.filter((c) => normalize(c.label) === normalize(focus))
      : choices;
  } else if (step === "asking_bottom_2" || step === "justification_bottom_1" || step === "justification_bottom_2") {
    // Exclure les 2 favoris (déjà cachés via hiddenChoices), mais aussi exclure si on est en justif
    if (step === "justification_bottom_1" || step === "justification_bottom_2") {
      const focus = currentChoice;
      visibleChoices = focus
        ? choices.filter((c) => normalize(c.label) === normalize(focus))
        : choices.filter((c) => !top2.some((h) => normalize(h) === normalize(c.label)));
    } else {
      // asking_bottom_2 : montrer les 4 restants (sans les top_2)
      visibleChoices = choices.filter(
        (c) => !top2.some((h) => normalize(h) === normalize(c.label))
      );
    }
  } else if (step === "awaiting_confirmation") {
    // Afficher les 4 choix retenus (top2 + bottom2)
    const retained = [...top2, ...bottom2];
    visibleChoices = choices.filter((c) =>
      retained.some((h) => normalize(h) === normalize(c.label))
    );
  } else {
    // État par défaut (asking_top_2 ou null) : toutes les cartes sauf hiddenChoices
    visibleChoices = choices.filter(
      (c) => !hiddenChoices.some((h) => normalize(h) === normalize(c.label))
    );
  }

  // Envoyer quand 2 cartes sélectionnées (click mode)
  useEffect(() => {
    if (clickSelected.length === 2) {
      submitClickAnswer(clickSelected);
      setClickSelected([]);
    }
  }, [clickSelected, submitClickAnswer]);

  const handleCardSelect = (label: string) => {
    if (clickSelectionMode !== null) {
      setClickSelected((prev) => {
        if (prev.includes(label)) return prev.filter((l) => l !== label);
        return [...prev, label];
      });
    } else {
      setSelected(label);
    }
  };

  // ── Highlight selon l'étape ──────────────────────────────────────────────
  const getCardHighlight = (label: string): "favorite" | "disliked" | "selected" | "none" => {
    if (step === "awaiting_confirmation") {
      if (top2.some((h) => normalize(h) === normalize(label))) return "favorite";
      if (bottom2.some((h) => normalize(h) === normalize(label))) return "disliked";
    }
    if (
      (step === "justification_top_1" || step === "justification_top_2") &&
      currentChoice && normalize(currentChoice) === normalize(label)
    ) return "favorite";
    if (
      (step === "justification_bottom_1" || step === "justification_bottom_2") &&
      currentChoice && normalize(currentChoice) === normalize(label)
    ) return "disliked";
    if (clickSelectionMode !== null && clickSelected.includes(label)) return "selected";
    if (clickSelectionMode === null && selected === label) return "selected";
    return "none";
  };

  // ── Vue intensité ─────────────────────────────────────────────────────────
  if (step === "asking_intensity") {
    const options = [
      { label: "Frais & Léger", icon: "❄️", description: "Aérien, discret, vivifiant" },
      { label: "Mix", icon: "⚖️", description: "Équilibré, polyvalent" },
      { label: "Puissant & Intense", icon: "🔥", description: "Affirmé, enveloppant, mémorable" },
    ];
    return (
      <div className="w-full max-w-2xl flex-1 min-h-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
          {options.map((opt) => (
            <div
              key={opt.label}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-primary/20 bg-white/60 backdrop-blur-sm p-4 sm:p-6"
            >
              <span className="text-3xl sm:text-4xl">{opt.icon}</span>
              <span className="text-xs sm:text-sm font-semibold text-center text-primary tracking-wide">{opt.label}</span>
              <span className="text-[10px] sm:text-xs text-center text-[#9a8880] font-light">{opt.description}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Vue confirmation : 2 colonnes avec headers ───────────────────────────
  if (step === "awaiting_confirmation") {
    const top2Choices = choices.filter((c) => top2.some((h) => normalize(h) === normalize(c.label)));
    const bottom2Choices = choices.filter((c) => bottom2.some((h) => normalize(h) === normalize(c.label)));

    return (
      <div className="w-full max-w-3xl flex-1 min-h-0 flex gap-4 sm:gap-6 py-2">
        {/* Colonne coups de cœur */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary text-center shrink-0">
            Coups de cœur
          </p>
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 sm:gap-3 max-h-[44vh]">
            {top2Choices.map((choice) => (
              <ChoiceCard
                key={choice.label}
                name={choice.label}
                imageUrl={choice.image ? `${process.env.NEXT_PUBLIC_API_URL}${choice.image}` : undefined}
                highlight="favorite"
                clickable={false}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="w-px bg-primary/15 shrink-0 self-stretch my-6" />

        {/* Colonne moins aimés */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 text-center shrink-0">
            Moins aimés
          </p>
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 sm:gap-3 max-h-[44vh]">
            {bottom2Choices.map((choice) => (
              <ChoiceCard
                key={choice.label}
                name={choice.label}
                imageUrl={choice.image ? `${process.env.NEXT_PUBLIC_API_URL}${choice.image}` : undefined}
                highlight="disliked"
                clickable={false}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Vue normale ───────────────────────────────────────────────────────────
  return (
    <div className="relative w-full max-w-5xl flex-1 min-h-0">
      <div className={`grid gap-2 sm:gap-3 w-full py-2 h-full max-h-[52vh] sm:max-h-[48vh] ${
        visibleChoices.length === 1
          ? "grid-cols-1 max-w-xs mx-auto"
          : visibleChoices.length === 2
          ? "grid-cols-2 max-w-sm mx-auto"
          : "grid-cols-2 sm:grid-cols-3"
      }`}>
        {visibleChoices.map((choice) => {
          const highlight = getCardHighlight(choice.label);
          return (
            <ChoiceCard
              key={choice.label}
              name={choice.label}
              imageUrl={choice.image ? `${process.env.NEXT_PUBLIC_API_URL}${choice.image}` : undefined}
              highlight={highlight}
              clickable={false}
              onSelect={handleCardSelect}
            />
          );
        })}
      </div>
    </div>
  );
}