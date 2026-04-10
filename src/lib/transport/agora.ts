'use client';

import type { Transport, TransportHandlers, TransportSessionData } from './types';

/**
 * Transport Agora — extrait de LiveKitSession.tsx
 * Gère : connexion Agora (micro), MediaRecorder → WebSocket
 */
export class AgoraTransport implements Transport {
  micTrack: any = null;
  mediaRecorder: MediaRecorder | null = null;

  private client: any = null;
  private ws: WebSocket | null = null;
  private audioCtx: AudioContext | null = null;

  async connect(sessionData: TransportSessionData, handlers: TransportHandlers): Promise<void> {
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const { session_id, room_name, token, agora_app_id } = sessionData;
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

    // AudioContext + warmup
    this.audioCtx = new AudioContext();
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') await ctx.resume();
    const warmupBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const warmupSource = ctx.createBufferSource();
    warmupSource.buffer = warmupBuffer;
    warmupSource.connect(ctx.destination);
    warmupSource.start();

    // WebSocket
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

    // Agora
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    this.client = client;

    try {
      await client.join(agora_app_id, room_name, token || null, 0);

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'speech_standard',
      });
      this.micTrack = micTrack;
      await client.publish([micTrack]);

      const stream = new MediaStream([micTrack.getMediaStreamTrack()]);
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      this.mediaRecorder = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          e.data.arrayBuffer().then((buf) => ws.send(buf));
        }
      };

      mr.start(250);
      handlers.onReady?.();
    } catch (err) {
      console.error('[AgoraTransport] error', err);
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
      this.micTrack.close();
      this.micTrack = null;
    }

    this.client?.leave();
    this.client = null;

    this.audioCtx?.close();
    this.audioCtx = null;
  }
}
