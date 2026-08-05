"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

type MicState = "idle" | "requesting" | "active" | "error";

// slider 0–100 → gain 0–2 (50 = unity 1.0×)
const sliderToGain = (v: number) => v / 50;

interface MicCalibratorProps {
  variant?: "light" | "dark";
}

export default function MicCalibrator({ variant = "light" }: MicCalibratorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  const [errorKey, setErrorKey] = useState("preparation.micError");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [sliderValue, setSliderValue] = useState(50); // 0–100, center = 100% gain

  // Audio refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  // Preserved across re-renders so the slider can update gain without re-creating audio pipeline
  const sliderRef = useRef(50);

  // DOM refs for direct animation (no React re-render at 60fps)
  const levelFillRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLParagraphElement | null>(null);
  // Idle color read from the active brand's CSS variable so it follows theme switches
  const idleColorRef = useRef("#d4c9c3");

  useEffect(() => {
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim();
    if (primary) idleColorRef.current = `${primary}66`;
  }, []);

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    gainNodeRef.current = null;
    analyserRef.current = null;
    if (levelFillRef.current) {
      levelFillRef.current.style.width = "0%";
      levelFillRef.current.style.backgroundColor = idleColorRef.current;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const handleClose = useCallback(() => {
    cleanup();
    setMicState("idle");
    setIsOpen(false);
  }, [cleanup]);

  const startTest = useCallback(
    async (deviceId?: string) => {
      cleanup();
      setMicState("requesting");
      try {
        const audioConstraint: MediaTrackConstraints | boolean = deviceId
          ? { deviceId: { exact: deviceId } }
          : true;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraint,
        });
        streamRef.current = stream;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);

        // Gain node — controlled by the slider in real time
        const gainNode = ctx.createGain();
        gainNode.gain.value = sliderToGain(sliderRef.current);
        gainNodeRef.current = gainNode;

        // Analyser reads the signal after gain
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.75;
        analyserRef.current = analyser;

        source.connect(gainNode);
        gainNode.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const silentText = t("preparation.micSilent");
        const goodText = t("preparation.micGood");
        const loudText = t("preparation.micLoud");

        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          const level = Math.min(avg / 70, 1);

          if (levelFillRef.current) {
            levelFillRef.current.style.width = `${level * 100}%`;
            levelFillRef.current.style.backgroundColor =
              level < 0.05 ? idleColorRef.current : level < 0.65 ? "#22c55e" : "#fb923c";
          }
          if (statusRef.current) {
            if (level < 0.05) {
              statusRef.current.textContent = silentText;
              statusRef.current.style.color = idleColorRef.current;
            } else if (level < 0.65) {
              statusRef.current.textContent = goodText;
              statusRef.current.style.color = "#16a34a";
            } else {
              statusRef.current.textContent = loudText;
              statusRef.current.style.color = "#ea580c";
            }
          }

          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter((d) => d.kind === "audioinput"));
        setMicState("active");
      } catch (err: unknown) {
        cleanup();
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            setErrorKey("preparation.micDenied");
          } else if (err.name === "NotFoundError") {
            setErrorKey("preparation.micNotFound");
          } else {
            setErrorKey("preparation.micError");
          }
        }
        setMicState("error");
      }
    },
    [cleanup, t]
  );

  const stopTest = useCallback(() => {
    cleanup();
    setMicState("idle");
  }, [cleanup]);

  const handleDeviceChange = useCallback(
    (deviceId: string) => {
      setSelectedDevice(deviceId);
      startTest(deviceId);
    },
    [startTest]
  );

  const handleSliderChange = useCallback((value: number) => {
    sliderRef.current = value;
    setSliderValue(value);
    // Update gain in real time without restarting the pipeline
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = sliderToGain(value);
    }
  }, []);

  // Display: 0–100 slider → "0% … 200%" (100% = unity)
  const gainPercent = Math.round(sliderToGain(sliderValue) * 100);

  return (
    <>
      {/* Trigger button — temporarily hidden */}
      <button
        onClick={() => setIsOpen(true)}
        title={t("preparation.micTitle")}
        className={`hidden flex items-center justify-center size-9 rounded-full backdrop-blur-sm transition-all duration-200 ${
          variant === "dark"
            ? "border border-white/25 bg-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40"
            : "border border-primary/20 brand-surface-soft text-primary/55 hover:text-primary hover:bg-primary/10 hover:border-primary/40"
        }`}
      >
        <MaterialIcon name="settings" className="text-[20px]" />
      </button>

      {/* Modal — rendered via portal to escape the navbar's backdrop-filter stacking context */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-light/75 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="glass-panel w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-primary/10">
              <div className="flex items-center gap-2.5">
                <MaterialIcon name="tune" className="text-primary text-xl" />
                <h2 className="font-bold text-primary tracking-widest uppercase text-xs">
                  {t("preparation.micTitle")}
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
              {/* Device selector — shown when multiple mics detected */}
              {devices.length > 1 && (
                <div>
                  <p className="text-[10px] text-primary/55 uppercase tracking-widest mb-1.5">
                    {t("preparation.micDevice")}
                  </p>
                  <div className="flex items-center gap-2 brand-surface-soft border border-primary/15 rounded-xl px-3 py-2">
                    <MaterialIcon
                      name="settings_input_component"
                      className="text-primary/50 text-base shrink-0"
                    />
                    <select
                      value={selectedDevice}
                      onChange={(e) => handleDeviceChange(e.target.value)}
                      className="flex-1 min-w-0 text-xs text-primary/55 bg-transparent focus:outline-none"
                    >
                      {devices.map((d, i) => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label || `${t("preparation.micDevice")} ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ── Combined gain slider + level meter ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-primary/55 uppercase tracking-widest">
                    {t("preparation.micLevel")}
                  </p>
                  <span className="text-[11px] font-semibold text-primary tabular-nums">
                    {gainPercent}%
                  </span>
                </div>

                {/* The bar: track + level fill + range thumb all stacked */}
                <div className="relative flex items-center h-6">
                  {/* Track background */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-primary/10" />

                  {/* Level fill — animated via DOM ref */}
                  <div
                    ref={levelFillRef}
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-3 rounded-full pointer-events-none"
                    style={{
                      width: "0%",
                      backgroundColor: "#d4c9c3",
                      transition: "width 75ms ease, background-color 150ms ease",
                    }}
                  />

                  {/* Custom visible thumb — positioned from slider value */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 size-[22px] rounded-full bg-white border-2 border-primary shadow-[0_1px_6px_rgba(var(--brand-primary-rgb),0.35)] pointer-events-none z-20"
                    style={{
                      left: `calc(${sliderValue}% - ${(sliderValue / 100) * 22}px)`,
                    }}
                  />

                  {/* Native range input — fully transparent, sits on top to capture all interaction */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                </div>

                {/* Min / Max labels */}
                <div className="flex justify-between mt-1.5 px-0.5">
                  <span className="text-[10px] text-primary/40">
                    {t("preparation.micMin")}
                  </span>
                  <span className="text-[10px] text-primary/40">
                    {t("preparation.micMax")}
                  </span>
                </div>

                {/* Status text — visible only when test is active */}
                <p
                  ref={statusRef}
                  className={`text-xs font-medium mt-2 h-4 ${
                    micState === "active" ? "" : "invisible"
                  }`}
                  style={{ color: idleColorRef.current }}
                >
                  {t("preparation.micSilent")}
                </p>
              </div>

              {/* — Idle — */}
              {micState === "idle" && (
                <button
                  onClick={() => startTest()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  <MaterialIcon name="mic" className="text-sm" />
                  {t("preparation.micTest")}
                </button>
              )}

              {/* — Requesting — */}
              {micState === "requesting" && (
                <div className="flex items-center justify-center gap-3 py-1">
                  <div className="size-5 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
                  <p className="text-sm text-primary">
                    {t("preparation.micRequesting")}
                  </p>
                </div>
              )}

              {/* — Active — */}
              {micState === "active" && (
                <button
                  onClick={stopTest}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider rounded-full hover:bg-primary/5 transition-colors"
                >
                  <MaterialIcon name="stop_circle" className="text-sm" />
                  {t("preparation.micStop")}
                </button>
              )}

              {/* — Error — */}
              {micState === "error" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50 border border-orange-200">
                    <MaterialIcon
                      name="mic_off"
                      className="text-orange-400 text-xl shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-orange-700 leading-relaxed">
                      {t(errorKey)}
                    </p>
                  </div>
                  <button
                    onClick={() => setMicState("idle")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                  >
                    {t("preparation.micRetry")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        , document.body
      )}
    </>
  );
}
