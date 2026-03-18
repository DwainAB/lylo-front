"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function HeroSection() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { user, openLoginModal } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }
    const audioFile = locale === "en" ? "/intro-boy-en.wav" : "/intro-girl-fr.wav";
    const audio = new Audio(audioFile);
    audioRef.current = audio;
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Content */}
      <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          {t("home.badge")}
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-6 font-display">
          {t("home.title")}
        </h1>

        {/* Subtitle */}
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-white/90 text-xl md:text-2xl font-light italic">
            {t("home.subtitle")}
          </p>
          <p className="text-white/70 text-sm md:text-base tracking-wide uppercase">
            {t("home.cta")}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {user ? (
            <Button variant="primary" size="lg" className="shadow-2xl shadow-black/20 hover:scale-[1.02]" onClick={() => { localStorage.setItem("language", locale); router.push("/configure"); }}>
              <MaterialIcon name="auto_awesome" />
              {t("home.getStarted")}
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="shadow-2xl shadow-black/20 hover:scale-[1.02]" onClick={openLoginModal}>
              <MaterialIcon name="login" />
              {t("nav.login")}
            </Button>
          )}
          <Button variant="ghost" size="lg" onClick={handlePlayAudio}>
            {isPlaying ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <MaterialIcon name="play_circle" />
            )}
            {isPlaying ? t("home.playing") : t("home.introduction")}
          </Button>
        </div>
      </div>

      {/* Floating tech element */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 text-[10px] tracking-widest uppercase">
          {t("home.floatingLabel")}
        </div>
      </div>
    </div>
  );
}
