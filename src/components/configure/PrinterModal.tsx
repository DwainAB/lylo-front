"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface Printer {
  location: string;
  [key: string]: unknown;
}

interface Props {
  onClose: () => void;
  onSelect: (location: string) => void;
  selected: string;
}

export default function PrinterModal({ onClose, onSelect, selected }: Props) {
  const { t } = useTranslation();
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const res = await fetch(`${API_BASE}/printers/`);
        if (!res.ok) throw new Error();
        const printers: Printer[] = await res.json();
        const unique = [...new Set(printers.map((p) => p.location))];
        setLocations(unique);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPrinters();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel w-full max-w-sm mx-4 rounded-xl shadow-2xl border border-primary/10 p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MaterialIcon name="print" className="text-primary text-[20px]" />
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">
              {t("printerModal.title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-primary/40 hover:text-primary transition-colors"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <p className="text-[11px] text-primary/60 font-medium">
          {t("printerModal.description")}
        </p>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="size-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs py-2">
            <MaterialIcon name="error" className="text-[16px]" />
            {t("printerModal.loadError")}
          </div>
        )}

        {!loading && !error && locations.length === 0 && (
          <p className="text-xs text-primary/50 text-center py-4">
            {t("printerModal.noPrinters")}
          </p>
        )}

        {!loading && !error && locations.length > 0 && (
          <div className="space-y-2">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => onSelect(loc)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  selected === loc
                    ? "bg-primary text-white border-primary shadow-md"
                    : "brand-surface-softer text-primary border-primary/15 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MaterialIcon
                    name="location_on"
                    className="text-[16px]"
                  />
                  <span className="capitalize">{loc}</span>
                </div>
                {selected === loc && (
                  <MaterialIcon name="check" className="text-[16px]" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Confirm */}
        <button
          onClick={onClose}
          disabled={!selected}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all text-sm"
        >
          {t("printerModal.confirm")}
        </button>
      </div>
    </div>
  );
}
