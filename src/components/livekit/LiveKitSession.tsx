"use client";

/**
 * AgoraSession — remplace LiveKitSession.
 * Gère : connexion Agora (micro), WebSocket pipeline IA, dispatch des events vers SessionContext.
 */

import { ReactNode, useEffect, useRef } from "react";
import { useSession } from "@/context/SessionContext";

interface Props {
  children: ReactNode;
}

export default function LiveKitSession({ children }: Props) {
  const { sessionData, handleDataMessage, upsertTranscript, setAgentState, wsRef, micTrackRef, mediaRecorderRef } = useSession();

  // mediaRecorderRef vient du context (partagé avec BottomBar)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ttsChunksRef = useRef<Uint8Array[]>([]);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const agentTextRef = useRef("");
  const agentMsgIdRef = useRef(`agent-${Date.now()}`);
  const agentDoneRef = useRef(false);

  async function drainAudioQueue() {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      // Passer en listening seulement si le backend a signalé agent_done
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

  function handleWsMessage(msg: any) {
    switch (msg.type) {
      case "status":
        // "listening" vient du backend mais on le gère via drainAudioQueue côté frontend
        if (msg.state === "thinking") setAgentState("thinking");
        else if (msg.state === "speaking") setAgentState("speaking");
        break;

      case "agent_done":
        // Nouvelle réponse terminée côté backend — reset le message agent pour la prochaine
        agentTextRef.current = "";
        agentMsgIdRef.current = `agent-${Date.now()}`;
        agentDoneRef.current = true;
        // Si l'audio a déjà fini de jouer, passer en listening maintenant
        if (!isPlayingRef.current) {
          agentDoneRef.current = false;
          setAgentState("listening");
          if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
          if (micTrackRef.current) micTrackRef.current.setMuted(false);
        }
        break;

      case "transcript":
        if (msg.final) {
          // Supprimer l'interim puis ajouter le final comme nouveau message
          upsertTranscript({ id: "user-interim", sender: "user", text: "", timestamp: 0 });
          upsertTranscript({ id: `user-${Date.now()}`, sender: "user", text: msg.text, timestamp: Date.now() });
        } else {
          upsertTranscript({ id: "user-interim", sender: "user", text: msg.text, timestamp: Date.now() });
        }
        break;

      case "llm_chunk":
        agentTextRef.current += msg.text;
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
        const binary = atob(msg.data);
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
        break;

      case "click_transcript_done":
        // Mode click : refermer le micro dès que le transcript est reçu
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
        if (micTrackRef.current) micTrackRef.current.setMuted(true);
        break;

      default:
        // Events agent → handleDataMessage (state_change, profile_update, answer_saved, etc.)
        handleDataMessage(new TextEncoder().encode(JSON.stringify(msg)));
        break;
    }
  }

useEffect(() => {
  if (!sessionData) return;

  let client: any;
  let AgoraRTC: any;

  const init = async () => {
    // 👇 import côté client uniquement
    AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

    const { session_id, room_name, token, agora_app_id } = sessionData as any;
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

    audioCtxRef.current = new AudioContext();

    // Warmup AudioContext : jouer un silence de 100ms pour éviter que le premier mot soit coupé
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    const warmupBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const warmupSource = ctx.createBufferSource();
    warmupSource.buffer = warmupBuffer;
    warmupSource.connect(ctx.destination);
    warmupSource.start();

    // WebSocket
    const ws = new WebSocket(`${WS_URL}/ws?session_id=${session_id}`);
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try { handleWsMessage(JSON.parse(event.data)); } catch {}
      }
    };

    // Agora
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    try {
      await client.join(agora_app_id, room_name, token || null, 0);

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "speech_standard",
      });

      micTrackRef.current = micTrack;
      await client.publish([micTrack]);

      const stream = new MediaStream([micTrack.getMediaStreamTrack()]);
      const mr = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          e.data.arrayBuffer().then((buf) => ws.send(buf));
        }
      };

      mr.start(250);
    } catch (err) {
      console.error("[Agora] error", err);
    }
  };

  init();

  return () => {
    wsRef.current?.close();
    wsRef.current = null;

    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    if (micTrackRef.current) {
      micTrackRef.current.stop();
      micTrackRef.current.close();
      micTrackRef.current = null;
    }

    client?.leave();
    audioCtxRef.current?.close();
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [sessionData?.session_id]);

  return <>{children}</>;
}
