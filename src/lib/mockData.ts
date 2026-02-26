import { Formula, Question } from "@/context/SessionContext";

// ─── Formules statiques pour le mode dev ───────────────────────────────────

export const MOCK_FORMULAS: Formula[] = [
  {
    profile: "Sérénité Florale",
    description:
      "Une fragrance lumineuse et délicate, évoquant un jardin en fleurs au petit matin.",
    score: 94,
    top_notes: ["Bergamote", "Citron", "Mandarine"],
    heart_notes: ["Rose de Damas", "Jasmin", "Pivoine"],
    base_notes: ["Santal", "Musc blanc", "Vanille"],
    sizes: {
      "10ml": {
        target_ml: 10,
        top_notes: [
          { name: "Bergamote", ml: 1.5 },
          { name: "Citron", ml: 1.0 },
          { name: "Mandarine", ml: 0.5 },
        ],
        heart_notes: [
          { name: "Rose de Damas", ml: 2.5 },
          { name: "Jasmin", ml: 1.5 },
          { name: "Pivoine", ml: 1.0 },
        ],
        base_notes: [
          { name: "Santal", ml: 1.0 },
          { name: "Musc blanc", ml: 0.5 },
          { name: "Vanille", ml: 0.5 },
        ],
        boosters: [],
      },
      "30ml": {
        target_ml: 30,
        top_notes: [
          { name: "Bergamote", ml: 4.5 },
          { name: "Citron", ml: 3.0 },
          { name: "Mandarine", ml: 1.5 },
        ],
        heart_notes: [
          { name: "Rose de Damas", ml: 7.5 },
          { name: "Jasmin", ml: 4.5 },
          { name: "Pivoine", ml: 3.0 },
        ],
        base_notes: [
          { name: "Santal", ml: 3.0 },
          { name: "Musc blanc", ml: 1.5 },
          { name: "Vanille", ml: 1.5 },
        ],
        boosters: [],
      },
      "50ml": {
        target_ml: 50,
        top_notes: [
          { name: "Bergamote", ml: 7.5 },
          { name: "Citron", ml: 5.0 },
          { name: "Mandarine", ml: 2.5 },
        ],
        heart_notes: [
          { name: "Rose de Damas", ml: 12.5 },
          { name: "Jasmin", ml: 7.5 },
          { name: "Pivoine", ml: 5.0 },
        ],
        base_notes: [
          { name: "Santal", ml: 5.0 },
          { name: "Musc blanc", ml: 2.5 },
          { name: "Vanille", ml: 2.5 },
        ],
        boosters: [],
      },
    },
  },
  {
    profile: "Mystère Oriental",
    description:
      "Une fragrance envoûtante et chaleureuse, aux accents épicés et boisés qui séduisent les sens.",
    score: 88,
    top_notes: ["Poivre noir", "Cardamome", "Gingembre"],
    heart_notes: ["Oud", "Patchouli", "Iris"],
    base_notes: ["Cèdre", "Ambre", "Vétiver"],
    sizes: {
      "10ml": {
        target_ml: 10,
        top_notes: [
          { name: "Poivre noir", ml: 1.0 },
          { name: "Cardamome", ml: 0.8 },
          { name: "Gingembre", ml: 0.7 },
        ],
        heart_notes: [
          { name: "Oud", ml: 2.5 },
          { name: "Patchouli", ml: 2.0 },
          { name: "Iris", ml: 1.0 },
        ],
        base_notes: [
          { name: "Cèdre", ml: 1.0 },
          { name: "Ambre", ml: 0.6 },
          { name: "Vétiver", ml: 0.4 },
        ],
        boosters: [],
      },
      "30ml": {
        target_ml: 30,
        top_notes: [
          { name: "Poivre noir", ml: 3.0 },
          { name: "Cardamome", ml: 2.4 },
          { name: "Gingembre", ml: 2.1 },
        ],
        heart_notes: [
          { name: "Oud", ml: 7.5 },
          { name: "Patchouli", ml: 6.0 },
          { name: "Iris", ml: 3.0 },
        ],
        base_notes: [
          { name: "Cèdre", ml: 3.0 },
          { name: "Ambre", ml: 1.8 },
          { name: "Vétiver", ml: 1.2 },
        ],
        boosters: [],
      },
      "50ml": {
        target_ml: 50,
        top_notes: [
          { name: "Poivre noir", ml: 5.0 },
          { name: "Cardamome", ml: 4.0 },
          { name: "Gingembre", ml: 3.5 },
        ],
        heart_notes: [
          { name: "Oud", ml: 12.5 },
          { name: "Patchouli", ml: 10.0 },
          { name: "Iris", ml: 5.0 },
        ],
        base_notes: [
          { name: "Cèdre", ml: 5.0 },
          { name: "Ambre", ml: 3.0 },
          { name: "Vétiver", ml: 2.0 },
        ],
        boosters: [],
      },
    },
  },
];

// ─── Questions statiques pour le mode dev ──────────────────────────────────

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Quelle ambiance vous attire le plus ?",
    choices: [
      { label: "Forêt", image: "" },
      { label: "Océan", image: "" },
      { label: "Désert", image: "" },
      { label: "Montagne", image: "" },
    ],
  },
  {
    id: 2,
    question: "Quel moment de la journée préférez-vous ?",
    choices: [
      { label: "Matin", image: "" },
      { label: "Après-midi", image: "" },
      { label: "Soirée", image: "" },
      { label: "Nuit", image: "" },
    ],
  },
];
