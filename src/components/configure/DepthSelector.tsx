"use client";

import MaterialIcon from "@/components/ui/MaterialIcon";

interface DepthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const depths = [
  { value: "1", label: "1", sublabel: "Quick" },
  { value: "4", label: "4", sublabel: "Standard" },
  { value: "12", label: "12", sublabel: "Deep" },
];

export default function DepthSelector({ value, onChange }: DepthSelectorProps) {
  return (
    <section>
      <h3 className="text-primary text-sm font-bold uppercase tracking-widest leading-tight mb-4 flex items-center gap-2">
        <MaterialIcon name="query_stats" className="text-base" />
        Depth of Analysis
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {depths.map((depth) => (
          <label key={depth.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="questions"
              value={depth.value}
              checked={value === depth.value}
              onChange={() => onChange(depth.value)}
              className="peer hidden"
            />
            <div className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border-2 border-primary/10 bg-white/50 text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <span className="text-sm font-bold">{depth.label}</span>
              <span className="text-[10px] uppercase font-medium opacity-80">
                {depth.sublabel}
              </span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
