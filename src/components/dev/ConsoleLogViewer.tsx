"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LogLevel = "log" | "warn" | "error";

interface LogEntry {
  id: number;
  level: LogLevel;
  time: string;
  text: string;
}

const MAX_ENTRIES = 300;

function formatArg(arg: unknown): string {
  if (typeof arg === "string") return arg;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

/**
 * Bouton flottant + modal qui affiche en direct les console.log/warn/error de la page.
 *
 * Diagnostic temporaire : utile pour débugger sur une tablette où on n'a pas facilement
 * accès aux DevTools (pas de câble USB / pas de Mac pour le débogage distant Safari).
 * À retirer une fois le diagnostic terminé.
 */
export default function ConsoleLogViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const original = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    const capture = (level: LogLevel) => (...args: unknown[]) => {
      original[level](...args);
      const text = args.map(formatArg).join(" ");
      idRef.current += 1;
      const entry: LogEntry = {
        id: idRef.current,
        level,
        time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
        text,
      };
      setEntries((prev) => {
        const next = [...prev, entry];
        return next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next;
      });
    };

    console.log = capture("log");
    console.warn = capture("warn");
    console.error = capture("error");

    return () => {
      console.log = original.log;
      console.warn = original.warn;
      console.error = original.error;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
  }, [entries, isOpen]);

  const clearLogs = () => setEntries([]);

  const levelColor: Record<LogLevel, string> = {
    log: "#9ca3af",
    warn: "#fbbf24",
    error: "#f87171",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] flex items-center gap-1.5 bg-black/80 backdrop-blur-sm text-white rounded-full px-3 py-2 shadow-xl border border-white/10 text-[11px] font-medium"
        aria-label="Voir les logs"
      >
        📋 Logs
        {entries.length > 0 && (
          <span className="bg-white/20 rounded-full px-1.5 text-[10px]">{entries.length}</span>
        )}
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex flex-col bg-black/95"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <span className="text-white text-sm font-bold uppercase tracking-widest">
                Console logs ({entries.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearLogs}
                  className="text-white/70 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20"
                >
                  Effacer
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
              {entries.length === 0 && (
                <p className="text-white/40 italic">Aucun log pour le moment...</p>
              )}
              {entries.map((entry) => (
                <div key={entry.id} className="mb-2 border-b border-white/5 pb-2">
                  <span className="text-white/30 mr-2">{entry.time}</span>
                  <span style={{ color: levelColor[entry.level] }} className="whitespace-pre-wrap break-all">
                    {entry.text}
                  </span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
