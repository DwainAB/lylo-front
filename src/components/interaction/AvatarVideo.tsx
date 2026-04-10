"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveKitRoom } from "@/context/LiveKitRoomContext";

interface AvatarVideoProps {
  fallbackUrl: string;
  avatarEnabled?: boolean;
}

function AvatarVideoStream({ fallbackUrl }: AvatarVideoProps) {
  const { roomRef } = useLiveKitRoom();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasAvatar, setHasAvatar] = useState(false);

  useEffect(() => {
    // Poll jusqu'à ce que la room soit disponible puis écoute les events
    let interval: ReturnType<typeof setInterval>;

    function attachAvatar(room: any) {
      for (const participant of room.remoteParticipants.values()) {
        if (participant.identity === "bey-avatar-agent") {
          for (const pub of participant.trackPublications.values()) {
            if (pub.track && pub.track.kind === "video" && videoRef.current) {
              pub.track.attach(videoRef.current);
              setHasAvatar(true);
              return;
            }
          }
        }
      }
    }

    function setupRoom(room: any) {
      attachAvatar(room);

      const onTrackSubscribed = (_track: any, _pub: any, participant: any) => {
        if (participant.identity === "bey-avatar-agent") attachAvatar(room);
      };
      const onTrackUnsubscribed = (_track: any, _pub: any, participant: any) => {
        if (participant.identity === "bey-avatar-agent") setHasAvatar(false);
      };

      room.on("trackSubscribed", onTrackSubscribed);
      room.on("trackUnsubscribed", onTrackUnsubscribed);

      return () => {
        room.off("trackSubscribed", onTrackSubscribed);
        room.off("trackUnsubscribed", onTrackUnsubscribed);
      };
    }

    let cleanup: (() => void) | undefined;

    if (roomRef.current) {
      cleanup = setupRoom(roomRef.current);
    } else {
      // Room pas encore prête — on poll jusqu'à ce qu'elle soit là
      interval = setInterval(() => {
        if (roomRef.current) {
          clearInterval(interval);
          cleanup = setupRoom(roomRef.current);
        }
      }, 300);
    }

    return () => {
      clearInterval(interval);
      cleanup?.();
    };
  }, [roomRef]);

  if (hasAvatar) {
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

export default function AvatarVideo({ fallbackUrl, avatarEnabled = true }: AvatarVideoProps) {
  if (!avatarEnabled) return null;

  return <AvatarVideoStream fallbackUrl={fallbackUrl} />;
}
