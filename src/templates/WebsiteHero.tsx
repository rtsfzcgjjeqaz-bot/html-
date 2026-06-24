import React from "react";
import { WebsiteFrame } from "../remotion/components/WebsiteFrame";
import { AnimatedText } from "../remotion/components/AnimatedText";
import { DataCard } from "../remotion/components/DataCard";

export type TemplateProps = {
  lines: string[];
  items: string[];
  src?: string;
  accent: string;
  variant: number;
};

export const WebsiteHero: React.FC<TemplateProps> = ({ lines, items, src, accent, variant }) => (
  <>
    <div style={{ position: "absolute", left: 820, top: 170 }}><WebsiteFrame src={src} accent={accent} variant={variant} width={820} height={540} /></div>
    <div style={{ position: "absolute", left: 260, top: 220 }}><AnimatedText lines={lines} accent={accent} mode="hero" /></div>
    <div style={{ position: "absolute", left: 240, top: 710, display: "flex", gap: 18 }}>{items.slice(0, 3).map((item, index) => <DataCard key={item} label={item} index={index} accent={accent} />)}</div>
  </>
);
