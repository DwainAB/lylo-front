import Button from "@/components/ui/Button";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function HeroSection() {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Content */}
      <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          AI Personal Perfumer
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-6 font-display">
          Le studio des parfums
        </h1>

        {/* Subtitle */}
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-white/90 text-xl md:text-2xl font-light italic">
            Rose, your virtual assistant.
          </p>
          <p className="text-white/70 text-sm md:text-base tracking-wide uppercase">
            Click on &apos;Introduction&apos; to learn more.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" size="lg" className="shadow-2xl shadow-black/20 hover:scale-[1.02]">
            <MaterialIcon name="auto_awesome" />
            Get started
          </Button>
          <Button variant="ghost" size="lg">
            <MaterialIcon name="play_circle" />
            Introduction
          </Button>
        </div>
      </div>

      {/* Floating tech element */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 text-[10px] tracking-widest uppercase">
          Scent Mapping Engine v4.2
        </div>
      </div>
    </div>
  );
}
