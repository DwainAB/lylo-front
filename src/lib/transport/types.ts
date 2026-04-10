/**
 * Interface commune pour les transports audio (Agora / LiveKit).
 * LiveKitSession.tsx utilise cette interface — il ne connaît pas le transport sous-jacent.
 */

export interface TransportHandlers {
  /** Message JSON reçu du back (state_change, formulas, transcript, audio_chunk, etc.) */
  onMessage: (msg: Record<string, unknown>) => void;
  /** Appelé quand le transport est prêt (micro connecté) */
  onReady?: () => void;
  /** Appelé en cas d'erreur de connexion */
  onError?: (err: unknown) => void;
  /** Appelé avec la room LiveKit une fois connectée (LiveKit transport uniquement) */
  onRoomReady?: (room: any) => void;
}

export interface Transport {
  /** Démarre la connexion (micro + WebSocket) */
  connect(sessionData: TransportSessionData, handlers: TransportHandlers): Promise<void>;
  /** Coupe tout proprement */
  disconnect(): void;
  /** Référence au micTrack (pour mute/unmute depuis BottomBar) */
  micTrack: any;
  /** Référence au MediaRecorder (pour pause/resume depuis BottomBar) */
  mediaRecorder: MediaRecorder | null;
}

export interface TransportSessionData {
  session_id: string;
  room_name: string;
  token: string | null;
  agora_app_id: string;
  /** URL LiveKit (optionnel, uniquement pour le transport LiveKit) */
  livekit_url?: string;
  livekit_token?: string;
}
