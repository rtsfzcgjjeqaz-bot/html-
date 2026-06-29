import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { ArticleSceneComponentProps } from "../../article/types";
import { containsArticlePlaceholder, visibleCopyHasEllipsis } from "../../article/articleVisibleCopyPlan";
import type { ChoreographyAnimationTrack } from "../../motion/choreographyTypes";

type MacSourceScene = {
  id?: number;
  sceneType?: string;
  choreographyId?: string;
  componentProps?: Record<string, unknown>;
  selectedShotId?: string;
};

type MacSourceAdapterProps = {
  scene: MacSourceScene;
  sceneIndex: number;
  animationTracks: ChoreographyAnimationTrack[];
  choreographyId: string;
};

type BoundArticleContent = ArticleSceneComponentProps & {
  selectedEvidence?: Array<{ evidenceId: string; evidenceText: string }>;
};

type TextCapacityContract = {
  headlineMaxLines: number;
  headlineMaxCharactersPerLine: number;
  headlineLineHeight: number;
  supportingTextMaxLines: number;
  supportingTextMaxCharactersPerLine: number;
  cardItemMaxLines: number;
  cardItemMaxCharactersPerLine: number;
  ellipsisForbidden: true;
  overflowPolicy: "fail_validation";
};

export const macShot35TextCapacityContract: TextCapacityContract = {
  headlineMaxLines: 2,
  headlineMaxCharactersPerLine: 18,
  headlineLineHeight: 1.08,
  supportingTextMaxLines: 2,
  supportingTextMaxCharactersPerLine: 24,
  cardItemMaxLines: 2,
  cardItemMaxCharactersPerLine: 18,
  ellipsisForbidden: true,
  overflowPolicy: "fail_validation",
};

