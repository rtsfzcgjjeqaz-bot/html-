import { coverHookImpactAtomicMotions } from "../../atomic/coverHookImpact";
export type CoverHookImpactTrack={trackId:string;motionId:(typeof coverHookImpactAtomicMotions)[number];target:string;layer:"background"|"title"|"semantic"|"website"|"camera";startPercent:number;endPercent:number;role:string;purpose:string;semanticTarget?:string};
export const coverHookImpactTracks:CoverHookImpactTrack[]=[
{trackId:"track-hookBackdropSurge",motionId:"hookBackdropSurge",target:"hookBackdrop",layer:"background",startPercent:0,endPercent:100,role:"depth-establish",purpose:"Create energetic opener depth."},
{trackId:"track-hookTitleSmashIn",motionId:"hookTitleSmashIn",target:"hookTitle",layer:"title",startPercent:4,endPercent:28,role:"hook-message-entry",purpose:"Reveal the hook title with controlled impact.",semanticTarget:"coverHook.title"},
{trackId:"track-productSlabRise",motionId:"productSlabRise",target:"productSlab",layer:"website",startPercent:18,endPercent:44,role:"supporting-product-entry",purpose:"Lift a generic product slab into support position.",semanticTarget:"coverHook.productSlab"},
{trackId:"track-accentChipsSnap",motionId:"accentChipsSnap",target:"accentChips",layer:"semantic",startPercent:36,endPercent:62,role:"semantic-accents",purpose:"Snap meaningful chips around the hook.",semanticTarget:"coverHook.chips"},
{trackId:"track-hookUnderlineSweep",motionId:"hookUnderlineSweep",target:"hookUnderline",layer:"semantic",startPercent:58,endPercent:82,role:"semantic-emphasis",purpose:"Sweep an underline through the key phrase.",semanticTarget:"coverHook.underline"},
{trackId:"track-coverHookSettle",motionId:"coverHookSettle",target:"fullComposition",layer:"camera",startPercent:82,endPercent:100,role:"readability-hold",purpose:"Settle the opener for readability."}
];
