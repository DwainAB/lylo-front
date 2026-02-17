"use client";

interface CityCardProps {
  name: string;
  imageUrl?: string;
  selected?: boolean;
  onSelect: (name: string) => void;
}

export default function CityCard({ name, imageUrl, selected, onSelect }: CityCardProps) {
  return (
    <div
      onClick={() => onSelect(name)}
      className={`h-full min-h-0 rounded-2xl overflow-hidden group cursor-pointer border-2 transition-all duration-500 relative bg-stone-200 ${
        selected ? "border-primary" : "border-transparent hover:border-primary"
      }`}
    >
      {imageUrl ? (
        <>
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 group-hover:from-stone-700 group-hover:to-stone-800 transition-colors duration-500" />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-white/30 backdrop-blur-sm py-2 sm:py-3 text-center">
        <span className="text-white text-[10px] sm:text-xs tracking-widest uppercase font-semibold drop-shadow-md">
          {name}
        </span>
      </div>
    </div>
  );
}
