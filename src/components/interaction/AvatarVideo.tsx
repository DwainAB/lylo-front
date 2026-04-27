"use client";

import { useEffect, useRef } from "react";
import { useMaybeRoomContext, useParticipants } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useSession } from "@/context/SessionContext";

interface AvatarVideoProps {
  fallbackUrl: string;
  avatarEnabled?: boolean;
}

function AvatarVideoStream({ fallbackUrl }: AvatarVideoProps) {
  const participants = useParticipants();
  const { avatarDisabled } = useSession();
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

  if (avatarParticipant && !avatarDisabled) {
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
      {!avatarDisabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/30 backdrop-blur-sm">
          <div className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          <span className="text-white text-[10px] font-medium tracking-wide">Chargement...</span>
        </div>
      )}
    </div>
  );
}

export default function AvatarVideo({ fallbackUrl, avatarEnabled = true }: AvatarVideoProps) {
  const room = useMaybeRoomContext();

  const staticImage = (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `url('${fallbackUrl}')`,
        transform: "scale(1.4)",
        transformOrigin: "top center",
      }}
    />
  );

  if (!avatarEnabled) return staticImage;
  if (!room) return staticImage;

  return <AvatarVideoStream fallbackUrl={fallbackUrl} />;
}
