"use client";

interface CatalogFormulaCardProps {
  brand: string;
  name: string;
  family?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  matchReason?: string;
  variant?: "default" | "comparison";
  className?: string;
}

function NoteList({ label, notes }: { label: string; notes: string[] }) {
  if (!notes || notes.length === 0) return null;
  return (
    <section className="min-w-0 rounded-lg border border-primary/12 bg-[#fcfaf8] px-3 py-2.5">
      <span className="brand-text text-primary block mb-2 text-[0.62rem] sm:text-[0.68rem]">
        {label}
      </span>
      <ul className="space-y-0">
        {notes.map((note) => (
          <li
            key={note}
            className="py-1 text-[#4f443e] border-b border-primary/8 last:border-b-0 text-sm sm:text-[0.95rem]"
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
  variant = "default",
  className = "",
}: CatalogFormulaCardProps) {
  const isComparison = variant === "comparison";

  return (
    <div
      className={`min-w-0 bg-white border rounded-xl card-shadow flex flex-col transition-transform hover:scale-[1.01] ${
        isComparison ? "border-primary/20 p-3 sm:p-4" : "border-secondary/30 p-2 sm:p-3"
      } ${className}`}
    >
      <div className={`${isComparison ? "mb-3 pb-2.5 border-b border-primary/10" : "mb-1 sm:mb-2"}`}>
        {isComparison && (
          <p className="brand-text text-[0.62rem] sm:text-[0.68rem] text-primary/70 text-center mb-2">
            {brand}
          </p>
        )}
        <h2
          className={`luxury-title text-primary text-center shrink-0 ${
            isComparison ? "text-lg sm:text-xl leading-tight" : "text-base sm:text-lg"
          }`}
        >
          {name}
        </h2>
        {family && (
          <p className="text-center text-[0.7rem] text-primary/50 mt-1">{family}</p>
        )}
      </div>

      <div
        className={`text-sm ${
          isComparison
            ? "flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2"
            : "flex flex-col gap-1 sm:gap-2"
        }`}
      >
        {matchReason && (
          <p className="text-xs sm:text-sm text-[#4f443e] italic mb-1">{matchReason}</p>
        )}
        <NoteList label="Notes de tête" notes={topNotes} />
        <NoteList label="Notes de cœur" notes={heartNotes} />
        <NoteList label="Notes de fond" notes={baseNotes} />
      </div>
    </div>
  );
}
