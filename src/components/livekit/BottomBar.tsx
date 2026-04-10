"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const { agentState, sessionState, currentQuestionIndex, agentName, inputMode, wsRef, micTrackRef, mediaRecorderRef } = useSession();
  const { t } = useTranslation();
  const [interrupted, setInterrupted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [hybridRecording, setHybridRecording] = useState(false);
  const hybridRecordingRef = useRef(false);

  // Question suivante → reset état UI seulement (le micro est géré par tts_start/tts_end)
  const prevQuestionIndex = useRef(currentQuestionIndex);
  useEffect(() => {
    if (prevQuestionIndex.current !== currentQuestionIndex) {
      prevQuestionIndex.current = currentQuestionIndex;
      setInterrupted(false);
      setMuted(false);
      hybridRecordingRef.current = false;
      setHybridRecording(false);
    }
  }, [currentQuestionIndex]);

  // Reset hybrid recording quand l'agent parle
  useEffect(() => {
    if (agentState === "speaking" && hybridRecordingRef.current) {
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
      if (micTrackRef.current) micTrackRef.current.setMuted(true);
      hybridRecordingRef.current = false;
      setHybridRecording(false);
    }
  }, [agentState, micTrackRef, mediaRecorderRef]);

  const sendWs = (msg: object) => {
    const ws = wsRef?.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  };

  const canInterrupt = !interrupted && agentState === "speaking";

  const handleInterrupt = () => {
    sendWs({ type: "stop" });
    if (micTrackRef.current) micTrackRef.current.setMuted(true);
    setInterrupted(true);
  };

  const handleResumeListen = () => {
    sendWs({ type: "resume_listen" });
    if (micTrackRef.current) micTrackRef.current.setMuted(false);
    setInterrupted(false);
  };

  const handleMicToggle = () => {
    const newMuted = !muted;
    if (micTrackRef.current) micTrackRef.current.setMuted(newMuted);
    setMuted(newMuted);
  };

  const handleHybridReply = useCallback(() => {
    if (!hybridRecordingRef.current) {
      // Ouvrir le micro — la fermeture se fait automatiquement via click_transcript_done
      if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
      if (micTrackRef.current) micTrackRef.current.setMuted(false);
      hybridRecordingRef.current = true;
      setHybridRecording(true);
    }
    // Pas de fermeture manuelle — Deepgram détecte la fin et envoie click_transcript_done
  }, [micTrackRef, mediaRecorderRef]);

  const handleResume = () => {
    sendWs({ type: "resume" });
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
            disabled={hybridRecording}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider transition-all ${
              hybridRecording
                ? "bg-primary/10 text-primary border border-primary/40 animate-pulse cursor-default"
                : "bg-primary text-white cursor-pointer"
            }`}
          >
            <MaterialIcon name="mic" className="text-[14px]" />
            {hybridRecording ? "écoute..." : "répondre"}
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
