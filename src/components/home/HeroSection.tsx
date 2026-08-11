"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { persistLanguage } from "@/lib/language";
import { activeBrand } from "@/lib/brand";

const isEster = activeBrand.id === "ester";

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
        {isEster ? (
          /* Logo (Estée Lauder, large, no text title) */
          <div className="flex justify-center mb-8">
            <Image src={activeBrand.logo} alt="Logo Estée Lauder" width={801} height={101} className="w-[280px] md:w-[400px] lg:w-[520px] h-auto" priority />
          </div>
        ) : (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image src={activeBrand.logo} alt={`Logo ${activeBrand.name}`} width={72} height={72} style={{ width: "auto", height: "auto" }} />
            </div>

            {/* Title */}
            <h1 className="text-white font-light tracking-tight mb-4 font-display flex flex-col items-center leading-tight">
              <span className="text-4xl md:text-5xl lg:text-7xl">{activeBrand.name}</span>
              <span className="text-xl md:text-2xl lg:text-3xl font-medium">{t("home.byWord")}</span>
              <span className="text-4xl md:text-5xl lg:text-7xl">{t("home.title")}</span>
            </h1>
          </>
        )}

        {/* Badge */}
        {isEster ? (
          <p className="text-white/80 text-base md:text-lg font-light mb-6 max-w-xl mx-auto">
            {t("home.esterTagline")}
          </p>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("home.badge")}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {user ? (
            <Button variant="primary" size="lg" className="shadow-2xl shadow-black/20 hover:scale-[1.02]" onClick={() => { persistLanguage(locale === "en" ? "en" : "fr"); router.push("/configure"); }}>
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
          {isEster ? t("home.esterFloatingLabel") : t("home.floatingLabel")}
        </div>
      </div>
    </div>
  );
}
