export type AtomicMotion = {id:string;label:string;frameRange:[number,number];purpose:string;reusable:boolean;reviewRisk:string};
export const shot172AtomicMotions: AtomicMotion[] = [
  {id:"workspaceFrameLift",label:"Workspace Frame Lift",frameRange:[0,34],purpose:"Establish a stable multi-mode product shell.",reusable:true,reviewRisk:"Workspace must remain inside the frame safe area."},
  {id:"genreTabTraverse",label:"Genre Tab Traverse",frameRange:[24,164],purpose:"Move the active category indicator through meaningful options.",reusable:true,reviewRisk:"Indicator motion cannot detach from category rows."},
  {id:"previewCanvasSwap",label:"Preview Canvas Swap",frameRange:[32,174],purpose:"Crossfade preview states inside one persistent canvas.",reusable:true,reviewRisk:"Preview changes must not feel like slide cuts."},
  {id:"detailCardResolve",label:"Detail Card Resolve",frameRange:[44,184],purpose:"Update supporting context for the active mode.",reusable:true,reviewRisk:"Detail text must stay subordinate to the preview."},
  {id:"workspaceHold",label:"Workspace Hold",frameRange:[176,210],purpose:"Hold the final selected workspace state.",reusable:true,reviewRisk:"Residual motion must remain restrained."},
];
export const shot172AtomicMotionIds=shot172AtomicMotions.map(motion=>motion.id);
export const shot172MotionPackageStatus={shotId:"shot_172",libraryId:"genre-workspace-carousel",choreographyId:"genreWorkspaceCarousel",sceneType:"appGrid",visualApproved:true,implementationVerified:true,approved:true,allowedInFactory:true} as const;
