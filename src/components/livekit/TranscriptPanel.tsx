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
    <>
      {/* Overlay : clic en dehors du panneau pour fermer */}
      <div
        onClick={onToggle}
        className={`fixed inset-0 z-[59] bg-black/20 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-80 z-[60] transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Flèche de fermeture, centrée verticalement, sur le bord gauche du panneau.
            Masquée quand le panneau est fermé : sinon elle dépasse du bord de l'écran
            (elle est positionnée à -20px du panneau, qui lui est hors-écran) et donne
            l'illusion que le panneau est déjà ouvert. */}
        <button
          onClick={onToggle}
          aria-label={t("transcript.title")}
          tabIndex={open ? 0 : -1}
          className={`absolute top-1/2 -left-5 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/90 border border-primary/15 shadow-lg text-primary hover:bg-primary/10 transition-all duration-300 ease-in-out cursor-pointer ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>

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
              <p className="text-xs text-primary/60 text-center mt-8 italic">
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
    </>
  );
}
