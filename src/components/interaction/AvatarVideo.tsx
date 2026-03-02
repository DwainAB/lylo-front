"use client";

import { useEffect, useRef } from "react";
import { useMaybeRoomContext, useParticipants } from "@livekit/components-react";
import { Track } from "livekit-client";

interface AvatarVideoProps {
  fallbackUrl: string;
}

function AvatarVideoStream({ fallbackUrl }: AvatarVideoProps) {
  const participants = useParticipants();
  const avatarParticipant = participants.find(p => p.identity === "bey-avatar-agent");
  const videoTrack = avatarParticipant?.getTrackPublication(Track.Source.Camera)?.videoTrack;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (videoTrack && el) {
      videoTrack.attach(el);
      return () => { videoTrack.detach(el); };
    }
  }, [videoTrack]);

  if (avatarParticipant) {
    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${fallbackUrl}')`,
          transform: "scale(1.4)",
          transformOrigin: "top center",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/30 backdrop-blur-sm">
        <div className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        <span className="text-white text-[10px] font-medium tracking-wide">Chargement...</span>
      </div>
    </div>
  );
}

export default function AvatarVideo({ fallbackUrl }: AvatarVideoProps) {
  const room = useMaybeRoomContext();

  if (!room) {
    return (
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${fallbackUrl}')`,
          transform: "scale(1.4)",
          transformOrigin: "top center",
        }}
      />
    );
  }

  return <AvatarVideoStream fallbackUrl={fallbackUrl} />;
}
