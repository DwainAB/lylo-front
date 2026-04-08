"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

const FONT_HEADLINE = "'Plus Jakarta Sans', sans-serif";

type Size = "10ml" | "30ml" | "50ml";

interface FormulaNote { name: string; ml: number }
interface SizeData { top_notes: FormulaNote[]; heart_notes: FormulaNote[]; base_notes: FormulaNote[] }

const MOCK_FORMULA: { name: string; sizes: Record<Size, SizeData> } = {
  name: "Ta Magie Douce",
  sizes: {
    "10ml": {
      top_notes:   [{ name: "Bergamote", ml: 2 }, { name: "Citron vert", ml: 1 }],
      heart_notes: [{ name: "Rose",      ml: 2.5 }, { name: "Jasmin",    ml: 1.5 }],
      base_notes:  [{ name: "Vanille",   ml: 2 }, { name: "Musc blanc",  ml: 1 }],
    },
    "30ml": {
      top_notes:   [{ name: "Bergamote", ml: 6 }, { name: "Citron vert", ml: 3 }],
      heart_notes: [{ name: "Rose",      ml: 7.5 }, { name: "Jasmin",   ml: 4.5 }],
      base_notes:  [{ name: "Vanille",   ml: 6 }, { name: "Musc blanc",  ml: 3 }],
    },
    "50ml": {
      top_notes:   [{ name: "Bergamote", ml: 10 }, { name: "Citron vert", ml: 5 }],
      heart_notes: [{ name: "Rose",      ml: 12.5 }, { name: "Jasmin",   ml: 7.5 }],
      base_notes:  [{ name: "Vanille",   ml: 10 }, { name: "Musc blanc", ml: 5 }],
    },
  },
};

const SECTIONS = [
  {
    key: "top_notes" as const,
    label: "Premières notes",
    icon: "air",
    bg: "linear-gradient(135deg,#FFF7ED,#FFEDD5)",
    text: "#EA580C",
    border: "#FDBA74",
    iconColor: "#EA580C",
  },
  {
    key: "heart_notes" as const,
    label: "Cœur de ta formule",
    icon: "favorite",
    fill: true,
    bg: "linear-gradient(135deg,#FDF2F8,#FCE7F3)",
    text: "#EC4899",
    border: "#F9A8D4",
    iconColor: "#EC4899",
  },
  {
    key: "base_notes" as const,
    label: "Notes de fond",
    icon: "spa",
    bg: "linear-gradient(135deg,#F5F3FF,#EDE9FE)",
    text: "#7C3AED",
    border: "#C4B5FD",
    iconColor: "#7C3AED",
  },
];

