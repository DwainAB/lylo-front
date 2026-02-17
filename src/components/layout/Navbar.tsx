"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/i18n/LanguageContext";

interface NavbarProps {
  showActions?: boolean;
  transparent?: boolean;
}

export default function Navbar({ showActions = true, transparent = false }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <header className={`fixed top-0 z-50 w-full px-6 lg:px-20 py-2 ${transparent ? "" : "glass-nav border-b border-primary/10"}`}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-sdp.png" alt="Logo SDP" width={40} height={40} />
        </Link>

        {/* Right side */}
        {showActions && (
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              <LanguageSelector />
              <div className="flex gap-3">
                <Button variant="outline" className="hidden sm:flex">
                  {t("nav.login")}
                </Button>
                <Button variant="primary">{t("nav.getStarted")}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
