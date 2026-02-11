interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full ${
            i === currentStep
              ? "w-8 bg-primary"
              : "w-4 bg-primary/20"
          }`}
        />
      ))}
    </div>
  );
}