export default function ChildRecommendationsPage() {
  const router = useRouter();
  const [size, setSize] = useState<Size>("30ml");
  const sizeData = MOCK_FORMULA.sizes[size];

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        backgroundColor: "#FFF9E6",
        backgroundImage: "radial-gradient(circle at 2px 2px, #FFEB99 1px, transparent 0)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* Décorations flottantes */}
      {([
        { icon: "star",         color: "#FF6B6B", cls: "top-20 left-[5%]",     delay: "0s",   size: "text-5xl" },
        { icon: "auto_awesome", color: "#4ECDC4", cls: "top-36 right-[8%]",    delay: "1s",   size: "text-4xl" },
        { icon: "bubble_chart", color: "#FFD93D", cls: "bottom-16 left-[8%]",  delay: "0.5s", size: "text-5xl" },
        { icon: "favorite",     color: "#FF6B6B", cls: "bottom-32 right-[5%]", delay: "1.5s", size: "text-4xl", fill: true },
      ] as { icon: string; color: string; cls: string; delay: string; size: string; fill?: boolean }[]).map(({ icon, color, cls, delay, size: sz, fill }) => (
        <div key={icon} className={`fixed ${cls} opacity-30 pointer-events-none`}
          style={{ animation: "child-floating 3s ease-in-out infinite", animationDelay: delay }}>
          <span className={`material-symbols-outlined ${sz}`}
            style={{ color, ...(fill ? { fontVariationSettings: '"FILL" 1' } : {}) }}>
            {icon}
          </span>
        </div>
      ))}

      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-4 pt-1 max-w-6xl mx-auto w-full min-h-0 relative z-10">

        {/* ── Haut : badge + barre pleine + titre ── */}
        <div className="w-full flex flex-col items-center gap-1 shrink-0 mt-16 sm:mt-14">
          <div className="flex items-center gap-2 mb-1" style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, fontSize: "0.85rem", color: "#FF6B6B" }}>
            <span className="material-symbols-outlined text-lg p-0.5 rounded-md text-white" style={{ backgroundColor: "#FF6B6B", fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
            <span>Ta formule est prête !</span>
          </div>
          <div className="w-full max-w-xs h-3 bg-white rounded-full overflow-hidden mb-1" style={{ border: "2px solid #FFD3D3" }}>
            <div className="h-full rounded-full progress-water" style={{ width: "100%" }} />
          </div>
          <h3 className="text-2xl md:text-3xl font-extralight tracking-tight text-center max-w-2xl leading-tight"
            style={{ fontFamily: FONT_HEADLINE, color: "#51311c" }}>
            {MOCK_FORMULA.name}
          </h3>
        </div>

        {/* ── Milieu : sélecteur de taille + cartes de notes ── */}
        <div className="relative w-full max-w-5xl flex-1 min-h-0 flex flex-col gap-2 py-2" style={{ maxHeight: "52vh" }}>

          {/* Sélecteur de taille */}
          <div className="flex justify-center gap-2 shrink-0">
            {(["10ml", "30ml", "50ml"] as Size[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="transition-all duration-150 active:scale-90"
                style={{
                  padding: "0.25rem 1rem",
                  borderRadius: "9999px",
                  fontFamily: FONT_HEADLINE,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  border: "2px solid",
                  borderColor: size === s ? "#FF6B6B" : "rgba(255,107,107,0.2)",
                  backgroundColor: size === s ? "#FF6B6B" : "rgba(255,255,255,0.7)",
                  color: size === s ? "white" : "#FF6B6B",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Grille des 3 sections de notes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1 min-h-0 max-h-[48vh] sm:max-h-[44vh]">
            {SECTIONS.map((section) => {
              const notes = sizeData[section.key];
              return (
                <div
                  key={section.key}
                  className="h-full min-h-0 rounded-2xl overflow-hidden relative flex flex-col"
                  style={{ background: section.bg }}
                >
                  {/* Contenu */}
                  <div className="flex-1 min-h-0 flex flex-col gap-1.5 p-2 sm:p-3 pb-10 overflow-y-auto">
                    {/* Icône section */}
                    <div className="flex justify-center mb-1 shrink-0">
                      <span
                        className="material-symbols-outlined text-3xl opacity-20"
                        style={{ color: section.iconColor, ...(section.fill ? { fontVariationSettings: '"FILL" 1' } : {}) }}
                      >
                        {section.icon}
                      </span>
                    </div>
                    {/* Liste des notes */}
                    {notes.map((note) => (
                      <div
                        key={note.name}
                        className="flex items-center justify-between gap-1"
                      >
                        <span
                          className="text-[10px] sm:text-xs font-bold leading-tight"
                          style={{ fontFamily: FONT_HEADLINE, color: section.text }}
                        >
                          {note.name}
                        </span>
                        <span
                          className="text-[10px] sm:text-xs font-black shrink-0 px-1.5 py-0.5 rounded-full"
                          style={{
                            fontFamily: FONT_HEADLINE,
                            backgroundColor: `${section.iconColor}22`,
                            color: section.text,
                          }}
                        >
                          {note.ml}ml
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Label bas — même style que les cartes de sélection */}
                  <div
                    className="absolute bottom-0 left-0 right-0 py-2 sm:py-3 text-center"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.35)",
                      backdropFilter: "blur(6px)",
                      borderBottom: `3px solid ${section.border}`,
                    }}
                  >
                    <span
                      className="text-[9px] sm:text-[10px] tracking-widest uppercase font-black drop-shadow-sm"
                      style={{ fontFamily: FONT_HEADLINE, color: section.text }}
                    >
                      {section.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bas : bouton retour ── */}
        <div className="flex justify-center shrink-0 py-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
            style={{
              fontFamily: FONT_HEADLINE,
              background: "linear-gradient(135deg,#FF6B6B,#FF8E8E)",
              boxShadow: "0 8px 24px -4px rgba(255,107,107,0.5)",
            }}
          >
            <span>Retour à l&apos;accueil</span>
            <span className="material-symbols-outlined text-base">home</span>
          </button>
        </div>
      </main>
    </div>
  );
}
