"use client";

import type { MouseEvent } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

export type SizeOption = "10ml" | "30ml" | "50ml";

interface SizeToggleProps {
  selected: SizeOption;
  onSelect: (size: SizeOption) => void;
}

const SIZES: SizeOption[] = ["10ml", "30ml", "50ml"];

export default function SizeToggle({ selected, onSelect }: SizeToggleProps) {
  const { t } = useTranslation();
  const handleSelect = (event: MouseEvent<HTMLButtonElement>, size: SizeOption) => {
    event.stopPropagation();
    onSelect(size);
  };

  return (
    <div
      className="shrink-0 mt-2 pt-2 sm:mt-4 sm:pt-4 border-t border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <span className="text-[0.6rem] sm:text-xs font-medium text-gray-400 shrink-0">
        {t("recommendations.selectSize")}
      </span>
      <div className="flex items-center gap-0.5 sm:gap-2">
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={(event) => handleSelect(event, size)}
            className={`px-1 sm:px-3 py-0.5 sm:py-1.5 [@media(max-height:680px)]:py-1 rounded-full text-[0.6rem] sm:text-xs font-bold transition-colors cursor-pointer ${
              selected === size
                ? "bg-primary text-white"
                : "bg-secondary/10 text-gray-500 hover:bg-secondary/20"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
