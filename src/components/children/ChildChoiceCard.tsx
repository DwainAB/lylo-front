"use client";

import { CARD_COLORS, Choice } from "@/data/childrenQuestions";

const FONT_HEADLINE = "'Plus Jakarta Sans', sans-serif";

export type CardMode = "top" | "bottom" | "liked" | "disliked";

interface ChildChoiceCardProps {
  choice: Choice;
  cardIndex: number;
  mode: CardMode;
  selected?: boolean;
  onClick?: () => void;
}

export default function ChildChoiceCard({ choice, cardIndex, mode, selected = false, onClick }: ChildChoiceCardProps) {
  const colors = CARD_COLORS[cardIndex % CARD_COLORS.length];
  const isSelectable = mode === "top" || mode === "bottom";
  const isLiked     = mode === "liked";
  const isDisliked  = mode === "disliked";

  const showIcon  = isLiked || isDisliked || (isSelectable && selected);
  const iconName  = isDisliked || (mode === "bottom" && selected) ? "cancel" : "favorite";
  const iconColor = isDisliked ? "#9CA3AF" : mode === "bottom" && selected ? "#6B7280" : "#FF4D4D";

  const outlineColor = isLiked || selected ? "#FFEDBC" : isDisliked ? "#E5E7EB" : "transparent";
  const labelBg      = selected || isLiked ? "rgba(255,237,188,0.7)" : isDisliked ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.30)";
  const labelBorder  = selected || isLiked ? "#FFD93D" : isDisliked ? "#E5E7EB" : colors.border;
  const labelColor   = isDisliked ? "#9CA3AF" : "white";

  const inner = (
    <>
      {showIcon && (
        <div className={`absolute top-2 right-2 z-20 ${isSelectable ? "animate-bounce" : ""}`}>
          <span
            className="material-symbols-outlined text-3xl drop-shadow"
            style={{ color: iconColor, fontVariationSettings: '"FILL" 1' }}
          >
            {iconName}
          </span>
        </div>
      )}

      {choice.image ? (
        <div
          className={`w-full h-full bg-cover bg-center transition-transform duration-700 ${isSelectable ? "group-hover:scale-110" : ""} ${isDisliked ? "grayscale-[40%]" : ""}`}
          style={{ backgroundImage: `url('${choice.image}')` }}
        />
      ) : choice.color ? (
        <div
          className={`w-full h-full ${isDisliked ? "opacity-60" : ""}`}
          style={{ background: `radial-gradient(circle at 35% 35%, ${choice.color}bb, ${choice.color})` }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: isDisliked ? "linear-gradient(135deg,#F9FAFB,#F3F4F6)" : colors.bg }}
        >
          <span
            className="text-2xl font-black uppercase tracking-widest opacity-30"
            style={{ fontFamily: FONT_HEADLINE, color: colors.text }}
          >
            {choice.label.slice(0, 2)}
          </span>
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 py-2 sm:py-3 text-center"
        style={{ backgroundColor: labelBg, backdropFilter: "blur(6px)", borderBottom: `3px solid ${labelBorder}` }}
      >
        <span
          className="text-[10px] sm:text-xs tracking-widest uppercase font-black drop-shadow-sm"
          style={{ fontFamily: FONT_HEADLINE, color: labelColor }}
        >
          {choice.label}
        </span>
      </div>
    </>
  );

  const sharedStyle: React.CSSProperties = {
    outline: `4px solid ${outlineColor}`,
    opacity: isDisliked ? 0.8 : 1,
    transform: selected ? "scale(1.03)" : undefined,
    boxShadow: selected || isLiked ? "0 8px 24px -4px rgba(255,107,107,0.35)" : undefined,
  };

  const sharedClass = "h-full min-h-0 rounded-2xl overflow-hidden relative group transition-all duration-300";

  if (isSelectable) {
    return (
      <button onClick={onClick} className={sharedClass} style={{ ...sharedStyle, cursor: "pointer" }}>
        {inner}
      </button>
    );
  }

  return (
    <div className={sharedClass} style={sharedStyle}>
      {inner}
    </div>
  );
}
