"use client";

import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import PersonaSelector from "./PersonaSelector";
import DepthSelector from "./DepthSelector";
import StepIndicator from "./StepIndicator";

export default function ConfigPanel() {
  const [persona, setPersona] = useState("male");
  const [depth, setDepth] = useState("4");

  return (
    <div className="glass-panel w-full max-w-lg rounded-xl p-8 shadow-2xl relative z-10 border border-primary/5">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-primary/40" />
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
            Configuration
          </span>
          <span className="h-px w-8 bg-primary/40" />
        </div>
        <h1 className="text-primary tracking-tight text-3xl font-bold leading-tight mb-3 font-display">
          Customize your experience
        </h1>
        <p className="text-primary/70 text-sm font-medium">
          Fine-tune your AI olfactive consultant
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8">
        <PersonaSelector value={persona} onChange={setPersona} />
        <DepthSelector value={depth} onChange={setDepth} />

        {/* Continue button */}
        <div className="pt-6">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
            <span>Continue</span>
            <MaterialIcon name="arrow_forward" />
          </button>
        </div>
      </div>

      <StepIndicator currentStep={0} totalSteps={3} />
    </div>
  );
}
