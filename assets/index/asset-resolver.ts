import assetsIndex from "./assets.json";
import { getBuiltInMotion, type MotionDefinition } from "./motion-library";
import shotRegistry from "./shot-registry.json";
import shot01 from "../shots/shot_01.json";
import shot03 from "../shots/shot_03.json";
import shot15 from "../shots/shot_15.json";
import shot25 from "../shots/shot_25.json";
import shot26 from "../shots/shot_26.json";
import shot27 from "../shots/shot_27.json";
import shot30 from "../shots/shot_30.json";
import shot37 from "../shots/shot_37.json";
import shot50 from "../shots/shot_50.json";

type AssetKind = "images" | "videos" | "icons" | "audio" | "fonts" | "rules" | "presets";

export type AssetRecord = {
  id: string;
  path: string;
  description?: string;
  tags?: string[];
  width?: number;
  height?: number;
  durationSeconds?: number;
  mimeType?: string;
};

export type ShotAsset = {
  shot_id: string;
  choreography_id?: string;
  source_scene_type?: string;
  scene_type: string;
  action_breakdown?: string;
  atomic_motions: string[];
  choreography?: {
    choreographyId?: string;
    sceneType?: string;
    approved?: boolean;
    allowedInFactory?: boolean;
    durationFrames?: {
      min?: number;
      preferred?: number;
      max?: number;
    };
    animationTracks?: unknown[];
  };
  duration?: number;
  duration_frames?: {
    min?: number;
    preferred?: number;
    max?: number;
  };
  motion_tags: string[];
  remotion?: {
    frame_based?: boolean;
    choreography_id?: string;
    animation_tracks?: unknown[];
  };
  batch?: {
    compatible?: boolean;
    filesystem_dependency?: boolean;
    resolver_key?: string;
  };
  approval?: {
    approved?: boolean;
    allowed_in_factory?: boolean;
  };
};

type AssetIndex = typeof assetsIndex &
  Record<AssetKind, Record<string, AssetRecord>> & {
    motion: Record<string, MotionDefinition>;
    shots: Record<string, string>;
  };

const index = assetsIndex as AssetIndex;
const registry = shotRegistry as Record<string, string>;

const shotModulesByPath: Record<string, ShotAsset> = {
  "assets/shots/shot_01.json": shot01 as ShotAsset,
  "assets/shots/shot_03.json": shot03 as ShotAsset,
  "assets/shots/shot_15.json": shot15 as ShotAsset,
  "assets/shots/shot_25.json": shot25 as ShotAsset,
  "assets/shots/shot_26.json": shot26 as ShotAsset,
  "assets/shots/shot_27.json": shot27 as ShotAsset,
  "assets/shots/shot_30.json": shot30 as ShotAsset,
  "assets/shots/shot_37.json": shot37 as ShotAsset,
  "assets/shots/shot_50.json": shot50 as ShotAsset,
};

function resolveAsset(kind: AssetKind, name: string): AssetRecord {
  const asset = index[kind][name];
  if (!asset) {
    throw new Error(`Asset not registered: ${kind}/${name}. Add it to assets/index/assets.json before use.`);
  }
  return asset;
}

export function getImage(name: string): AssetRecord {
  return resolveAsset("images", name);
}

export function getVideo(name: string): AssetRecord {
  return resolveAsset("videos", name);
}

export function getIcon(name: string): AssetRecord {
  return resolveAsset("icons", name);
}

export function getAudio(name: string): AssetRecord {
  return resolveAsset("audio", name);
}

export function getFont(name: string): AssetRecord {
  return resolveAsset("fonts", name);
}

export function getMotion(name: string): MotionDefinition {
  const motion = index.motion[name] as unknown as MotionDefinition | undefined;
  return motion ?? getBuiltInMotion(name);
}

export function getShotPath(name: string): string {
  const registeredPath = registry[name];
  if (!registeredPath) {
    throw new Error(`Shot not registered: ${name}. Add it to assets/index/shot-registry.json before use.`);
  }
  if (index.shots[name] && index.shots[name] !== registeredPath) {
    throw new Error(`Shot registry mismatch for ${name}: assets.json does not match shot-registry.json.`);
  }
  return registeredPath;
}

export function getShot(name: string): ShotAsset {
  const registeredPath = getShotPath(name);
  const shot = shotModulesByPath[registeredPath];
  if (!shot) {
    throw new Error(`Shot registered but not bundled: ${name} -> ${registeredPath}. Add a static import in asset-resolver.ts.`);
  }
  if (shot.shot_id !== name) {
    throw new Error(`Shot id mismatch: requested ${name}, loaded ${shot.shot_id}.`);
  }
  return shot;
}

export function listRegisteredAssets(kind: AssetKind): string[] {
  return Object.keys(index[kind]);
}

export function listRegisteredShots(): string[] {
  return Object.keys(registry);
}

export function listRegisteredMotions(): string[] {
  return [...new Set([...Object.keys(index.motion), "fade_in", "slide_up", "zoom_in", "shake", "stagger"])];
}
