"use client";

import { useId } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

interface SizeToggleProps {
  onToggle?: (is50ml: boolean) => void;
}

export default function SizeToggle({ onToggle }: SizeToggleProps) {
  const id = useId();
  const { t } = useTranslation();

  return (
    <div className="mt-8 pt-6 border-t border-secondary/20 flex items-center justify-between">
      <span className="text-xs font-medium text-gray-400">{t("recommendations.selectSize")}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-500">30ml</span>
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            id={id}
            onChange={(e) => onToggle?.(e.target.checked)}
            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-secondary outline-none"
          />
          <label
            htmlFor={id}
            className="toggle-label block overflow-hidden h-5 rounded-full bg-secondary cursor-pointer"
          />
        </div>
        <span className="text-xs font-bold text-gray-500">50ml</span>
      </div>
    </div>
  );
}
