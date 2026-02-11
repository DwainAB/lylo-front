interface AvatarSectionProps {
  name: string;
  role: string;
  imageUrl: string;
}

export default function AvatarSection({ name, role, imageUrl }: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 shrink-0">
      <div className="relative group">
        <div className="size-32 md:size-40 rounded-full overflow-hidden border-4 border-white ai-glow transition-transform duration-500 hover:scale-105">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${imageUrl}')`,
              transform: "scale(1.4)",
              transformOrigin: "top center",
            }}
          />
        </div>
        <div className="absolute bottom-2 right-2 size-5 bg-primary rounded-full border-4 border-background-light" />
      </div>
      <div>
        <h1 className="text-2xl font-light tracking-wide italic text-primary">
          {name}
        </h1>
        <p className="text-stone-400 text-[10px] tracking-[0.4em] uppercase mt-1">
          {role}
        </p>
      </div>
    </div>
  );
}
