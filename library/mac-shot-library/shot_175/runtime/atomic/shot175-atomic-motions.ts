export type AtomicMotion = {id:string;label:string;frameRange:[number,number];purpose:string;reusable:boolean;reviewRisk:string};

export const shot175AtomicMotions:AtomicMotion[]=[
  {id:"documentPanelDock",label:"Document Panel Dock",frameRange:[0,38],purpose:"Establish a stable source-to-output workspace.",reusable:true,reviewRisk:"Both panels must remain inside the frame safe area."},
  {id:"termHighlightSweep",label:"Term Highlight Sweep",frameRange:[32,176],purpose:"Bind semantic highlights to source text rows.",reusable:true,reviewRisk:"Highlights must align with meaningful text rather than float freely."},
  {id:"extractedTermTransfer",label:"Extracted Term Transfer",frameRange:[40,190],purpose:"Move each identified term directly into its output row.",reusable:true,reviewRisk:"Moving chips must preserve a clear source and destination."},
  {id:"consistencyListResolve",label:"Consistency List Resolve",frameRange:[54,205],purpose:"Confirm extracted terms as structured results.",reusable:true,reviewRisk:"Rows must resolve without abrupt pop-in or overflow."},
  {id:"consistencyWorkspaceHold",label:"Consistency Workspace Hold",frameRange:[204,240],purpose:"Hold the complete terminology set for review.",reusable:true,reviewRisk:"Residual motion must stay restrained."},
];

export const shot175AtomicMotionIds=shot175AtomicMotions.map((motion)=>motion.id);
export const shot175MotionPackageStatus={shotId:"shot_175",libraryId:"terminology-extraction-workspace",choreographyId:"terminologyExtractionWorkspace",sceneType:"featureHighlight",visualApproved:true,implementationVerified:true,approved:true,allowedInFactory:true} as const;
