import InteractionHeader from "@/components/interaction/InteractionHeader";
import AvatarSection from "@/components/interaction/AvatarSection";
import StepProgress from "@/components/interaction/StepProgress";
import CityGrid from "@/components/interaction/CityGrid";
import WaitingIndicator from "@/components/interaction/WaitingIndicator";
import AnswerButton from "@/components/interaction/AnswerButton";

const ROSE_AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDiC-Pa7yaj4UGsi4uwZJCxjTuCb5gcHKC2ITbD6eDi8U1NIpbEsrJwV4pGKeq4rocGN6FmwOi7ONXxoHEmRQZBboSbzkNzcH9Z9it9FJSArCHMu_VXOU3NXZ3a3pD0zloCtoHOtQXyHxZDozU3Fhv5NYXWGTdGuhp4FgxqbxqdxBhSPfXDCpJ0QiBTxNVGuxwFObZmlG3n0CEgtBCSUa6dOjTo9olTSk63eWHElpkGO5F5KcRKD5_bpkd0XnrSDsWiAzSeSh9hBXE";

export default function InteractionPage() {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <InteractionHeader />

      <main className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-2 max-w-6xl mx-auto w-full min-h-0 relative z-10">
        {/* Avatar */}
        <AvatarSection
          name="Rose"
          role="Fragrance Curator"
          imageUrl={ROSE_AVATAR_URL}
        />

        {/* Question section */}
        <div className="w-full flex flex-col items-center gap-4 shrink-0">
          <StepProgress currentStep={2} totalSteps={4} />
          <h3 className="text-3xl md:text-4xl font-extralight tracking-tight text-center max-w-2xl leading-tight">
            Which city speaks to your{" "}
            <span className="italic font-normal text-primary">essence</span>?
          </h3>
        </div>

        {/* City selection grid */}
        <CityGrid />

        {/* Bottom controls */}
        <div className="w-full flex flex-col items-center gap-6 shrink-0 pt-4">
          <WaitingIndicator />
          <div className="flex flex-col items-center gap-2">
            <AnswerButton />
          </div>
        </div>
      </main>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-full opacity-[0.03] pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[60%] opacity-[0.05] pointer-events-none bg-gradient-to-tr from-primary to-transparent blur-[120px]" />
    </div>
  );
}
