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

function NoteList({ label, notes }: { label: string; notes: FormulaNote[] }) {
  if (notes.length === 0) return null;

  return (
    <div>
      <span className="brand-text text-xs sm:text-[0.6rem] text-primary block mb-1">
        {label}
      </span>
      <ul className="space-y-0.5">
        {notes.map((note) => (
          <li key={note.name} className="flex justify-between text-gray-600">
            <span>{note.name}</span>
            <span className="font-medium text-primary/70">{note.ml} ml</span>
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
    <div className="flex-1 bg-white border border-secondary/30 rounded-xl p-4 sm:p-6 md:p-8 card-shadow flex flex-col transition-transform hover:scale-[1.02] min-w-0">
      <h2 className="luxury-title text-xl text-primary mb-6 text-center">
        {name}
      </h2>

      <div className="space-y-4 flex-grow text-sm">
        <NoteList label={t("recommendations.noteLabels.top")} notes={sizeData.top_notes} />
        <NoteList label={t("recommendations.noteLabels.heart")} notes={sizeData.heart_notes} />
        <NoteList label={t("recommendations.noteLabels.base")} notes={sizeData.base_notes} />
        <NoteList label={t("recommendations.noteLabels.boosters")} notes={sizeData.boosters} />
      </div>

      <SizeToggle selected={selectedSize} onSelect={setSelectedSize} />
    </div>
  );
}
