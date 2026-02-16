"use client";

import { useState, useRef, useEffect } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useSession } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function TranscriptPanel() {
  const [open, setOpen] = useState(false);
  const { transcripts, sessionState, agentName } = useSession();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, open]);

  // Only show when a session is active
  if (sessionState === "idle") return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all duration-300 ease-in-out cursor-pointer ${
          open ? "right-[21rem]" : "right-4"
        }`}
        aria-label={t("transcript.toggle")}
      >
        <MaterialIcon name={open ? "close" : "chat"} className="text-xl" />
      </button>

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-40 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full glass-panel border-l border-primary/10 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-primary/10 shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {t("transcript.title")}
            </h3>
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
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white/80 text-text-dark border border-primary/10 rounded-bl-sm"
                    }`}
                  >
                    {msg.sender === "agent" && (
                      <span className="block text-[9px] font-bold text-primary mb-0.5 uppercase tracking-wider">
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
