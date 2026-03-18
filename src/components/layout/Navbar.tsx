"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/i18n/LanguageContext";
import MicCalibrator from "@/components/preparation/MicCalibrator";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

interface NavbarProps {
  showActions?: boolean;
  transparent?: boolean;
}

export default function Navbar({ showActions = true, transparent = false }: NavbarProps) {
  const { t } = useTranslation();
  const { user, logout, loginModalOpen, openLoginModal, closeLoginModal } = useAuth();

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 600);
    }
  }, []);

  return (
    <>
      <header className={`fixed top-0 z-50 w-full px-6 lg:px-20 py-2 ${transparent ? "" : "glass-nav border-b border-primary/10"}`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={handleLogoClick}>
            <Image src="/logo-sdp.png" alt="Logo SDP" width={40} height={40} style={{ width: "auto", height: "auto" }} />
          </Link>

          {/* Right side */}
          {showActions && (
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3 sm:gap-6">
                <MicCalibrator />
                <LanguageSelector />
                <div className="flex gap-3 items-center">
                  {user ? (
                    <>
                      <span className="hidden sm:block text-sm text-primary/70 font-medium">
                        {t("auth.welcome")}, {user.first_name}
                      </span>
                      <Button variant="outline" className="hidden sm:flex" onClick={logout}>
                        {t("auth.logout")}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="hidden sm:flex" onClick={openLoginModal}>
                      {t("nav.login")}
                    </Button>
                  )}
                  {user && <Button variant="primary">{t("nav.getStarted")}</Button>}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal open={loginModalOpen} onClose={closeLoginModal} />
    </>
  );
}