export const macShot36TextCapacityContract: TextCapacityContract = {
  headlineMaxLines: 2,
  headlineMaxCharactersPerLine: 16,
  headlineLineHeight: 1.12,
  supportingTextMaxLines: 2,
  supportingTextMaxCharactersPerLine: 22,
  cardItemMaxLines: 2,
  cardItemMaxCharactersPerLine: 20,
  ellipsisForbidden: true,
  overflowPolicy: "fail_validation",
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function boundArticleContent(scene: MacSourceScene): BoundArticleContent | undefined {
  const candidate = scene.componentProps?.articleContent;
  if (!candidate || typeof candidate !== "object") return undefined;
  return candidate as BoundArticleContent;
}

function strictField(scene: MacSourceScene, field: string, value: string | undefined, maxCharacters: number) {
  const sceneLabel = scene.selectedShotId ?? scene.choreographyId ?? "mac_source_scene";
  if (!value?.trim()) {
    throw new Error(`ARTICLE_SCENE_REQUIRED_COPY_MISSING:${sceneLabel}:${field}`);
  }
  if (containsArticlePlaceholder(value)) {
    throw new Error(`ARTICLE_SCENE_PLACEHOLDER_COPY_BLOCKED:${sceneLabel}:${field}`);
  }
  if (visibleCopyHasEllipsis(value)) {
    throw new Error(`ARTICLE_SCENE_ELLIPSIS_BLOCKED:${sceneLabel}:${field}`);
  }
  if (value.length > maxCharacters) {
    throw new Error(`ARTICLE_SCENE_TEXT_CAPACITY_EXCEEDED:${sceneLabel}:${field}`);
  }
  return value;
}

function cardItems(scene: MacSourceScene, contract: TextCapacityContract) {
  const bound = boundArticleContent(scene);
  const raw = bound?.recommendationItems?.length
    ? bound.recommendationItems
    : bound?.stepItems?.length
      ? bound.stepItems
      : bound?.selectedEvidence?.length
        ? bound.selectedEvidence.map((item) => item.evidenceText)
        : [];
  const max = contract.cardItemMaxLines * contract.cardItemMaxCharactersPerLine;
  return raw.slice(0, 3).map((item, index) => strictField(scene, `item[${index}]`, item, max));
}

function evidenceText(scene: MacSourceScene, contract: TextCapacityContract) {
  const bound = boundArticleContent(scene);
  const value = bound?.evidenceText ?? bound?.selectedEvidence?.[0]?.evidenceText ?? bound?.supportingText;
  if (!value) return undefined;
  return strictField(scene, "evidenceText", value, contract.supportingTextMaxLines * contract.supportingTextMaxCharactersPerLine);
}

export const WebsiteHeroAngledProductSurfaceAdapter: React.FC<MacSourceAdapterProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const bound = boundArticleContent(scene);
  const contract = macShot35TextCapacityContract;
  const headline = strictField(scene, "headline", bound?.headline, contract.headlineMaxLines * contract.headlineMaxCharactersPerLine);
  const support = bound?.supportingText
    ? strictField(scene, "supportingText", bound.supportingText, contract.supportingTextMaxLines * contract.supportingTextMaxCharactersPerLine)
    : evidenceText(scene, contract);
  const items = cardItems(scene, contract);
  const surfaceEnter = interpolate(frame, [0, 42], [0, 1], clamp);
  const contentEnter = interpolate(frame, [30, 82], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #fbfdff 0%, #eef5ff 48%, #fff8fc 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        color: "#0f172a",
      }}
    >
      <div style={{ position: "absolute", left: 112, top: 118, width: 650 }}>
        <div style={{ color: "#2563eb", fontSize: 24, lineHeight: 1.2, fontWeight: 950, letterSpacing: 1.2 }}>
          MAC SOURCE / RUNTIME VALIDATED
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 68,
            lineHeight: contract.headlineLineHeight,
            fontWeight: 950,
            letterSpacing: "-0.045em",
            overflowWrap: "break-word",
            transform: `translateY(${interpolate(surfaceEnter, [0, 1], [18, 0])}px)`,
            opacity: surfaceEnter,
          }}
        >
          {headline}
        </div>
        {support ? (
          <div style={{ marginTop: 28, maxWidth: 560, fontSize: 29, lineHeight: 1.25, fontWeight: 780, color: "#475569", overflowWrap: "break-word" }}>
            {support}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          right: 108,
          top: 128,
          width: 820,
          height: 650,
          borderRadius: 42,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(15,23,42,0.10)",
          boxShadow: "0 46px 130px rgba(30,41,59,0.20)",
          transform: `perspective(1300px) rotateY(-7deg) rotateZ(-0.8deg) translateX(${interpolate(surfaceEnter, [0, 1], [90, 0])}px) scale(${interpolate(surfaceEnter, [0, 1], [0.96, 1])})`,
          opacity: surfaceEnter,
          padding: 38,
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 34 }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((color) => <span key={color} style={{ width: 15, height: 15, borderRadius: 99, background: color }} />)}
          <div style={{ marginLeft: 20, width: 270, height: 18, borderRadius: 99, background: "#e2e8f0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.82fr", gap: 26 }}>
          <div style={{ borderRadius: 32, background: "linear-gradient(135deg,#dbeafe,#f8fafc 62%,#fef3c7)", padding: 30, minHeight: 500 }}>
            <div style={{ width: 170, height: 26, borderRadius: 99, background: "#2563eb", marginBottom: 34 }} />
            <div style={{ height: 120, borderRadius: 28, background: "rgba(255,255,255,0.76)", marginBottom: 24, opacity: contentEnter }} />
            {items.map((item) => (
              <div key={item} style={{ marginTop: 18, opacity: contentEnter, transform: `translateY(${interpolate(contentEnter, [0, 1], [18, 0])}px)` }}>
                <div style={{ color: "#0f172a", fontSize: 23, lineHeight: 1.22, fontWeight: 900, overflowWrap: "break-word" }}>{item}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {[0, 1, 2].map((item) => (
              <div key={item} style={{ borderRadius: 24, background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", padding: 22, opacity: contentEnter }}>
                <div style={{ width: 54, height: 54, borderRadius: 18, background: ["#dbeafe", "#dcfce7", "#fef3c7"][item], marginBottom: 18 }} />
                <div style={{ height: 14, borderRadius: 99, background: "#cbd5e1", width: 150 + item * 18 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EmailDraftGenerationDemoAdapter: React.FC<MacSourceAdapterProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const bound = boundArticleContent(scene);
  const contract = macShot36TextCapacityContract;
  const headline = strictField(scene, "headline", bound?.headline, contract.headlineMaxLines * contract.headlineMaxCharactersPerLine);
  const support = bound?.supportingText
    ? strictField(scene, "supportingText", bound.supportingText, contract.supportingTextMaxLines * contract.supportingTextMaxCharactersPerLine)
    : undefined;
  const rows = cardItems(scene, contract);
  const promptEnter = interpolate(frame, [0, 36], [0, 1], clamp);
  const workspaceEnter = interpolate(frame, [34, 76], [0, 1], clamp);
  const rowEnter = interpolate(frame, [58, 112], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #fbfcff 0%, #f5f9ff 42%, #fff8fb 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        color: "#0f172a",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 122,
          width: 700,
          borderRadius: 34,
          padding: "30px 36px",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 34px 100px rgba(30,41,59,0.15)",
          border: "1px solid rgba(15,23,42,0.09)",
          opacity: promptEnter,
          transform: `translateY(${interpolate(promptEnter, [0, 1], [24, 0])}px)`,
        }}
      >
        <div style={{ color: "#6366f1", fontSize: 21, lineHeight: 1.2, fontWeight: 950, letterSpacing: 1 }}>ARTICLE PROMPT</div>
        <div style={{ marginTop: 18, fontSize: 50, lineHeight: contract.headlineLineHeight, fontWeight: 950, letterSpacing: "-0.035em", overflowWrap: "break-word" }}>{headline}</div>
        {support ? <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.25, fontWeight: 760, color: "#475569", overflowWrap: "break-word" }}>{support}</div> : null}
      </div>
      <div
        style={{
          position: "absolute",
          right: 118,
          top: 210,
          width: 820,
          height: 585,
          borderRadius: 42,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 46px 130px rgba(30,41,59,0.18)",
          border: "1px solid rgba(15,23,42,0.10)",
          opacity: workspaceEnter,
          transform: `translateX(${interpolate(workspaceEnter, [0, 1], [120, 0])}px) scale(${interpolate(workspaceEnter, [0, 1], [0.96, 1])})`,
          padding: 34,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid rgba(15,23,42,0.08)" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: 18, lineHeight: 1.2, fontWeight: 900 }}>Validated Workspace</div>
            <div style={{ marginTop: 8, color: "#111827", fontSize: 31, lineHeight: 1.16, fontWeight: 940 }}>Article-derived rows</div>
          </div>
          <div style={{ width: 140, height: 58, borderRadius: 22, background: "linear-gradient(135deg,#e0e7ff,#fce7f3)" }} />
        </div>
        <div style={{ marginTop: 32, display: "grid", gap: 20 }}>
          {rows.map((row, index) => (
            <div key={row} style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 18, alignItems: "center", opacity: rowEnter, transform: `translateY(${interpolate(rowEnter, [0, 1], [20, 0])}px)` }}>
              <div style={{ width: 54, height: 54, borderRadius: 18, background: ["#dbeafe", "#dcfce7", "#fef3c7"][index] }} />
              <div style={{ padding: "18px 22px", borderRadius: 22, background: "#f8fafc", border: "1px solid rgba(15,23,42,0.07)", color: "#0f172a", fontSize: 24, lineHeight: 1.22, fontWeight: 880, overflowWrap: "break-word" }}>{row}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
