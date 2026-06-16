import { FormulaNote, FormulaSize } from "@/context/SessionContext";
import { SizeOption } from "@/components/recommendations/SizeToggle";
import { AppLanguage } from "@/lib/language";

export interface ShareableFormula {
  profile: string;
  size: SizeOption;
  notes: {
    top: FormulaNote[];
    heart: FormulaNote[];
    base: FormulaNote[];
    boosters: FormulaNote[];
  };
}

interface EncodedNote {
  n: string;
  m: number;
}

interface EncodedFormulaPayload {
  p: string;
  s: SizeOption;
  t: EncodedNote[];
  h: EncodedNote[];
  b: EncodedNote[];
  o: EncodedNote[];
}

function encodeNotes(notes: FormulaNote[]): EncodedNote[] {
  return notes.map((note) => ({
    n: note.name,
    m: note.ml,
  }));
}

function decodeNotes(notes: EncodedNote[]): FormulaNote[] {
  return notes.map((note) => ({
    name: note.n,
    ml: note.m,
  }));
}

export function createShareableFormula(
  profile: string,
  selectedSize: SizeOption,
  sizes: {
    "10ml": FormulaSize;
    "30ml": FormulaSize;
    "50ml": FormulaSize;
  },
): ShareableFormula {
  const size = sizes[selectedSize];

  return {
    profile,
    size: selectedSize,
    notes: {
      top: size.top_notes,
      heart: size.heart_notes,
      base: size.base_notes,
      boosters: size.boosters,
    },
  };
}

export function encodeShareableFormula(formula: ShareableFormula): string {
  const payload: EncodedFormulaPayload = {
    p: formula.profile,
    s: formula.size,
    t: encodeNotes(formula.notes.top),
    h: encodeNotes(formula.notes.heart),
    b: encodeNotes(formula.notes.base),
    o: encodeNotes(formula.notes.boosters),
  };

  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodeShareableFormula(payload: string): ShareableFormula | null {
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as Partial<EncodedFormulaPayload>;

    if (!parsed || typeof parsed.p !== "string") {
      return null;
    }

    return {
      profile: parsed.p,
      size: parsed.s === "10ml" || parsed.s === "50ml" ? parsed.s : "30ml",
      notes: {
        top: decodeNotes(Array.isArray(parsed.t) ? parsed.t : []),
        heart: decodeNotes(Array.isArray(parsed.h) ? parsed.h : []),
        base: decodeNotes(Array.isArray(parsed.b) ? parsed.b : []),
        boosters: decodeNotes(Array.isArray(parsed.o) ? parsed.o : []),
      },
    };
  } catch {
    return null;
  }
}

export function resolveShareBaseUrl(origin: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return origin.replace(/\/$/, "");
}

export function buildFormulaShareUrl(formula: ShareableFormula, language: AppLanguage, origin: string): string {
  const params = new URLSearchParams({
    data: encodeShareableFormula(formula),
    lang: language,
  });

  return `${resolveShareBaseUrl(origin)}/formula?${params.toString()}`;
}
