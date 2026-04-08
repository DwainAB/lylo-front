"use client";

import { useEffect, useState } from "react";
import { FormulaSize, FormulaNote } from "@/context/SessionContext";
import { SizeOption } from "./SizeToggle";

interface PrintFormula {
  name: string;
  sizes: {
    "10ml": FormulaSize;
    "30ml": FormulaSize;
    "50ml": FormulaSize;
  };
}

interface PrintViewProps {
  formulas: PrintFormula[];
  agentName: string;
  onClose: () => void;
}

function NoteSection({ label, notes }: { label: string; notes: FormulaNote[] }) {
  if (!notes || notes.length === 0) return null;
  return (
    <div className="print-note-section">
      <div className="print-note-label">{label}</div>
      {notes.map((note) => (
        <div key={note.name} className="print-note-row">
          <span className="print-note-name">{note.name}</span>
          <span className="print-note-dots" />
          <span className="print-note-ml">{note.ml} ml</span>
        </div>
      ))}
    </div>
  );
}

export default function PrintView({ formulas, agentName, onClose }: PrintViewProps) {
  const [selectedSize, setSelectedSize] = useState<SizeOption>("30ml");
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    const sizeData = (formula: PrintFormula) => formula.sizes[selectedSize];

    const notesHtml = (label: string, notes: FormulaNote[]) => {
      if (!notes || notes.length === 0) return "";
      return `
        <div class="note-section">
          <div class="note-label">${label}</div>
          ${notes.map((n) => `
            <div class="note-row">
              <span class="note-name">${n.name}</span>
              <span class="note-dots"></span>
              <span class="note-ml">${n.ml} ml</span>
            </div>
          `).join("")}
        </div>`;
    };

    const formulasHtml = formulas.map((f) => {
      const d = sizeData(f);
      return `
        <div class="formula">
          <div class="formula-name">${f.name}</div>
          <div class="formula-badge">Format ${selectedSize}</div>
          <div class="notes">
            ${notesHtml("Notes de tête", d.top_notes)}
            ${notesHtml("Notes de cœur", d.heart_notes)}
            ${notesHtml("Notes de fond", d.base_notes)}
            ${notesHtml("Boosters", d.boosters)}
          </div>
        </div>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Formule Lylo – ${today}</title>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4;
      margin: 20mm 18mm;
    }

    body {
      font-family: 'EB Garamond', Georgia, serif;
      color: #2a2018;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── En-tête ── */
    .header {
      text-align: center;
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(153,111,86,0.25);
    }
    .brand {
      font-size: 9px;
      letter-spacing: 0.45em;
      text-transform: uppercase;
      color: #996f56;
      margin-bottom: 10px;
    }
    .title {
      font-size: 28px;
      font-weight: 400;
      letter-spacing: 0.04em;
      color: #2a2018;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #b09a8c;
    }
    .date {
      font-size: 10px;
      color: #b09a8c;
      margin-top: 8px;
      font-style: italic;
    }

    /* ── Grille de formules ── */
    .formulas {
      display: grid;
      grid-template-columns: repeat(${formulas.length > 1 ? 2 : 1}, 1fr);
      gap: 24px;
    }

    .formula {
      border: 1px solid rgba(153,111,86,0.22);
      border-radius: 10px;
      padding: 20px 22px;
      background: #fff;
      position: relative;
      overflow: hidden;
      break-inside: avoid;
    }
    .formula::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #996f56, #d7cdc6);
    }

    .formula-name {
      font-size: 17px;
      letter-spacing: 0.08em;
      color: #996f56;
      text-align: center;
      margin-bottom: 4px;
      margin-top: 6px;
    }
    .formula-badge {
      text-align: center;
      margin-bottom: 18px;
      font-size: 8px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #996f56;
    }

    /* ── Notes ── */
    .notes { display: flex; flex-direction: column; gap: 14px; }

    .note-section { display: flex; flex-direction: column; gap: 3px; }

    .note-label {
      font-size: 7.5px;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: #996f56;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .note-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .note-name { font-size: 12px; color: #3a2e27; white-space: nowrap; }
    .note-dots {
      flex: 1;
      border-bottom: 1px dotted rgba(153,111,86,0.3);
      margin-bottom: 3px;
    }
    .note-ml { font-size: 11px; font-weight: 600; color: #996f56; white-space: nowrap; }

    /* ── Footer ── */
    .footer {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px solid rgba(153,111,86,0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      color: #b09a8c;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .footer-logo {
      font-size: 14px;
      color: #996f56;
      letter-spacing: 0.18em;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">${agentName} · Parfumerie sur mesure</div>
    <div class="title">Votre Formule Personnalisée</div>
    <div class="subtitle">Créée avec soin pour vous</div>
    <div class="date">Le ${today}</div>
  </div>

  <div class="formulas">
    ${formulasHtml}
  </div>

  <div class="footer">
    <span class="footer-logo">Lylo</span>
    <span>Document personnel · Ne pas redistribuer</span>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    // Attendre que la police soit chargée avant d'imprimer
    win.onload = () => {
      setTimeout(() => {
        win.focus();
        win.print();
        win.close();
      }, 600);
    };
  };

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Styles injectés pour la vue d'impression */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .print-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(28, 24, 22, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .print-modal {
          background: #fdfbf9;
          border-radius: 16px;
          max-width: 760px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.4);
          position: relative;
        }

        .print-actions {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #fdfbf9;
          border-radius: 16px 16px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(215, 205, 198, 0.4);
        }

        .print-actions-title {
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          color: #996f56;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .print-actions-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-close {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(153, 111, 86, 0.25);
          background: transparent;
          color: #996f56;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          letter-spacing: 0.05em;
        }

        .btn-close:hover {
          background: rgba(153, 111, 86, 0.06);
          border-color: rgba(153, 111, 86, 0.5);
        }

        .btn-print {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: 100px;
          border: none;
          background: #996f56;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(153, 111, 86, 0.35);
          letter-spacing: 0.05em;
        }

        .btn-print:hover {
          filter: brightness(1.1);
          box-shadow: 0 6px 18px rgba(153, 111, 86, 0.45);
        }

        /* ── Page imprimable ── */
        .print-page {
          padding: 48px 56px;
          font-family: 'EB Garamond', serif;
          color: #2a2018;
        }

        .print-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(153, 111, 86, 0.2);
        }

        .print-brand {
          font-size: 0.7rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #996f56;
          margin-bottom: 12px;
        }

        .print-title {
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #2a2018;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .print-subtitle {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b09a8c;
        }

        .print-date {
          font-size: 0.75rem;
          color: #b09a8c;
          margin-top: 8px;
          font-style: italic;
        }

        /* ── Formules ── */
        .print-formulas {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
        }

        .print-formula {
          border: 1px solid rgba(153, 111, 86, 0.2);
          border-radius: 12px;
          padding: 24px;
          background: white;
          position: relative;
          overflow: hidden;
        }

        .print-formula::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #996f56, #d7cdc6);
        }

        .print-formula-name {
          font-family: 'EB Garamond', serif;
          font-size: 1.25rem;
          letter-spacing: 0.08em;
          color: #996f56;
          text-align: center;
          margin-bottom: 4px;
        }

        .print-formula-size-badge {
          text-align: center;
          margin-bottom: 20px;
        }

        .print-formula-size-badge span {
          display: inline-block;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          background: rgba(153, 111, 86, 0.08);
          color: #996f56;
          border: 1px solid rgba(153, 111, 86, 0.2);
          border-radius: 100px;
          padding: 2px 12px;
        }

        .print-notes-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .print-note-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .print-note-label {
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #996f56;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .print-note-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .print-note-name {
          font-size: 0.9rem;
          color: #3a2e27;
          white-space: nowrap;
        }

        .print-note-dots {
          flex: 1;
          border-bottom: 1px dotted rgba(153, 111, 86, 0.25);
          margin-bottom: 3px;
        }

        .print-note-ml {
          font-size: 0.85rem;
          font-weight: 500;
          color: #996f56;
          white-space: nowrap;
        }

        /* ── Footer ── */
        .print-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(153, 111, 86, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          color: #b09a8c;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .print-footer-logo {
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          color: #996f56;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

      `}</style>

      <div id="lylo-print-root">
        <div className="print-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="print-modal">

            {/* ── Barre d'actions sticky ── */}
            <div className="print-actions">
              <span className="print-actions-title">Aperçu avant impression</span>
              <div className="print-actions-buttons">
                {/* Sélecteur de taille */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginRight: "8px" }}>
                  {(["10ml", "30ml", "50ml"] as SizeOption[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "100px",
                        border: "1px solid",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                        background: selectedSize === s ? "#996f56" : "transparent",
                        color: selectedSize === s ? "white" : "#996f56",
                        borderColor: selectedSize === s ? "#996f56" : "rgba(153,111,86,0.3)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button className="btn-close" onClick={onClose}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                  Fermer
                </button>
                <button className="btn-print" onClick={handlePrint}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>print</span>
                  Imprimer
                </button>
              </div>
            </div>

            {/* ── Contenu de la page imprimable ── */}
            <div className="print-page">

              {/* En-tête */}
              <div className="print-header">
                <div className="print-brand">{agentName} · Parfumerie sur mesure</div>
                <div className="print-title">Votre Formule Personnalisée</div>
                <div className="print-subtitle">Créée avec soin pour vous</div>
                <div className="print-date">Le {today}</div>
              </div>

              {/* Formules */}
              <div className="print-formulas">
                {formulas.map((formula, i) => {
                  const sizeData = formula.sizes[selectedSize];
                  return (
                    <div key={i} className="print-formula">
                      <div className="print-formula-name">{formula.name}</div>
                      <div className="print-formula-size-badge">
                        <span>Format {selectedSize}</span>
                      </div>
                      <div className="print-notes-container">
                        <NoteSection label="Notes de tête" notes={sizeData.top_notes} />
                        <NoteSection label="Notes de cœur" notes={sizeData.heart_notes} />
                        <NoteSection label="Notes de fond" notes={sizeData.base_notes} />
                        <NoteSection label="Boosters" notes={sizeData.boosters} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="print-footer">
                <span className="print-footer-logo">Lylo</span>
                <span>Document personnel · Ne pas redistribuer</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
