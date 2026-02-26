"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "@/context/SessionContext";
import MaterialIcon from "@/components/ui/MaterialIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function MailPreviewButton() {
  const { sessionState, sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset cached content when session changes
  useEffect(() => {
    setHtmlContent(null);
    setIsOpen(false);
  }, [sessionData?.session_id]);

  if (sessionState !== "customization") return null;

  const sessionId = sessionData?.session_id;

  const handleOpen = async () => {
    if (!sessionId) return;
    setIsOpen(true);
    if (!htmlContent) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/session/${sessionId}/mail`);
        const html = await res.text();
        setHtmlContent(html);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleDownload = () => {
    if (!sessionId) return;
    window.open(`${API_BASE}/api/session/${sessionId}/mail/download`, "_blank");
  };

  return (
    <>
      {/* Floating trigger button — bottom-left pour ne pas chevaucher la colonne email à droite */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:brightness-110 transition-all duration-200"
        >
          <MaterialIcon name="mail" className="text-[18px]" />
          Voir l&apos;email
        </button>
      </div>

      {/* Modal — portal to escape stacking contexts */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-light/75 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <div
              className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: "80vh" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-primary/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <MaterialIcon name="mail" className="text-primary text-xl" />
                  <h2 className="font-bold text-primary tracking-widest uppercase text-xs">
                    Aperçu de l&apos;email
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/5 transition-colors"
                  >
                    <MaterialIcon name="download" className="text-[16px]" />
                    Télécharger
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex items-center justify-center size-7 rounded-full text-[#7f6f66] hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <MaterialIcon name="close" className="text-[18px]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="size-5 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
                  </div>
                ) : htmlContent ? (
                  <iframe
                    srcDoc={htmlContent}
                    title="Aperçu de l'email"
                    sandbox="allow-same-origin"
                    className="w-full border-0"
                    style={{ minHeight: "500px", height: "100%" }}
                  />
                ) : null}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
