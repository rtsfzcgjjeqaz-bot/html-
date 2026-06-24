import React from "react";
import { BarChartRace } from "../remotion/components/BarChartRace";
import { AnimatedText } from "../remotion/components/AnimatedText";
import type { TemplateProps } from "./WebsiteHero";

export const ComparisonPanel: React.FC<TemplateProps> = ({ lines, items, accent, variant }) => (
  <>
    <div style={{ position: "absolute", left: 236, top: 176 }}><BarChartRace items={items.length ? items : ["US", "Japan", "Turkey", "India"]} accent={accent} variant={variant} /></div>
    <div style={{ position: "absolute", left: 1100, top: 294 }}><AnimatedText lines={lines} accent={accent} mode="title" /></div>
  </>
);
