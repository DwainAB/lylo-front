import RecommendationsHeader from "@/components/recommendations/RecommendationsHeader";
import FormulaCard from "@/components/recommendations/FormulaCard";
import VoiceButton from "@/components/recommendations/VoiceButton";

const ROSE_AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCIjXIXxFHeF0IZ1fGfF2SkT_DOMGHF13GvAeKVjmEc8d7kEFrp1ptpN8bbF0db9LBI1sIhbzIh37IBuhGgu8ZRENOJDESI2ePdufvyAlrVNWDpVTgMkYVhXmEqQLCEddI6bB_3rJ45Dk2SO_H5TgxI3We52-1o2yMu4ZU-i5j0LlIyejnZpqCaHNNFZo_FrU-ITbryhbGUg6pMd7I_N6ZNRxWJYotXb4-lH9Ci63Or4mGQjZ-6370Y4X3R6U3pDewybfy73SRyO4c";

const formulas = [
  {
    name: "Mystic Bloom",
    noteGroups: [
      { label: "Top Notes", notes: "Italian Bergamot, Pink Pepper, Saffron" },
      { label: "Heart Notes", notes: "Damask Rose, Midnight Jasmine, Patchouli" },
      { label: "Base Notes", notes: "White Oud, Amber Resin, Creamy Vanilla" },
    ],
  },
  {
    name: "Citrus Elegance",
    noteGroups: [
      { label: "Top Notes", notes: "Sicilian Lemon, Neroli, Crisp Apple" },
      { label: "Heart Notes", notes: "Orange Blossom, Sea Salt, White Tea" },
      { label: "Base Notes", notes: "Cedarwood, Vetiver, Clean Musk" },
    ],
  },
];

export default function RecommendationsPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-brand-light">
      <RecommendationsHeader />

      <main className="flex-grow flex flex-col items-center justify-center px-4 gap-8">
        {/* AI Avatar section */}
        <div className="text-center">
          <div className="relative inline-block">
            <img
              alt="Rose AI Curator"
              className="w-24 h-24 rounded-full border-2 border-secondary object-cover mx-auto mb-2"
              src={ROSE_AVATAR_URL}
            />
            <div className="absolute bottom-2 right-1 w-4 h-4 bg-primary border-2 border-white rounded-full" />
          </div>
          <p className="italic text-primary font-serif">Rose</p>
          <p className="brand-text text-[0.65rem] text-gray-500">
            AI Fragrance Curator
          </p>
          <h1 className="luxury-title text-2xl mt-4 max-w-lg mx-auto leading-tight">
            Here are two perfume formula variations that match your profile.
          </h1>
        </div>

        {/* Formula cards */}
        <div className="flex flex-row gap-6 w-full max-w-5xl justify-center">
          {formulas.map((formula) => (
            <FormulaCard
              key={formula.name}
              name={formula.name}
              noteGroups={formula.noteGroups}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-6 mt-4 mb-8">
          <VoiceButton />
          <button className="text-gray-400 brand-text text-[0.7rem] hover:text-primary transition-colors">
            Return to homepage
          </button>
        </div>
      </main>
    </div>
  );
}
