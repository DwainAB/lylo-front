"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";
import { useConnectionTest, ConnectionVerdict } from "@/hooks/useConnectionTest";

const VERDICT_CONFIG: Record<ConnectionVerdict, {
  color: string; bg: string; border: string; icon: string; iconColor: string;
}> = {
  good:     { color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: "check_circle",  iconColor: "text-green-500"  },
  degraded: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: "warning",       iconColor: "text-orange-400" },
  poor:     { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: "error",         iconColor: "text-red-400"    },
};

export default function ConnectionTest() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { status, pingProgress, result, run, reset } = useConnectionTest();

  const handleOpen = () => {
    setIsOpen(true);
    run();
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const handleRetry = () => {
    reset();
    setTimeout(run, 50);
  };

  const verdict = result?.verdict;
  const cfg = verdict ? VERDICT_CONFIG[verdict] : null;

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-primary/15 brand-surface-softer hover:bg-primary/5 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <MaterialIcon name="network_check" className="text-primary text-[18px]" />
          <span className="text-xs font-semibold text-primary">{t("preparation.connTest")}</span>
        </div>
        <MaterialIcon name="chevron_right" className="text-primary/40 text-[18px] group-hover:text-primary/70 transition-colors" />
      </button>

      {/* ── Modal ── */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-light/75 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="glass-panel w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-primary/10">
              <div className="flex items-center gap-2.5">
                <MaterialIcon name="network_check" className="text-primary text-xl" />
                <h2 className="font-bold text-primary tracking-widest uppercase text-xs">
                  {t("preparation.connModalTitle")}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center justify-center size-7 rounded-full text-primary/55 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <MaterialIcon name="close" className="text-[18px]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* ── Phase: pinging ── */}
              {status === "pinging" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-primary/55 uppercase tracking-widest">{t("preparation.connPhaseLatency")}</p>
                    <span className="text-[11px] font-semibold text-primary tabular-nums">{pingProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${pingProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-primary/50">{t("preparation.connPhasePingDesc")}</p>
                </div>
              )}

              {/* ── Phase: downloading ── */}
              {status === "downloading" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full border-2 border-primary/25 border-t-primary animate-spin shrink-0" />
                    <p className="text-sm text-primary">{t("preparation.connPhaseDownload")}</p>
                  </div>
                  <p className="text-[10px] text-primary/50">{t("preparation.connPhaseDownloadDesc")}</p>
                </div>
              )}

              {/* ── Error ── */}
              {status === "error" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200">
                    <MaterialIcon name="error" className="text-red-400 text-xl shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{t("preparation.connError")}</p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:brightness-110 transition-all"
                  >
                    {t("preparation.connRetry")}
                  </button>
                </div>
              )}

              {/* ── Done ── */}
              {status === "done" && result && cfg && (
                <div className="space-y-4">

                  {/* Verdict */}
                  <div className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                    <MaterialIcon name={cfg.icon} className={`${cfg.iconColor} text-2xl shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-sm font-bold ${cfg.color}`}>
                        {t(`preparation.connVerdict_${verdict}`)}
                      </p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${cfg.color} opacity-80`}>
                        {t(`preparation.connVerdictSub_${verdict}`)}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="brand-surface-soft rounded-xl p-3 border border-primary/10">
                      <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-1">{t("preparation.connDownload")}</p>
                      <p className="text-base font-bold text-primary tabular-nums leading-none">
                        {result.downloadMbps}
                      </p>
                      <p className="text-[9px] text-primary/40 mt-0.5">Mbps</p>
                    </div>
                    <div className="brand-surface-soft rounded-xl p-3 border border-primary/10">
                      <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-1">{t("preparation.connLatency")}</p>
                      <p className="text-base font-bold text-primary tabular-nums leading-none">
                        {result.avgLatency}
                      </p>
                      <p className="text-[9px] text-primary/40 mt-0.5">ms</p>
                    </div>
                    <div className="brand-surface-soft rounded-xl p-3 border border-primary/10">
                      <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-1">{t("preparation.connLoss")}</p>
                      <p className="text-base font-bold text-primary tabular-nums leading-none">
                        {result.packetLoss}
                      </p>
                      <p className="text-[9px] text-primary/40 mt-0.5">%</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleRetry}
                      className="text-[11px] text-primary/50 hover:text-primary transition-colors underline underline-offset-2"
                    >
                      {t("preparation.connRetry")}
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:brightness-110 transition-all shadow-md shadow-primary/20"
                    >
                      {t("preparation.connClose")}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
