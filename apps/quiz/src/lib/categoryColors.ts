const categoryColors: Record<string, { bg: string; text: string }> = {
  music: { bg: "bg-fuchsia-500/20", text: "text-fuchsia-400" },
  sport_and_leisure: { bg: "bg-green-500/20", text: "text-green-400" },
  film_and_tv: { bg: "bg-purple-500/20", text: "text-purple-400" },
  arts_and_literature: { bg: "bg-pink-500/20", text: "text-pink-400" },
  history: { bg: "bg-amber-500/20", text: "text-amber-400" },
  society_and_culture: { bg: "bg-rose-500/20", text: "text-rose-400" },
  science: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  geography: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  food_and_drink: { bg: "bg-orange-500/20", text: "text-orange-400" },
  general_knowledge: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

const defaultColor = { bg: "bg-quiz-accent/20", text: "text-quiz-accent" };

export function getCategoryColor(category: string): { bg: string; text: string } {
  return categoryColors[category] || defaultColor;
}
