import React from "react";
import {AbsoluteFill,Easing,interpolate,spring,useCurrentFrame,useVideoConfig} from "remotion";

export const SHOT_172_DURATION_FRAMES=210;
const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const ease=(frame:number,start:number,end:number)=>interpolate(frame,[start,end],[0,1],{...clamp,easing:Easing.bezier(0.16,1,0.3,1)});

const genres=[
  {name:"Movie",color:"#d6ad5c",surface:"linear-gradient(135deg,#282115,#0c1018)",label:"CINEMATIC"},
  {name:"TV Drama",color:"#7b65ee",surface:"linear-gradient(135deg,#332078,#9d4fe0)",label:"EPISODIC"},
  {name:"Animation",color:"#e76ca6",surface:"linear-gradient(135deg,#f1a6c8,#7467dc)",label:"ANIMATED"},
  {name:"Documentary",color:"#42bc91",surface:"linear-gradient(135deg,#14392f,#15785e)",label:"DOCUMENTARY"},
  {name:"Gaming",color:"#d456dc",surface:"linear-gradient(135deg,#32134d,#7c1fc2)",label:"INTERACTIVE"},
];

export const Shot172GenreWorkspaceCarouselChoreography:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const frameIn=ease(frame,0,34);
  const timeline=interpolate(frame,[28,176],[0,genres.length-1],clamp);
  const activeIndex=Math.min(genres.length-1,Math.max(0,Math.round(timeline)));
  const active=genres[activeIndex];
  const shellSpring=spring({frame,fps,config:{damping:180,stiffness:115,mass:0.9}});
  const hold=ease(frame,176,SHOT_172_DURATION_FRAMES);

  return <AbsoluteFill style={{background:"#070a16",overflow:"hidden",fontFamily:"Inter, Avenir Next, SF Pro Display, Arial, sans-serif"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 18% 72%,rgba(33,177,174,0.13),transparent 30%),radial-gradient(circle at 82% 24%,rgba(116,68,210,0.16),transparent 34%),linear-gradient(135deg,#080b19,#10142a 58%,#080a15)"}}/>
    <div style={{position:"absolute",inset:"56px 74px",display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
      <div style={{fontSize:54,fontWeight:840,lineHeight:1.08,color:"#f7f9ff",opacity:0.24+frameIn*0.76}}>Built for Every Genre</div>
      <div style={{position:"relative",width:1100,height:520,borderRadius:26,overflow:"hidden",background:"rgba(8,12,25,0.94)",border:"1px solid rgba(132,151,190,0.19)",boxShadow:"0 34px 100px rgba(0,0,0,0.40)",opacity:0.2+frameIn*0.8,transform:`translateY(${interpolate(frameIn,[0,1],[32,0],clamp)}px) scale(${interpolate(shellSpring,[0,1],[0.975,1],clamp)})`}}>
        <div style={{height:54,display:"flex",alignItems:"center",padding:"0 20px",borderBottom:"1px solid rgba(132,151,190,0.13)",background:"rgba(12,17,33,0.95)"}}>
          <div style={{display:"flex",gap:7}}>{["#31d1bc","#6579ec","#ac69e6"].map(color=><div key={color} style={{width:9,height:9,borderRadius:5,background:color}}/>)}</div>
          <div style={{marginLeft:16,fontSize:12,fontWeight:760,color:"#7f8ba0"}}>CONTENT WORKSPACE</div>
          <div style={{marginLeft:"auto",fontSize:12,fontWeight:720,color:active.color}}>Live preview</div>
        </div>
        <div style={{position:"absolute",left:0,top:54,bottom:0,width:232,padding:"26px 18px",borderRight:"1px solid rgba(132,151,190,0.13)",background:"rgba(8,13,27,0.78)"}}>
          <div style={{fontSize:12,fontWeight:780,color:"#657087",margin:"0 12px 16px"}}>GENRES</div>
          <div style={{position:"relative",display:"flex",flexDirection:"column",gap:8}}>
            <div style={{position:"absolute",left:0,top:timeline*60,width:196,height:52,borderRadius:14,background:`${active.color}22`,border:`1px solid ${active.color}66`,boxShadow:`0 10px 24px ${active.color}12`}}/>
            {genres.map((genre,index)=><div key={genre.name} style={{position:"relative",zIndex:1,height:52,padding:"0 15px",display:"flex",alignItems:"center",gap:12,color:Math.abs(timeline-index)<0.55?"#f5f7ff":"#7f899c",fontSize:15,fontWeight:720}}><div style={{width:8,height:8,borderRadius:4,background:genre.color,opacity:Math.abs(timeline-index)<0.55?1:0.42}}/>{genre.name}</div>)}
          </div>
        </div>
        <div style={{position:"absolute",left:232,right:0,top:54,bottom:0,padding:24}}>
          <div style={{position:"relative",width:"100%",height:330,borderRadius:20,overflow:"hidden",background:"#11172a",border:"1px solid rgba(255,255,255,0.08)"}}>
            {genres.map((genre,index)=>{
              const center=28+index*37;
              const opacity=index===genres.length-1?ease(frame,center-13,center+8):interpolate(frame,[center-13,center+8,center+32],[0,1,0],clamp);
              return <div key={genre.name} style={{position:"absolute",inset:0,background:genre.surface,opacity,transform:`translateX(${interpolate(opacity,[0,1],[24,0],clamp)}px) scale(${interpolate(opacity,[0,1],[1.025,1],clamp)})`}}>
                <div style={{position:"absolute",left:42,top:36,height:30,padding:"0 14px",borderRadius:15,display:"flex",alignItems:"center",background:`${genre.color}2e`,border:`1px solid ${genre.color}78`,color:"#f8f9ff",fontSize:13,fontWeight:780}}>{genre.name}</div>
                <div style={{position:"absolute",inset:"82px 76px 52px",borderRadius:16,border:"1px solid rgba(255,255,255,0.16)",background:"rgba(5,8,16,0.26)",display:"grid",placeItems:"center"}}><div style={{fontSize:38,fontWeight:850,letterSpacing:0,color:"rgba(255,255,255,0.90)"}}>{genre.label}</div></div>
              </div>;
            })}
          </div>
          <div style={{marginTop:18,height:82,borderRadius:18,padding:"0 22px",display:"flex",alignItems:"center",background:"rgba(17,23,42,0.86)",border:"1px solid rgba(132,151,190,0.13)"}}>
            <div><div style={{fontSize:12,fontWeight:760,color:active.color}}>ACTIVE MODE</div><div style={{fontSize:20,fontWeight:800,color:"#f1f4fb",marginTop:5}}>{active.name} workspace</div></div>
            <div style={{marginLeft:"auto",height:38,padding:"0 16px",borderRadius:12,display:"flex",alignItems:"center",background:`${active.color}20`,color:active.color,fontSize:13,fontWeight:760,opacity:0.8+hold*0.2}}>Ready to create</div>
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};
