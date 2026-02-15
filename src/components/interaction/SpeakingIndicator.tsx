"use client";

import { useMaybeRoomContext } from "@livekit/components-react";
import { useEffect, useState, useCallback } from "react";
import { RoomEvent, Participant } from "livekit-client";
import { useSession } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";

export default function SpeakingIndicator() {
  const { agentName } = useSession();
  const { t } = useTranslation();
  const room = useMaybeRoomContext();
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);

  const onActiveSpeakersChanged = useCallback(
    (speakers: Participant[]) => {
      const agentIsSpeaking = speakers.some((p) =>
        p.identity.startsWith("agent_")
      );
      setIsAgentSpeaking(agentIsSpeaking);
    },
    []
  );

  useEffect(() => {
    if (!room) return;

    room.on(RoomEvent.ActiveSpeakersChanged, onActiveSpeakersChanged);
    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, onActiveSpeakersChanged);
    };
  }, [room, onActiveSpeakersChanged]);

  // Not connected yet
  if (!room) {
    return (
      <div className="px-8 py-3 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm flex items-center gap-4 text-primary shadow-sm">
        <div className="flex gap-1.5">
          <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDuration: "1.5s" }} />
          <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "1.5s" }} />
          <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1.5s" }} />
        </div>
        <span className="text-sm tracking-widest italic font-light lowercase">
          {t("interaction.connecting")}
        </span>
      </div>
    );
  }

  if (!isAgentSpeaking) return null;

  return (
    <div className="px-8 py-3 rounded-full border border-primary/30 bg-white/50 backdrop-blur-sm flex items-center gap-4 text-primary shadow-sm transition-colors duration-300">
      <div className="flex gap-1.5">
        <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDuration: "1.5s" }} />
        <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "1.5s" }} />
        <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1.5s" }} />
      </div>
      <span className="text-sm tracking-widest italic font-light lowercase">
        {t("interaction.agentSpeaking").replace("{name}", agentName)}
      </span>
    </div>
  );
}
