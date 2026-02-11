"use client";

import MaterialIcon from "@/components/ui/MaterialIcon";

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const personas = [
  { value: "male", label: "Male", icon: "male" },
  { value: "female", label: "Female", icon: "female" },
];

export default function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  return (
    <section>
      <h3 className="text-primary text-sm font-bold uppercase tracking-widest leading-tight mb-4 flex items-center gap-2">
        <MaterialIcon name="psychology" className="text-base" />
        AI Persona selection
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {personas.map((persona) => (
          <label key={persona.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={persona.value}
              checked={value === persona.value}
              onChange={() => onChange(persona.value)}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg border-2 border-primary/10 bg-white/50 text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <MaterialIcon name={persona.icon} />
              <span className="text-sm font-bold">{persona.label}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
