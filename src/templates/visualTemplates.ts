export type VisualTemplate = "websiteHero" | "appGrid" | "searchFlow" | "comparisonPanel" | "recommendationPanel" | "dynamicChart" | "iconRail" | "signalBoard";

export const visualTemplates: Record<VisualTemplate, { description: string; primaryRole: string }> = {
  websiteHero: { description: "Single website screenshot as the main evidence frame", primaryRole: "website" },
  appGrid: { description: "Subscription services represented as app tiles", primaryRole: "catalog" },
  searchFlow: { description: "Three-step search to compare to decision flow", primaryRole: "process" },
  comparisonPanel: { description: "Country and service comparison panel", primaryRole: "comparison" },
  recommendationPanel: { description: "AI recommendation output with confidence blocks", primaryRole: "decision" },
  dynamicChart: { description: "Final system view with structured data bars", primaryRole: "summary" },
  iconRail: { description: "Real app icons arranged as a subscription rail", primaryRole: "icon-evidence" },
  signalBoard: { description: "Price, country, and AI logic signals composed as a balanced board", primaryRole: "signals" },
};
