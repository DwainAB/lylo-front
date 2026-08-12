"use client";

import { useTranslation } from "@/i18n/LanguageContext";

interface CatalogFormulaCardProps {
  brand: string;
  name: string;
  family?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  matchReason?: string;
  imageUrl?: string;
  variant?: "default" | "comparison";
  className?: string;
}

function NoteList({ label, notes }: { label: string; notes: string[] }) {
  if (!notes || notes.length === 0) return null;
  return (
    <section className="min-w-0 rounded-lg border border-primary/12 brand-surface-softer px-1.5 sm:px-3 py-1 sm:py-2.5">
      <span className="brand-text text-primary block mb-0.5 sm:mb-2 text-[0.55rem] sm:text-[0.68rem]">
        {label}
      </span>
      <ul className="space-y-0">
        {notes.map((note) => (
          <li
            key={note}
            className="py-0.5 sm:py-1 text-surface border-b border-primary/8 last:border-b-0 text-xs sm:text-[0.95rem] truncate"
          >
            {note}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CatalogFormulaCard({
  brand,
  name,
  family,
  topNotes = [],
  heartNotes = [],
  baseNotes = [],
  matchReason,
  imageUrl,
  variant = "default",
  className = "",
}: CatalogFormulaCardProps) {
  const { t } = useTranslation();
  const isComparison = variant === "comparison";

  return (
    <div
      className={`min-w-0 brand-surface border rounded-xl card-shadow flex flex-col transition-transform hover:scale-[1.01] overflow-hidden ${
        isComparison ? "border-primary/20 max-h-[560px] sm:max-h-[620px]" : "border-secondary/30"
      } ${className}`}
    >
      {imageUrl && (
        <div className="w-full aspect-square max-h-24 sm:max-h-none shrink-0 bg-black/5 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={`${brand} — ${name}`} className="w-full h-full object-contain" loading="lazy" />
        </div>
      )}
      <div className={`min-h-0 flex flex-col flex-1 ${isComparison ? "p-1.5 sm:p-4" : "p-2 sm:p-3"}`}>
        <div className={`shrink-0 ${isComparison ? "mb-1.5 sm:mb-3 pb-1.5 sm:pb-2.5 border-b border-primary/10" : "mb-1 sm:mb-2"}`}>
          {isComparison && (
            <p className="brand-text text-[0.55rem] sm:text-[0.68rem] text-primary/70 text-center mb-1 sm:mb-2">
              {brand}
            </p>
          )}
          <h2
            className={`luxury-title text-center shrink-0 ${
              isComparison ? "text-xs sm:text-xl leading-tight" : "text-base sm:text-lg"
            }`}
            style={{ color: "#fff" }}
          >
            {name}
          </h2>
          {family && (
            <p className="text-center text-[0.6rem] sm:text-[0.7rem] text-primary/50 mt-0.5 sm:mt-1">{family}</p>
          )}
        </div>

        <div
          className={`text-sm ${
            isComparison
              ? "flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1 sm:gap-2"
              : "flex flex-col gap-1 sm:gap-2"
          }`}
        >
          {matchReason && (
            <p className="text-[0.65rem] sm:text-sm text-surface opacity-80 italic mb-1">{matchReason}</p>
          )}
          <NoteList label={t("recommendations.noteLabels.top")} notes={topNotes} />
          <NoteList label={t("recommendations.noteLabels.heart")} notes={heartNotes} />
          <NoteList label={t("recommendations.noteLabels.base")} notes={baseNotes} />
        </div>
      </div>
    </div>
  );
}
