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
  variant?: "default" | "comparison";
  className?: string;
}

const MAX_NOTES = 3;

function NoteList({
  label,
  notes,
  variant,
}: {
  label: string;
  notes: FormulaNote[];
  variant: "default" | "comparison";
}) {
  if (notes.length === 0) return null;
  const visible = notes.slice(0, MAX_NOTES);

  return (
    <section
      className={`min-w-0 rounded-lg border ${
        variant === "comparison"
          ? "border-primary/12 bg-[#fcfaf8] px-3 py-2.5"
          : "border-transparent"
      }`}
    >
      <span
        className={`brand-text text-primary block ${
          variant === "comparison"
            ? "mb-2 text-[0.62rem] sm:text-[0.68rem]"
            : "mb-0.5 text-[0.65rem] sm:text-xs"
        }`}
      >
        {label}
      </span>
      <ul className="space-y-0">
        {visible.map((note) => (
          <li
            key={note.name}
            className={`flex justify-between gap-3 min-w-0 ${
              variant === "comparison"
                ? "py-1 text-[#4f443e] border-b border-primary/8 last:border-b-0"
                : "text-gray-600"
            }`}
          >
            <span
              className={`min-w-0 truncate ${
                variant === "comparison" ? "text-sm sm:text-[0.95rem]" : "text-xs sm:text-sm"
              }`}
            >
              {note.name}
            </span>
            <span
              className={`shrink-0 font-medium ${
                variant === "comparison"
                  ? "text-primary text-sm sm:text-[0.95rem]"
                  : "text-primary/70 text-xs sm:text-sm"
              }`}
            >
              {note.ml} ml
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function FormulaCard({ name, sizes, variant = "default", className = "" }: FormulaCardProps) {
  const [selectedSize, setSelectedSize] = useState<SizeOption>("30ml");
  const { t } = useTranslation();
  const sizeData = sizes[selectedSize];
  const isComparison = variant === "comparison";

  return (
    <div
      className={`min-w-0 bg-white border rounded-xl card-shadow flex flex-col transition-transform hover:scale-[1.01] ${
        isComparison
          ? "border-primary/20 p-4 sm:p-5"
          : "border-secondary/30 p-2 sm:p-3"
      } ${className}`}
    >
      <div className={`${isComparison ? "mb-4 pb-3 border-b border-primary/10" : "mb-1 sm:mb-2"}`}>
        {isComparison && (
          <p className="brand-text text-[0.62rem] sm:text-[0.68rem] text-primary/70 text-center mb-2">
            Formule recommandee
          </p>
        )}
        <h2
          className={`luxury-title text-primary text-center shrink-0 ${
            isComparison ? "text-xl sm:text-2xl leading-tight" : "text-base sm:text-lg"
          }`}
        >
          {name}
        </h2>
      </div>

      <div
        className={`text-sm ${
          isComparison
            ? "flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3"
            : "flex flex-col gap-1 sm:gap-2"
        }`}
      >
        <NoteList
          label={t("recommendations.noteLabels.top")}
          notes={sizeData.top_notes}
          variant={variant}
        />
        <NoteList
          label={t("recommendations.noteLabels.heart")}
          notes={sizeData.heart_notes}
          variant={variant}
        />
        <NoteList
          label={t("recommendations.noteLabels.base")}
          notes={sizeData.base_notes}
          variant={variant}
        />
        <NoteList
          label={t("recommendations.noteLabels.boosters")}
          notes={sizeData.boosters}
          variant={variant}
        />
      </div>

      <SizeToggle selected={selectedSize} onSelect={setSelectedSize} />
    </div>
  );
}
