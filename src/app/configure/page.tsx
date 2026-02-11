import ConfigHeader from "@/components/configure/ConfigHeader";
import ConfigPanel from "@/components/configure/ConfigPanel";

export default function ConfigurePage() {
  return (
    <div className="relative flex h-screen w-full flex-col bg-stone-50 overflow-hidden">
      <ConfigHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-cream rounded-full blur-[100px]" />
        </div>

        <ConfigPanel />

        {/* Footer */}
        <div className="absolute bottom-8 left-0 w-full flex justify-center">
          <p className="text-primary/40 text-[10px] uppercase tracking-[0.2em] font-bold">
            Handcrafted by Le Studio Des Parfums © 2024
          </p>
        </div>
      </main>
    </div>
  );
}
