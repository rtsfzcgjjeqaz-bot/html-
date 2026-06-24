import "./index.css";
import { Composition } from "remotion";
import { AppCardPricePromo } from "./AppCardPricePromo";
import { EngineVideo } from "./EngineVideo";
import { engineList } from "./EngineSelector";
import { engineModes } from "./engines";
import { MainVideo } from "./MainVideo";
import { WebsiteAdRoot } from "./remotion/Root";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppCardPricePromo"
        component={AppCardPricePromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AppCardPricePromoPreview"
        component={AppCardPricePromo}
        defaultProps={{ showFrameCounter: true }}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      {engineModes.map((engineMode) => (
        <Composition
          key={engineMode}
          id={`AppCardPriceEngine-${engineMode}`}
          component={EngineVideo}
          defaultProps={{ engineMode }}
          durationInFrames={900}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
      {engineList.map(({ mode }) => (
        <Composition
          key={`factory-${mode}`}
          id={`AppCardPriceFactory-${mode}`}
          component={MainVideo}
          defaultProps={{ engineType: mode }}
          durationInFrames={600}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
      <WebsiteAdRoot />
    </>
  );
};
