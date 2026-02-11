interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">
        Step {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
      </span>
      <div className="w-32 h-[1px] bg-primary/20">
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
