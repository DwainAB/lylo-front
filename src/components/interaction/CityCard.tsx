"use client";

interface CityCardProps {
  name: string;
  imageUrl: string;
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
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-white text-xs tracking-widest uppercase font-semibold">
          {name}
        </span>
      </div>
    </div>
  );
}
