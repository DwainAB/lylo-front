import MaterialIcon from "@/components/ui/MaterialIcon";

const techPartners = [
  { icon: "psychology", name: "OpenAI" },
  { icon: "data_object", name: "TensorFlow" },
  { icon: "cloud_queue", name: "Azure AI" },
  { icon: "science", name: "LabVantage" },
];

export default function TechBar() {
  return (
    <section className="py-4 px-6 bg-white/50 border-y border-primary/5">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Tech logos */}
        <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale scale-75 md:scale-90">
          {techPartners.map((partner) => (
            <div key={partner.name} className="flex items-center gap-2">
              <MaterialIcon name={partner.icon} className="text-2xl" />
              <span className="font-bold text-lg tracking-tighter">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-12 bg-primary/20 md:h-8 md:w-px" />

        {/* Rose Assistant card */}
        <div className="flex items-center gap-3 bg-white/40 p-2 px-4 rounded-lg border border-primary/10">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white scale-75">
            <MaterialIcon name="robot_2" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Rose Assistant
            </p>
            <p className="text-xs italic font-medium">
              &ldquo;Matching 3 notes for your morning in Paris.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
