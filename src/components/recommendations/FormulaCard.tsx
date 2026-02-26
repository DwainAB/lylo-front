"use client";

import { useState } from "react";
import SizeToggle, { SizeOption } from "./SizeToggle";
import { FormulaSize, FormulaNote } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";

interface FormulaCardProps {
  name: string;
  sizes: {
    "10ml": FormulaSize;
    "30ml": FormulaSize;
    "50ml": FormulaSize;
  };
}

const MAX_NOTES = 3;

function NoteList({ label, notes }: { label: string; notes: FormulaNote[] }) {
  if (notes.length === 0) return null;
  const visible = notes.slice(0, MAX_NOTES);

  return (
    <div className="min-w-0">
      <span className="brand-text text-[0.65rem] sm:text-xs text-primary block mb-0.5">
        {label}
      </span>
      <ul className="space-y-0">
        {visible.map((note) => (
          <li key={note.name} className="flex justify-between gap-1 text-gray-600 min-w-0">
            <span className="truncate text-xs sm:text-sm">{note.name}</span>
            <span className="font-medium text-primary/70 shrink-0 text-xs sm:text-sm">{note.ml} ml</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FormulaCard({ name, sizes }: FormulaCardProps) {
  const [selectedSize, setSelectedSize] = useState<SizeOption>("30ml");
  const { t } = useTranslation();
  const sizeData = sizes[selectedSize];

  return (
    /*
      flex-1 min-h-0 : la carte prend toute la hauteur disponible et peut se comprimer.
      flex flex-col   : empilement vertical titre → notes → SizeToggle.
      overflow-hidden : rien ne peut dépasser hors de la carte.
    */
    <div className="flex-1 min-h-0 min-w-0 bg-white border border-secondary/30 rounded-xl p-2 sm:p-3 card-shadow flex flex-col overflow-hidden transition-transform hover:scale-[1.01]">
      <h2 className="luxury-title text-base sm:text-lg text-primary mb-1 sm:mb-2 text-center shrink-0">
        {name}
      </h2>

      {/*
        flex-1 min-h-0 overflow-hidden : la zone des notes prend tout l'espace restant
        entre le titre et le SizeToggle, et coupe proprement si le contenu dépasse.
      */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1 sm:gap-2 text-sm">
        <NoteList label={t("recommendations.noteLabels.top")} notes={sizeData.top_notes} />
        <NoteList label={t("recommendations.noteLabels.heart")} notes={sizeData.heart_notes} />
        <NoteList label={t("recommendations.noteLabels.base")} notes={sizeData.base_notes} />
        <NoteList label={t("recommendations.noteLabels.boosters")} notes={sizeData.boosters} />
      </div>

      <SizeToggle selected={selectedSize} onSelect={setSelectedSize} />
    </div>
  );
}
