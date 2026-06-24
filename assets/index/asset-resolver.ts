import assetsIndex from "./assets.json";
import { getBuiltInMotion, type MotionDefinition } from "./motion-library";

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

type AssetIndex = typeof assetsIndex &
  Record<AssetKind, Record<string, AssetRecord>> & {
    motion: Record<string, MotionDefinition>;
    shots: Record<string, string>;
  };

const index = assetsIndex as AssetIndex;

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

export function getShot(name: string): string {
  const shot = index.shots[name];
  if (!shot) {
    throw new Error(`Shot not registered: ${name}. Add it to assets/index/shot-registry.json and assets/index/assets.json.`);
  }
  return String(shot);
}

export function listRegisteredAssets(kind: AssetKind): string[] {
  return Object.keys(index[kind]);
}

export function listRegisteredShots(): string[] {
  return Object.keys(index.shots);
}

export function listRegisteredMotions(): string[] {
  return [...new Set([...Object.keys(index.motion), "fade_in", "slide_up", "zoom_in", "shake", "stagger"])] ;
}
