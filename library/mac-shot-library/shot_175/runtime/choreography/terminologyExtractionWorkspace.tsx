import React from "react";
import {AbsoluteFill,Easing,interpolate,spring,useCurrentFrame,useVideoConfig} from "remotion";

export const SHOT_175_DURATION_FRAMES=240;
const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const ease=(frame:number,start:number,end:number)=>interpolate(frame,[start,end],[0,1],{...clamp,easing:Easing.bezier(0.16,1,0.3,1)});

export type TerminologyExtractionWorkspaceProps={
  headline?:string;
  sourceLabel?:string;
  resultLabel?:string;
  terms?:string[];
};

const defaultTerms=["Cybertruck","Sonya Nadella","Copilot","YouTube","Surface Pro"];
const lineWidths=[86,72,91,64,80,69,88,75,58];

export const Shot175TerminologyExtractionWorkspaceChoreography:React.FC<TerminologyExtractionWorkspaceProps>=({
  headline="Terms Stay Consistent",
  sourceLabel="SOURCE DOCUMENT",
  resultLabel="EXTRACTED",
  terms=defaultTerms,
})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const items=terms.slice(0,5);
  const shell=ease(frame,0,34);
  const shellSpring=spring({frame,fps,config:{damping:180,stiffness:115,mass:0.9}});
  const hold=ease(frame,204,236);

  return <AbsoluteFill style={{background:"#080a17",overflow:"hidden",fontFamily:"Inter, Avenir Next, SF Pro Display, Arial, sans-serif"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 18% 72%,rgba(28,190,167,0.13),transparent 30%),radial-gradient(circle at 86% 28%,rgba(136,70,225,0.18),transparent 34%),linear-gradient(135deg,#080b18,#11132a 58%,#090a18)"}}/>
    <div style={{position:"absolute",left:80,right:80,top:48,textAlign:"center",fontSize:52,fontWeight:840,lineHeight:1.1,color:"#f7f8ff",opacity:0.42+shell*0.58}}>{headline}</div>

    <div style={{position:"absolute",left:72,top:140,width:1136,height:500,opacity:0.2+shell*0.8,transform:`translateY(${interpolate(shell,[0,1],[28,0],clamp)}px) scale(${interpolate(shellSpring,[0,1],[0.98,1],clamp)})`}}>
      <div style={{position:"absolute",left:0,top:0,width:674,height:500,borderRadius:24,overflow:"hidden",background:"rgba(9,14,27,0.95)",border:"1px solid rgba(115,145,174,0.20)",boxShadow:"0 30px 80px rgba(0,0,0,0.34)"}}>
        <div style={{height:54,display:"flex",alignItems:"center",padding:"0 20px",borderBottom:"1px solid rgba(115,145,174,0.15)",background:"rgba(13,20,35,0.94)"}}>
          <div style={{display:"flex",gap:7}}>{["#32cdb4","#6577df","#9d63dc"].map((color)=><div key={color} style={{width:9,height:9,borderRadius:5,background:color}}/>)}</div>
          <div style={{marginLeft:16,fontSize:12,fontWeight:760,color:"#718097"}}>{sourceLabel}</div>
          <div style={{marginLeft:"auto",fontSize:11,fontWeight:730,color:"#42cdb2"}}>Scanning terms</div>
        </div>
        <div style={{position:"absolute",left:42,right:42,top:92,bottom:34}}>
          {lineWidths.map((width,index)=>{
            const termIndex=index%2===1?Math.floor(index/2):-1;
            const active=termIndex>=0&&termIndex<items.length;
            const start=32+termIndex*32;
            const highlight=active?ease(frame,start,start+14):0;
            return <div key={index} style={{position:"relative",height:39,display:"flex",alignItems:"center"}}>
              {active&&<div style={{position:"absolute",left:0,width:`${Math.min(width,72)}%`,height:25,borderRadius:8,background:"linear-gradient(90deg,rgba(45,205,175,0.08),rgba(45,205,175,0.38),rgba(122,92,218,0.18))",transformOrigin:"left center",transform:`scaleX(${highlight})`,boxShadow:highlight>0.8?"0 0 22px rgba(45,205,175,0.14)":"none"}}/>}
              <div style={{position:"relative",height:7,width:`${width}%`,borderRadius:4,background:active?"rgba(174,220,214,0.38)":"rgba(112,130,151,0.24)"}}/>
              {active&&<div style={{position:"absolute",left:18,top:9,maxWidth:260,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:13,fontWeight:760,color:"#d9fffa",opacity:highlight}}>{items[termIndex]}</div>}
            </div>;
          })}
        </div>
      </div>

      <div style={{position:"absolute",right:0,top:0,width:412,height:500,borderRadius:24,overflow:"hidden",background:"rgba(12,14,31,0.96)",border:"1px solid rgba(132,101,207,0.26)",boxShadow:"0 30px 80px rgba(0,0,0,0.34)"}}>
        <div style={{height:54,display:"flex",alignItems:"center",padding:"0 22px",borderBottom:"1px solid rgba(132,101,207,0.17)"}}>
          <div style={{width:8,height:8,borderRadius:4,background:"#a46ee8",boxShadow:"0 0 18px rgba(164,110,232,0.6)"}}/>
          <div style={{marginLeft:10,fontSize:13,fontWeight:790,color:"#f1ecff"}}>{resultLabel}</div>
          <div style={{marginLeft:"auto",fontSize:12,fontWeight:740,color:"#8b97aa"}}>{items.length} terms</div>
        </div>
        <div style={{padding:"24px 20px",display:"flex",flexDirection:"column",gap:12}}>
          {items.map((term,index)=>{
            const start=32+index*32;
            const settled=ease(frame,start+20,start+35);
            return <div key={term} style={{height:66,borderRadius:14,padding:"0 16px",display:"flex",alignItems:"center",background:`rgba(82,64,128,${0.12+settled*0.17})`,border:`1px solid rgba(165,115,232,${0.12+settled*0.34})`,opacity:0.15+settled*0.85,transform:`translateX(${interpolate(settled,[0,1],[18,0],clamp)}px)`}}>
              <div style={{minWidth:0,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:16,fontWeight:760,color:"#f3f0fa"}}>{term}</div>
              <div style={{width:24,height:24,borderRadius:12,display:"grid",placeItems:"center",background:"rgba(49,202,167,0.16)",color:"#4ad9b8",fontSize:10,fontWeight:900,opacity:settled}}>OK</div>
            </div>;
          })}
        </div>
      </div>

      {items.map((term,index)=>{
        const start=32+index*32;
        const travel=ease(frame,start+8,start+28);
        const visible=interpolate(travel,[0,0.08,0.82,1],[0,1,1,0],clamp);
        const sourceY=106+index*78;
        const targetY=83+index*78;
        return <div key={`transfer-${term}`} style={{position:"absolute",left:interpolate(travel,[0,1],[92,760],clamp),top:interpolate(travel,[0,1],[sourceY,targetY],clamp),width:170,height:38,borderRadius:12,padding:"0 13px",display:"flex",alignItems:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",background:"linear-gradient(90deg,#2dc6aa,#865ed8)",boxShadow:"0 12px 28px rgba(42,179,161,0.26)",color:"#ffffff",fontSize:13,fontWeight:790,opacity:visible,transform:`scale(${interpolate(travel,[0,0.5,1],[0.94,1.03,0.96],clamp)})`,zIndex:5}}>{term}</div>;
      })}
    </div>

    <div style={{position:"absolute",left:0,right:0,bottom:24,textAlign:"center",fontSize:12,fontWeight:740,color:"rgba(151,166,187,0.65)",opacity:0.35+hold*0.65}}>Terminology set synchronized</div>
  </AbsoluteFill>;
};
