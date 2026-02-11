"use client";

import SizeToggle from "./SizeToggle";

interface NoteGroup {
  label: string;
  notes: string;
}

interface FormulaCardProps {
  name: string;
  noteGroups: NoteGroup[];
}

export default function FormulaCard({ name, noteGroups }: FormulaCardProps) {
  return (
    <div className="flex-1 bg-white border border-secondary/30 rounded-xl p-8 card-shadow flex flex-col transition-transform hover:scale-[1.02]">
      <h2 className="luxury-title text-xl text-primary mb-6 text-center">
        {name}
      </h2>

      <div className="space-y-4 flex-grow text-sm">
        {noteGroups.map((group) => (
          <div key={group.label}>
            <span className="brand-text text-[0.6rem] text-primary block mb-1">
              {group.label}
            </span>
            <p className="text-gray-600">{group.notes}</p>
          </div>
        ))}
      </div>

      <SizeToggle />
    </div>
  );
}
