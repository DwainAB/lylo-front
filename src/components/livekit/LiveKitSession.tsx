"use client";

/**
 * LiveKitSession — shell de connexion audio.
 * Le transport réel (Agora ou LiveKit) est sélectionné via NEXT_PUBLIC_TRANSPORT.
 * Pipeline IA (STT/LLM/TTS) inchangé côté back.
 */

import { ReactNode, useEffect, useRef } from "react";
import { useSession } from "@/context/SessionContext";
import { useLiveKitRoom } from "@/context/LiveKitRoomContext";
import type { Transport } from "@/lib/transport";

interface Props {
  children: ReactNode;
}

export default function LiveKitSession({ children }: Props) {
  const {
    sessionData,
    handleDataMessage,
    upsertTranscript,
    setAgentState,
    wsRef,
    micTrackRef,
    mediaRecorderRef,
  } = useSession();

  const transportRef = useRef<Transport | null>(null);
  const { roomRef } = useLiveKitRoom();

  const ttsChunksRef = useRef<Uint8Array[]>([]);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const agentTextRef = useRef("");
  const agentMsgIdRef = useRef(`agent-${Date.now()}`);
  const agentDoneRef = useRef(false);

  async function drainAudioQueue() {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      if (agentDoneRef.current) {
        agentDoneRef.current = false;
        if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
        if (micTrackRef.current) micTrackRef.current.setMuted(false);
        setAgentState("listening");
      }
      return;
    }
    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift()!;
    try {
      const ctx = audioCtxRef.current!;
      if (ctx.state === "suspended") await ctx.resume();
      const decoded = await ctx.decodeAudioData(buffer);
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      activeSourceRef.current = source;
      source.onended = () => drainAudioQueue();
      source.start();
    } catch {
      isPlayingRef.current = false;
      drainAudioQueue();
    }
  }

  function stopTTS() {
    ttsChunksRef.current = [];
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    agentDoneRef.current = false;
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch {}
      activeSourceRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
    }
  }

  function handleWsMessage(msg: Record<string, unknown>) {
    switch (msg.type) {
      case "status":
        if (msg.state === "thinking") setAgentState("thinking");
        else if (msg.state === "speaking") setAgentState("speaking");
        break;

      case "agent_done":
        agentTextRef.current = "";
        agentMsgIdRef.current = `agent-${Date.now()}`;
        agentDoneRef.current = true;
        if (!isPlayingRef.current) {
          agentDoneRef.current = false;
          setAgentState("listening");
          if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
          if (micTrackRef.current) micTrackRef.current.setMuted(false);
        }
        break;

      case "transcript":
        if (msg.final) {
          upsertTranscript({ id: "user-interim", sender: "user", text: "", timestamp: 0 });
          upsertTranscript({ id: `user-${Date.now()}`, sender: "user", text: msg.text as string, timestamp: Date.now() });
        } else {
          upsertTranscript({ id: "user-interim", sender: "user", text: msg.text as string, timestamp: Date.now() });
        }
        break;

      case "llm_chunk":
        agentTextRef.current += msg.text as string;
        upsertTranscript({
          id: agentMsgIdRef.current,
          sender: "agent",
          text: agentTextRef.current,
          timestamp: Date.now(),
        });
        break;

      case "tts_start":
        ttsChunksRef.current = [];
        setAgentState("speaking");
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.pause();
        }
        break;

      case "audio_chunk": {
        const binary = atob(msg.data as string);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        ttsChunksRef.current.push(bytes);
        break;
      }

      case "tts_end": {
        const chunks = ttsChunksRef.current;
        if (chunks.length > 0) {
          const total = chunks.reduce((a, c) => a + c.length, 0);
          const combined = new Uint8Array(total);
          let offset = 0;
          for (const c of chunks) { combined.set(c, offset); offset += c.length; }
          ttsChunksRef.current = [];
          audioQueueRef.current.push(combined.buffer);
          if (!isPlayingRef.current) drainAudioQueue();
        }
        break;
      }

      case "tts_stop":
        stopTTS();
        setAgentState("listening");
        if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
        if (micTrackRef.current) micTrackRef.current.setMuted(false);
        break;

      case "click_transcript_done":
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
        if (micTrackRef.current) micTrackRef.current.setMuted(true);
        break;

      default:
        handleDataMessage(new TextEncoder().encode(JSON.stringify(msg)));
        break;
    }
  }

  useEffect(() => {
    if (!sessionData) return;

    let cancelled = false;

    const init = async () => {
      audioCtxRef.current = new AudioContext();

      // Warmup AudioContext
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();
      const warmupBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const warmupSource = ctx.createBufferSource();
      warmupSource.buffer = warmupBuffer;
      warmupSource.connect(ctx.destination);
      warmupSource.start();

      const { createTransport } = await import("@/lib/transport");
      if (cancelled) return;

      const transport = await createTransport();
      transportRef.current = transport;

      await transport.connect(
        {
          session_id: sessionData.session_id,
          room_name: sessionData.room_name,
          token: sessionData.token,
          agora_app_id: sessionData.agora_app_id,
          livekit_url: (sessionData as any).livekit_url,
          livekit_token: (sessionData as any).livekit_token,
        },
        {
          onMessage: handleWsMessage,
          onError: (err) => console.error("[Transport] error", err),
          onRoomReady: (room) => { roomRef.current = room; },
        }
      );

      if (cancelled) {
        transport.disconnect();
        return;
      }

      // Expose les refs partagées avec BottomBar
      micTrackRef.current = transport.micTrack;
      mediaRecorderRef.current = transport.mediaRecorder;

      // WebSocket ref pour BottomBar (sendWs)
      // On crée un proxy WS minimal via le transport
      // BottomBar envoie des JSON via wsRef — on le branche sur le WS interne du transport
      wsRef.current = (transport as any).ws ?? null;
    };

    init();

    return () => {
      cancelled = true;
      transportRef.current?.disconnect();
      transportRef.current = null;
      micTrackRef.current = null;
      mediaRecorderRef.current = null;
      wsRef.current = null;
      roomRef.current = null;
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData?.session_id]);

  return <>{children}</>;
}
