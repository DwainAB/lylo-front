export interface Choice {
  label: string;
  image?: string;
  color?: string;
}

export interface ChildQuestion {
  questionTop: string;
  questionBottom: string;
  choices: Choice[];
}

export const CARD_COLORS = [
  { bg: "linear-gradient(135deg,#FFF7ED,#FFEDD5)", text: "#EA580C", border: "#FDBA74" },
  { bg: "linear-gradient(135deg,#FEFCE8,#FEF9C3)", text: "#A16207", border: "#FDE047" },
  { bg: "linear-gradient(135deg,#FDF2F8,#FCE7F3)", text: "#EC4899", border: "#F9A8D4" },
  { bg: "linear-gradient(135deg,#F5F3FF,#EDE9FE)", text: "#7C3AED", border: "#C4B5FD" },
  { bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", text: "#2563EB", border: "#93C5FD" },
  { bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", text: "#B45309", border: "#FCD34D" },
] as const;

export const FLOATING_ELEMENTS = [
  { icon: "star",         color: "#FF6B6B", cls: "top-20 left-[5%]",     delay: "0s",   size: "text-5xl" },
  { icon: "auto_awesome", color: "#4ECDC4", cls: "top-36 right-[8%]",    delay: "1s",   size: "text-4xl" },
  { icon: "bubble_chart", color: "#FFD93D", cls: "bottom-16 left-[8%]",  delay: "0.5s", size: "text-5xl" },
  { icon: "favorite",     color: "#FF6B6B", cls: "bottom-32 right-[5%]", delay: "1.5s", size: "text-4xl" },
] as const;

export const CHILD_QUESTIONS: ChildQuestion[] = [
  {
    questionTop:    "Quels sont tes deux plats préférés ?",
    questionBottom: "Quels sont les deux plats que tu aimes le moins ?",
    choices: [
      { label: "Pizza",  image: "/pizza.jpeg" },
      { label: "Pâtes",  image: "/pate.webp"  },
      { label: "Burger", image: "/burger.jpg"  },
      { label: "Sushi",  image: "/sushi.webp"  },
      { label: "Frites", image: "/frite.webp"  },
      { label: "Salade", image: "/salade.jpg"  },
    ],
  },
  {
    questionTop:    "Quels sont tes deux desserts préférés ?",
    questionBottom: "Quels sont les deux desserts que tu aimes le moins ?",
    choices: [
      { label: "Glace",   image: "/glace.webp"  },
      { label: "Gâteau",  image: "/gateau.jpg"  },
      { label: "Crêpe",   image: "/crepe.webp"  },
      { label: "Cookie",  image: "/cookie.jpeg" },
      { label: "Macaron", image: "/macaron.jpg" },
      { label: "Mousse",  image: "/mousse.jpg"  },
    ],
  },
  {
    questionTop:    "Quels sont tes deux dessins animés préférés ?",
    questionBottom: "Quels sont les deux dessins animés que tu aimes le moins ?",
    choices: [
      { label: "Toy Story",           image: "/toy-story.jpg"       },
      { label: "La reine des neiges", image: "/reine-des-neige.jpg" },
      { label: "Kpop demon hunter",   image: "/kpop.jpg"            },
      { label: "Encanto",             image: "/encanto.jpeg"        },
      { label: "Nemo",                image: "/nemo.webp"           },
      { label: "Zootopie",            image: "/zootopie.png"        },
    ],
  },
  {
    questionTop:    "Quelles sont tes deux couleurs préférées ?",
    questionBottom: "Quelles sont les deux couleurs que tu aimes le moins ?",
    choices: [
      { label: "Rouge",  color: "#EF4444" },
      { label: "Bleu",   color: "#3B82F6" },
      { label: "Vert",   color: "#22C55E" },
      { label: "Jaune",  color: "#EAB308" },
      { label: "Violet", color: "#8B5CF6" },
      { label: "Rose",   color: "#EC4899" },
    ],
  },
  {
    questionTop:    "Quels sont tes deux animaux préférés ?",
    questionBottom: "Quels sont les deux animaux que tu aimes le moins ?",
    choices: [
      { label: "Chien",   image: "/chien.webp"   },
      { label: "Chat",    image: "/chat.jpeg"    },
      { label: "Lapin",   image: "/lapin.jpeg"   },
      { label: "Dauphin", image: "/dauphin.webp" },
      { label: "Panda",   image: "/panda.jpg"    },
      { label: "Lion",    image: "/lion.jpeg"    },
    ],
  },
];
