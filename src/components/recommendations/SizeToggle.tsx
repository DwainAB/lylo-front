"use client";

import { useTranslation } from "@/i18n/LanguageContext";

export type SizeOption = "10ml" | "30ml" | "50ml";

interface SizeToggleProps {
  selected: SizeOption;
  onSelect: (size: SizeOption) => void;
}

const SIZES: SizeOption[] = ["10ml", "30ml", "50ml"];

export default function SizeToggle({ selected, onSelect }: SizeToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="shrink-0 mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-secondary/20 flex items-center justify-between">
      <span className="text-xs font-medium text-gray-400">
        {t("recommendations.selectSize")}
      </span>
      <div className="flex items-center gap-2">
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-3 py-1.5 [@media(max-height:680px)]:py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
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
