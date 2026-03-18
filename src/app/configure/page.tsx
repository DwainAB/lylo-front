"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import ConfigPanel from "@/components/configure/ConfigPanel";
import { useTranslation } from "@/i18n/LanguageContext";
import { useSession } from "@/context/SessionContext";

export default function ConfigurePage() {
  const { t } = useTranslation();
  const { endSession, sessionData } = useSession();

  useEffect(() => {
    if (sessionData) {
      endSession();
    }
  }, []);


  return (
    <div className="relative h-dvh w-full flex flex-col bg-stone-50 overflow-hidden">
      <Navbar showActions={false} transparent />

      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-4 pb-8 [@media(max-height:620px)]:py-1 [@media(max-height:620px)]:pb-2 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-warm-cream rounded-full blur-[100px]" />
        </div>

        <ConfigPanel />

        {/* Footer */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 w-full flex justify-center pointer-events-none">
          <p className="text-primary/35 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold">
            {t("configure.footer")}
          </p>
        </div>
      </main>
    </div>
  );
}
