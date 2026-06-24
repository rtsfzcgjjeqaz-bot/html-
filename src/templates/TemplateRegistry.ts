import { AppGrid } from "./AppGrid";
import { ComparisonPanel } from "./ComparisonPanel";
import { DynamicChart } from "./DynamicChart";
import { RecommendationPanel } from "./RecommendationPanel";
import { SearchFlow } from "./SearchFlow";
import { WebsiteHero } from "./WebsiteHero";

export const templateRegistry = {
  websiteHero: WebsiteHero,
  appGrid: AppGrid,
  searchFlow: SearchFlow,
  comparisonPanel: ComparisonPanel,
  recommendationPanel: RecommendationPanel,
  dynamicChart: DynamicChart,
  iconRail: AppGrid,
  signalBoard: DynamicChart,
} as const;

export type RegisteredTemplateId = keyof typeof templateRegistry;

const tails: RegisteredTemplateId[][] = [
  ["appGrid", "searchFlow", "comparisonPanel", "recommendationPanel", "dynamicChart", "iconRail", "signalBoard"],
  ["searchFlow", "comparisonPanel", "recommendationPanel", "dynamicChart", "iconRail", "signalBoard", "appGrid"],
  ["comparisonPanel", "recommendationPanel", "dynamicChart", "iconRail", "signalBoard", "appGrid", "searchFlow"],
  ["recommendationPanel", "dynamicChart", "iconRail", "signalBoard", "appGrid", "searchFlow", "comparisonPanel"],
  ["dynamicChart", "iconRail", "signalBoard", "appGrid", "searchFlow", "comparisonPanel", "recommendationPanel"],
  ["iconRail", "signalBoard", "appGrid", "comparisonPanel", "dynamicChart", "searchFlow", "recommendationPanel"],
  ["signalBoard", "searchFlow", "recommendationPanel", "iconRail", "appGrid", "dynamicChart", "comparisonPanel"],
  ["comparisonPanel", "iconRail", "appGrid", "recommendationPanel", "signalBoard", "searchFlow", "dynamicChart"],
  ["recommendationPanel", "searchFlow", "signalBoard", "dynamicChart", "comparisonPanel", "iconRail", "appGrid"],
  ["dynamicChart", "recommendationPanel", "comparisonPanel", "signalBoard", "iconRail", "appGrid", "searchFlow"],
];

export const tenVideoTemplateSequences: RegisteredTemplateId[][] = tails.map((tail) => ["websiteHero", ...tail]);
