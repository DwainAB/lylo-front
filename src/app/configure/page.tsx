"use client";

import Navbar from "@/components/layout/Navbar";
import ConfigPanel from "@/components/configure/ConfigPanel";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ConfigurePage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-screen w-full flex-col bg-stone-50 overflow-hidden">
      <Navbar showActions={false} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-cream rounded-full blur-[100px]" />
        </div>

        <ConfigPanel />

        {/* Footer */}
        <div className="absolute bottom-8 left-0 w-full flex justify-center">
          <p className="text-primary/40 text-[10px] uppercase tracking-[0.2em] font-bold">
            {t("configure.footer")}
          </p>
        </div>
      </main>
    </div>
  );
}
