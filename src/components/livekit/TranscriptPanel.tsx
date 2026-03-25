"use client";

import { useRef, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";

interface TranscriptPanelProps {
  open: boolean;
  onToggle: () => void;
}

export default function TranscriptPanel({ open, onToggle }: TranscriptPanelProps) {
  const { transcripts, agentName } = useSession();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, open]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[85vw] sm:w-80 z-40 transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full glass-panel border-l border-primary/10 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-primary/10 shrink-0 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {t("transcript.title")}
          </h3>
          <button
            onClick={onToggle}
            className="size-7 flex items-center justify-center rounded-full text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-3"
        >
          {transcripts.length === 0 ? (
            <p className="text-xs text-[#7f6f66] text-center mt-8 italic">
              {t("transcript.empty")}
            </p>
          ) : (
            transcripts.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent-tan text-text-dark rounded-br-sm"
                      : "bg-primary text-white rounded-bl-sm"
                  }`}
                >
                  {msg.sender === "agent" && (
                    <span className="block text-[9px] font-bold text-white/70 mb-0.5 uppercase tracking-wider">
                      {agentName}
                    </span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
