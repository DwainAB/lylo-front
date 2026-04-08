"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDataChannel, useRoomContext } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useSession } from "@/context/SessionContext";
import { useTranslation } from "@/i18n/LanguageContext";
import MaterialIcon from "@/components/ui/MaterialIcon";
import TranscriptPanel from "@/components/livekit/TranscriptPanel";

function Dots({ dim }: { dim?: boolean }) {
  const base = dim ? "bg-primary/40" : "bg-primary";
  return (
    <div className="flex gap-1 shrink-0">
      <span className={`size-1 ${base} rounded-full animate-bounce`} style={{ animationDuration: "1.5s" }} />
      <span className={`size-1 ${base} rounded-full animate-bounce`} style={{ animationDelay: "0.2s", animationDuration: "1.5s" }} />
      <span className={`size-1 ${base} rounded-full animate-bounce`} style={{ animationDelay: "0.4s", animationDuration: "1.5s" }} />
    </div>
  );
}

export default function BottomBar() {
  const { agentState, sessionState, currentQuestionIndex, agentName, inputMode } = useSession();
  const { t } = useTranslation();
  const { send } = useDataChannel("control");
  const room = useRoomContext();
  const [interrupted, setInterrupted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [hybridRecording, setHybridRecording] = useState(false);
  const hybridRecordingRef = useRef(false);

  // Question suivante → reset état
  const prevQuestionIndex = useRef(currentQuestionIndex);
  useEffect(() => {
    if (prevQuestionIndex.current !== currentQuestionIndex) {
      prevQuestionIndex.current = currentQuestionIndex;
      room.localParticipant.getTrackPublication(Track.Source.Microphone)?.unmute();
      setInterrupted(false);
      setMuted(false);
    }
  }, [currentQuestionIndex, room]);

  // Reset hybrid recording state when agent starts speaking
  useEffect(() => {
    if (agentState === "speaking" && hybridRecordingRef.current) {
      room.localParticipant.getTrackPublication(Track.Source.Microphone)?.mute();
      hybridRecordingRef.current = false;
      setHybridRecording(false);
    }
  }, [agentState, room]);

  const canInterrupt = !interrupted && agentState === "speaking";

  const handleInterrupt = () => {
    send(new TextEncoder().encode(JSON.stringify({ type: "interrupt" })), { reliable: true });
    room.localParticipant.getTrackPublication(Track.Source.Microphone)?.mute();
    setInterrupted(true);
  };

  const handleResumeListen = () => {
    send(new TextEncoder().encode(JSON.stringify({ type: "resume_listen" })), { reliable: true });
    room.localParticipant.getTrackPublication(Track.Source.Microphone)?.unmute();
    setInterrupted(false);
  };

  const handleMicToggle = () => {
    const newMuted = !muted;
    const pub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
    if (newMuted) pub?.mute(); else pub?.unmute();
    setMuted(newMuted);
  };

  const handleHybridReply = useCallback(() => {
    if (!hybridRecordingRef.current) {
      room.localParticipant.getTrackPublication(Track.Source.Microphone)?.unmute();
      hybridRecordingRef.current = true;
      setHybridRecording(true);
    } else {
      room.localParticipant.getTrackPublication(Track.Source.Microphone)?.mute();
      hybridRecordingRef.current = false;
      setHybridRecording(false);
    }
  }, [room]);

  const handleResume = () => {
    const msg = new TextEncoder().encode(JSON.stringify({ type: "resume" }));
    send(msg, { reliable: true });
  };

  const renderStatus = () => {
    if (sessionState === "standby") {
      return (
        <button
          onClick={handleResume}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-medium tracking-wider cursor-pointer transition-all hover:bg-primary/90"
        >
          <MaterialIcon name="mic" className="text-[14px]" />
          j&apos;ai une question
        </button>
      );
    }
    if (agentState === "initializing") {
      return (
        <>
          <Dots />
          <span className="text-[11px] tracking-wider italic font-light lowercase truncate">
            {t("interaction.connecting")}
          </span>
        </>
      );
    }
    if (agentState === "speaking") {
      return (
        <>
          <Dots />
          <span className="text-[11px] tracking-wider italic font-light lowercase truncate">
            {t("interaction.agentSpeaking").replace("{name}", agentName)}
          </span>
        </>
      );
    }
    if (agentState === "thinking") {
      return (
        <>
          <Dots dim />
          <span className="text-[11px] tracking-wider italic font-light lowercase truncate text-primary/60">
            {t("interaction.agentThinking")}
          </span>
        </>
      );
    }
    if (agentState === "listening") {
      if (inputMode === "click") {
        return (
          <button
            onClick={handleHybridReply}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider transition-all cursor-pointer ${
              hybridRecording
                ? "bg-primary/10 text-primary border border-primary/40 animate-pulse"
                : "bg-primary text-white"
            }`}
          >
            <MaterialIcon name={hybridRecording ? "stop_circle" : "mic"} className="text-[14px]" />
            {hybridRecording ? "terminer" : "répondre"}
          </button>
        );
      }
      return (
        <>
          <MaterialIcon name="mic" className="text-[15px] animate-pulse shrink-0" />
          <span className="text-[11px] tracking-wider font-medium lowercase truncate">
            {t("interaction.agentListening")}
          </span>
        </>
      );
    }
    return (
      <>
        <MaterialIcon name="mic_off" className="text-[15px] shrink-0 text-primary/40" />
        <span className="text-[11px] tracking-wider italic font-light lowercase truncate text-primary/40">
          {t("interaction.agentIdle")}
        </span>
      </>
    );
  };

  const iconBtn = "size-9 sm:size-11 flex items-center justify-center rounded-full transition-colors cursor-pointer";

  return (
    <>
      <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-primary/15 shadow-lg shadow-primary/10 text-primary w-72 sm:w-96">
        {/* Gauche : Stop / Reprendre */}
        <div className="w-9 sm:w-11 flex justify-center shrink-0">
          {interrupted ? (
            <button onClick={handleResumeListen} className={iconBtn} title="Reprendre">
              <MaterialIcon name="play_circle" className="text-[22px] sm:text-[26px]" />
            </button>
          ) : canInterrupt ? (
            <button onClick={handleInterrupt} className={iconBtn} title="Stop">
              <MaterialIcon name="stop_circle" className="text-[22px] sm:text-[26px]" />
            </button>
          ) : (
            <div className="size-9 sm:size-11" />
          )}
        </div>

        <div className="w-px h-4 sm:h-5 bg-primary/20 shrink-0 mx-1" />

        {/* Centre : statut */}
        <div className="flex items-center gap-1.5 px-1 flex-1 min-w-0">
          {renderStatus()}
        </div>

        <div className="w-px h-4 sm:h-5 bg-primary/20 shrink-0 mx-1" />

        {/* Droite : conversation */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setTranscriptOpen((p) => !p)}
            className={`${iconBtn} hover:bg-primary/10`}
            title="Conversation"
          >
            <MaterialIcon name={transcriptOpen ? "close" : "chat"} className="text-[22px] sm:text-[26px]" />
          </button>
        </div>
      </div>

      <TranscriptPanel open={transcriptOpen} onToggle={() => setTranscriptOpen((p) => !p)} />
    </>
  );
}
