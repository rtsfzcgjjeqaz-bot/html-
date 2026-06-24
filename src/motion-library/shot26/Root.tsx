import React from "react";
import { Composition } from "remotion";
import { Shot26WebsiteHeroPreview } from "./Shot26WebsiteHeroPreview";

export const Shot26Root: React.FC = () => {
  return (
    <Composition
      id="Shot26WebsiteHeroPreview"
      component={Shot26WebsiteHeroPreview}
      durationInFrames={135}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
