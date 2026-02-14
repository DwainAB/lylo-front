interface AvatarSectionProps {
  name: string;
  role: string;
  imageUrl: string;
}

export default function AvatarSection({ name, role, imageUrl }: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center text-center shrink-0">
      <div className="relative">
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
        {(name || role) && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1 shadow-sm whitespace-nowrap">
            <h1 className="text-sm font-light tracking-wide italic text-primary">
              {name}
            </h1>
            <p className="text-stone-400 text-[8px] tracking-[0.3em] uppercase">
              {role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
