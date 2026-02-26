"use client";

import { ReactNode, useEffect, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useDataChannel,
  useRoomContext,
} from "@livekit/components-react";
import { RoomEvent, TranscriptionSegment, Participant } from "livekit-client";
import { useSession } from "@/context/SessionContext";
import MaterialIcon from "@/components/ui/MaterialIcon";

function DataChannelListener() {
  const { handleDataMessage } = useSession();

  const onMessage = useCallback(
    (msg: { payload: Uint8Array }) => {
      handleDataMessage(msg.payload);
    },
    [handleDataMessage]
  );

  useDataChannel("state", onMessage);

  return null;
}

function ResumeButton() {
  const { sessionState } = useSession();
  const { send } = useDataChannel("control");

  if (sessionState !== "standby") return null;

  const handleClick = () => {
    const msg = new TextEncoder().encode(JSON.stringify({ type: "resume" }));
    send(msg, { reliable: true });
  };

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white/90 backdrop-blur-sm text-primary text-sm sm:text-base font-medium border border-primary/25 cursor-pointer shadow-lg shadow-primary/10 hover:bg-white hover:border-primary/40 transition-all"
      >
        <MaterialIcon name="mic" className="text-[18px]" />
        J&apos;ai une question
      </button>
    </div>
  );
}

function TranscriptionListener() {
  const room = useRoomContext();
  const { upsertTranscript } = useSession();

  useEffect(() => {
    const handleTranscription = (
      segments: TranscriptionSegment[],
      participant?: Participant
    ) => {
      const sender = participant?.isLocal
        ? ("user" as const)
        : ("agent" as const);

      for (const segment of segments) {
        upsertTranscript({
          id: segment.id,
          sender,
          text: segment.text,
          timestamp: segment.firstReceivedTime ?? Date.now(),
        });
      }
    };

    room.on(RoomEvent.TranscriptionReceived, handleTranscription);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, handleTranscription);
    };
  }, [room, upsertTranscript]);

  return null;
}

interface LiveKitSessionProps {
  children: ReactNode;
}

export default function LiveKitSession({ children }: LiveKitSessionProps) {
  const { sessionData } = useSession();

  if (!sessionData) {
    return <>{children}</>;
  }

  return (
    <LiveKitRoom
      serverUrl={sessionData.livekit_url}
      token={sessionData.token}
      audio={true}
      video={false}
      connect={true}
    >
      <RoomAudioRenderer />
      <DataChannelListener />
      <TranscriptionListener />
      <ResumeButton />
      {children}
    </LiveKitRoom>
  );
}
