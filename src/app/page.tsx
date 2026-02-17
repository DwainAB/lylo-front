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
