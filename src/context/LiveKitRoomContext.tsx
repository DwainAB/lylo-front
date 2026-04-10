"use client";

import { createContext, useContext, useRef, MutableRefObject } from "react";

interface LiveKitRoomContextType {
  roomRef: MutableRefObject<any | null>;
}

const LiveKitRoomContext = createContext<LiveKitRoomContextType | null>(null);

export function LiveKitRoomProvider({ children }: { children: React.ReactNode }) {
  const roomRef = useRef<any | null>(null);
  return (
    <LiveKitRoomContext.Provider value={{ roomRef }}>
      {children}
    </LiveKitRoomContext.Provider>
  );
}

export function useLiveKitRoom() {
  const ctx = useContext(LiveKitRoomContext);
  if (!ctx) throw new Error("useLiveKitRoom must be used within LiveKitRoomProvider");
  return ctx;
}
