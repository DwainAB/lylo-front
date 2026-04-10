import type { Transport } from './types';

/**
 * Sélecteur de transport selon NEXT_PUBLIC_TRANSPORT.
 * Valeurs possibles : "agora" (défaut) | "livekit"
 *
 * Pour basculer : changer la variable dans .env et redémarrer le serveur.
 */
export async function createTransport(): Promise<Transport> {
  const provider = process.env.NEXT_PUBLIC_TRANSPORT || 'agora';

  if (provider === 'livekit') {
    const { LiveKitTransport } = await import('./livekit');
    return new LiveKitTransport();
  }

  const { AgoraTransport } = await import('./agora');
  return new AgoraTransport();
}

export type { Transport, TransportHandlers, TransportSessionData } from './types';
