"use client";

import { useState, useEffect } from "react";
import CityCard from "./CityCard";
import { Choice, useSession } from "@/context/SessionContext";

interface CityGridProps {
  choices: Choice[];
}

export default function CityGrid({ choices }: CityGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { hiddenChoices } = useSession();

  // Reset selection when choices change (new question)
  useEffect(() => {
    setSelected(null);
  }, [choices]);

  const visibleChoices = choices.filter(
    (choice) => !hiddenChoices.includes(choice.label)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-5xl py-4 flex-1 min-h-0 max-h-[62vh] sm:max-h-[55vh]">
      {visibleChoices.map((choice) => (
        <CityCard
          key={choice.label}
          name={choice.label}
          imageUrl={choice.image ? `${process.env.NEXT_PUBLIC_API_URL}${choice.image}` : undefined}
          selected={selected === choice.label}
          onSelect={setSelected}
        />
      ))}
    </div>
  );
}
