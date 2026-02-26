"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { MOCK_FORMULAS, MOCK_QUESTIONS } from "@/lib/mockData";

export const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export type SessionState =
  | "idle"
  | "connecting"
  | "collecting_profile"
  | "questionnaire"
  | "generating_formulas"
  | "completed"
  | "customization"
  | "standby";

export interface ProfileUpdate {
  field: string;
  value: string;
  profile_complete: boolean;
  missing_fields: string[];
}

export interface AnswerSaved {
  question_id: number;
  top_2: string[];
  bottom_2: string[];
}

export interface FormulaNote {
  name: string;
  ml: number;
  family?: string;
  description?: string;
  note_type?: string;
  priority?: string;
}

export interface FormulaSize {
  target_ml: number;
  top_notes: FormulaNote[];
  heart_notes: FormulaNote[];
  base_notes: FormulaNote[];
  boosters: FormulaNote[];
}

export interface Formula {
  profile: string;
  description: string;
  score: number;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  sizes: {
    "10ml": FormulaSize;
    "30ml": FormulaSize;
    "50ml": FormulaSize;
  };
}

export interface Choice {
  label: string;
  image: string;
}

export interface Question {
  id: number;
  question: string;
  choices: Choice[];
}

export interface TranscriptMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: number;
}

interface SessionData {
  session_id: string;
  room_name: string;
  token: string;
  livekit_url: string;
  identity: string;
}

interface SessionContextType {
  sessionData: SessionData | null;
  sessionState: SessionState;
  profile: Record<string, string>;
  missingFields: string[];
  answers: AnswerSaved[];
  formulas: Formula[];
  transcripts: TranscriptMessage[];
  questions: Question[];
  currentQuestionIndex: number;
  questionCount: number;
  agentName: string;
  hiddenChoices: string[];
  requestingEmail: boolean;
  devMode: boolean;
  startSession: () => Promise<void>;
  endSession: () => void;
  setSessionState: (state: SessionState) => void;
  handleDataMessage: (payload: Uint8Array) => void;
  upsertTranscript: (msg: TranscriptMessage) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>(DEV_MODE ? "completed" : "idle");
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [answers, setAnswers] = useState<AnswerSaved[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>(DEV_MODE ? MOCK_FORMULAS : []);
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);
  const [questions, setQuestions] = useState<Question[]>(DEV_MODE ? MOCK_QUESTIONS : []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(DEV_MODE ? MOCK_QUESTIONS.length : 0);
  const [agentName, setAgentName] = useState("Rose");
  const [hiddenChoices, setHiddenChoices] = useState<string[]>([]);
  const [requestingEmail, setRequestingEmail] = useState(false);

  const startSession = useCallback(async () => {
    if (DEV_MODE) return;
    setSessionState("connecting");

    const language = (localStorage.getItem("avatarLocale") as "fr" | "en") || "fr";
    const voice_gender =
      (localStorage.getItem("persona") as "female" | "male") || "female";
    setAgentName(voice_gender === "male" ? "Carlosse" : "Rose");
    const depth = localStorage.getItem("depth") || "1";
    const question_count = parseInt(depth, 10);
    setQuestionCount(question_count);
    const mode = localStorage.getItem("mode") || "guided";

    const res = await fetch(`${API_BASE}/api/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, voice_gender, question_count, mode }),
    });

    const data: SessionData = await res.json();
    setSessionData(data);
    setSessionState("collecting_profile");

    // Fetch questions for this session
    const sessionRes = await fetch(`${API_BASE}/api/session/${data.session_id}`);
    const sessionInfo = await sessionRes.json();
    if (sessionInfo.questions) {
      setQuestions(sessionInfo.questions);
      setQuestionCount(sessionInfo.questions.length);
    }
  }, []);

  const handleDataMessage = useCallback((payload: Uint8Array) => {
    try {
      const event = JSON.parse(new TextDecoder().decode(payload));

      switch (event.type) {
        case "profile_update":
          setProfile((prev) => ({
            ...prev,
            [event.field]: event.value,
          }));
          setMissingFields(event.missing_fields || []);
          break;

        case "state_change":
          setSessionState(event.state as SessionState);
          break;

        case "top_2_selected":
          setHiddenChoices(event.top_2 || []);
          break;

        case "answer_saved":
          setHiddenChoices([]);
          setAnswers((prev) => {
            const isNew = !prev.some((a) => a.question_id === event.question_id);
            if (isNew) {
              setCurrentQuestionIndex((i) => i + 1);
            }
            return [
              ...prev.filter((a) => a.question_id !== event.question_id),
              {
                question_id: event.question_id,
                top_2: event.top_2,
                bottom_2: event.bottom_2,
              },
            ];
          });
          break;

        case "formulas_generated":
          setFormulas(event.formulas || []);
          setSessionState("completed");
          break;

        case "formula_selected":
          setFormulas([event.formula]);
          setSessionState("customization");
          break;

        case "formula_updated":
          setFormulas([event.formula]);
          break;

        case "requesting_email":
          if (event.requesting_email) setRequestingEmail(true);
          break;
      }
    } catch {
      // ignore malformed messages
    }
  }, []);

  const endSession = useCallback(() => {
    // Fire-and-forget : on nettoie en fond, pas besoin d'attendre
    if (sessionData?.session_id) {
      fetch(`${API_BASE}/api/session/${sessionData.session_id}`, {
        method: "DELETE",
      });
    }
    setSessionData(null);
    setSessionState("idle");
    setProfile({});
    setMissingFields([]);
    setAnswers([]);
    setFormulas([]);
    setTranscripts([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setHiddenChoices([]);
    setRequestingEmail(false);
  }, [sessionData]);

  const upsertTranscript = useCallback((msg: TranscriptMessage) => {
    setTranscripts((prev) => {
      const idx = prev.findIndex((m) => m.id === msg.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], text: msg.text };
        return updated;
      }
      return [...prev, msg];
    });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        sessionData,
        sessionState,
        profile,
        missingFields,
        answers,
        formulas,
        transcripts,
        questions,
        currentQuestionIndex,
        questionCount,
        agentName,
        hiddenChoices,
        requestingEmail,
        devMode: DEV_MODE,
        startSession,
        endSession,
        setSessionState,
        handleDataMessage,
        upsertTranscript,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
