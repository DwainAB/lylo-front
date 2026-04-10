'use client';

import type { Transport, TransportHandlers, TransportSessionData } from './types';

/**
 * Transport LiveKit — équivalent du transport Agora mais via LiveKit.
 * Gère : connexion LiveKit (micro), MediaRecorder → WebSocket
 *
 * Le back génère un token LiveKit via LIVEKIT_API_KEY / LIVEKIT_API_SECRET.
 * Le front reçoit livekit_url + livekit_token dans sessionData.
 */
export class LiveKitTransport implements Transport {
  micTrack: any = null;
  mediaRecorder: MediaRecorder | null = null;

  private room: any = null;
  private ws: WebSocket | null = null;
  private audioCtx: AudioContext | null = null;

  async connect(sessionData: TransportSessionData, handlers: TransportHandlers): Promise<void> {
    const { Room, createLocalAudioTrack } = await import('livekit-client');
    const { session_id, livekit_url, livekit_token } = sessionData;
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

    if (!livekit_url || !livekit_token) {
      const err = new Error('[LiveKitTransport] livekit_url ou livekit_token manquant dans sessionData');
      console.error(err.message);
      handlers.onError?.(err);
      return;
    }

    // AudioContext + warmup
    this.audioCtx = new AudioContext();
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') await ctx.resume();
    const warmupBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const warmupSource = ctx.createBufferSource();
    warmupSource.buffer = warmupBuffer;
    warmupSource.connect(ctx.destination);
    warmupSource.start();

    // WebSocket (même pipeline back que pour Agora)
    const ws = new WebSocket(`${WS_URL}/ws?session_id=${session_id}`);
    this.ws = ws;
    ws.binaryType = 'arraybuffer';

    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          handlers.onMessage(JSON.parse(event.data));
        } catch {}
      }
    };

    ws.onerror = (err) => handlers.onError?.(err);

    // LiveKit Room
    const room = new Room();
    this.room = room;

    try {
      await room.connect(livekit_url, livekit_token);

      const audioTrack = await createLocalAudioTrack({ echoCancellation: true, noiseSuppression: true });
      // Normalise l'API pour correspondre à Agora (setMuted)
      (audioTrack as any).setMuted = (muted: boolean) => muted ? audioTrack.mute() : audioTrack.unmute();

      this.micTrack = audioTrack;
      await room.localParticipant.publishTrack(audioTrack);

      const stream = new MediaStream([audioTrack.mediaStreamTrack]);
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      this.mediaRecorder = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          e.data.arrayBuffer().then((buf) => ws.send(buf));
        }
      };

      mr.start(250);
      handlers.onRoomReady?.(room);
      handlers.onReady?.();
    } catch (err) {
      console.error('[LiveKitTransport] error', err);
      handlers.onError?.(err);
    }
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;

    this.mediaRecorder?.stop();
    this.mediaRecorder = null;

    if (this.micTrack) {
      this.micTrack.stop();
      this.micTrack = null;
    }

    this.room?.disconnect();
    this.room = null;

    this.audioCtx?.close();
    this.audioCtx = null;
  }
}
