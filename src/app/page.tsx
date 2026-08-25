"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TechBar from "@/components/home/TechBar";
import { useSession } from "@/context/SessionContext";

export default function Home() {
  const { endSession, sessionData } = useSession();

  useEffect(() => {
    if (sessionData) {
      endSession();
    }
  }, []);

  // TODO(diagnostic-bluetooth): log temporaire — liste les devices audio dès l'accueil,
  // avant toute demande de permission micro, pour comparer avec l'état vu pendant une
  // session LiveKit. À retirer une fois le diagnostic terminé.
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const outputs = devices
          .filter((d) => d.kind === "audiooutput")
          .map((d) => ({ id: d.deviceId, label: d.label || "(vide)" }));
        console.log("[Home][diag] audiooutput devices (avant permission micro):", outputs);
      })
      .catch((err) => {
        console.warn("[Home][diag] enumerateDevices a échoué:", err);
      });
  }, []);

  
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden h-full">
      <Navbar />

      <main className="flex-1 pt-14 flex flex-col">
        <HeroSection />
        <TechBar />
      </main>
    </div>
  );
}
