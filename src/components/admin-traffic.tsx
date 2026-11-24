import { useEffect, useState } from "react";
import { Activity, BarChart3, Cloud, Download, Globe2, Laptop2, MousePointerClick, RefreshCw, Smartphone, TrendingUp } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";

type Daily = { day: string; views: number; whatsapp: number };
type Report = { daily: Daily[]; top_pages: {path: string;views: number}[] };
type Row = {label: string;requests: number};
type Segment = {rows: Row[];error: string|null};
type Cloudflare = {
 totalRequests: number;
 daily: {day:string;requests:number;uniqueVisitors:number}[];
 breakdown?: { countries:Segment;devices:Segment;referrers:Segment;note:string };
};
const number = (n:number) => n.toLocaleString("tr-TR");
const source = (v:string) => {
 const s=v.toLowerCase();
 if(s.includes("google."))return "Google";
 if(s.includes("instagram."))return "Instagram";
 if(s.includes("facebook."))return "Facebook";
 if(s.includes("tiktok."))return "TikTok";
 if(s.includes("bing."))return "Bing";
 if(!s || s==="unknown" || s==="bilinmiyor" || s==="(none)")return "Bilinmiyor";
 if(s.includes("nilmobilyatasarim.com"))return "Site içi";
 return v;
};
const country=(s:string)=>({TR:"Türkiye",US:"ABD",DE:"Almanya",GB:"Birleşik Krallık",FR:"Fransa",NL:"Hollanda"} as Record<string,string>)[s]||s;
const device=(s:string)=>({desktop:"Masaüstü",mobile:"Mobil",tablet:"Tablet",unknown:"Bilinmiyor"} as Record<string,string>)[s.toLowerCase()]||s;

function MiniBreakdown({name,icon:Icon,segment,display}:{name:string;icon:typeof Globe2;segment?:Segment;display:(s:string)=>string}){
 const entries=new Map<string,number>();
 for(const r of segment?.rows??[]){const key=display(r.label);entries.set(key,(entries.get(key)||0)+r.requests);}
 const rows=[...entries].sort((a,b)=>b[1]-a[1]).slice(0,5);
 const max=Math.max(1,...rows.map(r=>r[1]));
 return <section className="nil-one-card nil-one-breakdown">
   <header className="nil-one-card-title"><Icon size={17}/><h3>{name}</h3></header>
   {segment?.error?<p className="nil-one-muted">{segment.error}</p>:rows.length?<div className="nil-one-bar-list">
     {rows.map(([label,value])=><div className="nil-one-bar-item" key={label}>
       <div><span title={label}>{label}</span><strong>{number(value)}</strong></div>
       <div className="nil-one-track"><span style={{width:(value/max*100)+"%"}}/></div>
     </div>)}
   </div>:<p className="nil-one-muted">{segment?"Henüz ayrıntı bulunamadı.":"Cloudflare dağılımı bekleniyor."}</p>}
   <small>Son 24 saatin HTTP istekleri · ziyaretçi sayısı değil</small>
 </section>;
}

export function AdminTraffic(){
 const [days,setDays]=useState<7|14|30>(7);
 const [report,setReport]=useState<Report|null>(null);
 const [cloud,setCloud]=useState<Cloudflare|null>(null);
 const [supError,setSupError]=useState("");
 const [cfError,setCfError]=useState("");
 const [busy,setBusy]=useState(true);
 const [revision,setRevision]=useState(0);
 const [view,setView]=useState<"cloudflare"|"consent">("cloudflare");
 useEffect(()=>{
   let alive=true;
   setBusy(true);setSupError("");setCfError("");
   const run=async()=>{
    const db=getSupabaseClient();
    if(!db){if(alive){setSupError("Supabase bağlantısı bulunamadı.");setBusy(false);}return;}
    const [session,events]=await Promise.all([
      db.auth.getSession(),
      db.rpc("admin_site_analytics",{p_days:days})
    ]);
    if(!alive)return;
    if(events.error){setSupError("İzinli analitik okunamadı: "+events.error.message);setReport(null);}
    else setReport(events.data as Report);
    if(session.error||!session.data.session?.access_token){setCfError("Yönetici oturumu doğrulanamadı.");setCloud(null);setBusy(false);return;}
    try{
      const response=await fetch("/api/cloudflare-analytics?days="+days,{
        headers:{Authorization:"Bearer "+session.data.session.access_token},cache:"no-store"
      });
      const data=await response.json() as Cloudflare & {error?:string};
      if(!response.ok)throw new Error(data.error||"Cloudflare verisi alınamadı.");
      if(alive)setCloud(data);
    }catch(e){if(alive){setCloud(null);setCfError(e instanceof Error?e.message:"Cloudflare bağlantısı başarısız.");}}
    if(alive)setBusy(false);
   };
   void run();
   return()=>{alive=false};
 },[days,revision]);

 const views=report?.daily.reduce((n,d)=>n+d.views,0)??null;
 const clicks=report?.daily.reduce((n,d)=>n+d.whatsapp,0)??null;
 const last=cloud?.daily[cloud.daily.length-1];
 const graph=view==="cloudflare"?(cloud?.daily.map(d=>({day:d.day,a:d.requests,b:0}))??[]):(report?.daily.map(d=>({day:d.day,a:d.views,b:d.whatsapp}))??[]);
 const ceiling=Math.max(1,...graph.map(d=>Math.max(d.a,d.b)));
 const downloadCSV=()=>{
   const rows=[["Tarih","Sayfa görüntüleme","WhatsApp tıklaması"],...(report?.daily??[]).map(d=>[d.day,d.views,d.whatsapp])];
   const csv="\uFEFF"+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n");
   const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
   const a=document.createElement("a");a.href=url;a.download="nil-mobilya-analitik.csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <div className="nil-one-screen">
   <header className="nil-one-header">
     <div><p>PERFORMANS / CANLI VERİLER</p><h1>Site Analitiği</h1></div>
     <div className="nil-one-actions">
       <select aria-label="Tarih aralığı" value={days} onChange={e=>setDays(Number(e.target.value) as 7|14|30)}><option value={7}>7 gün</option><option value={14}>14 gün</option><option value={30}>30 gün</option></select>
       <button type="button" onClick={()=>setRevision(v=>v+1)} disabled={busy} title="Yenile" aria-label="Verileri yenile"><RefreshCw size={17}/></button>
       <button type="button" onClick={downloadCSV} disabled={!report} title="Supabase CSV indir"><Download size={17}/><span>CSV</span></button>
     </div>
   </header>
   <div className="nil-one-grid">
     {[
       {label:"HTTP istekleri",value:cloud?number(cloud.totalRequests):"—",caption:"Cloudflare · "+days+" gün",icon:Cloud},
       {label:"Günlük tekil IP",value:last?number(last.uniqueVisitors):"—",caption:last?.day??"Cloudflare",icon:Globe2},
       {label:"Sayfa görüntüleme",value:views===null?"—":number(views),caption:"Supabase · izinli",icon:BarChart3},
       {label:"WhatsApp tıklaması",value:clicks===null?"—":number(clicks),caption:"Supabase · izinli",icon:MousePointerClick}
     ].map(stat=><section key={stat.label} className="nil-one-card nil-one-stat"><div className="nil-one-stat-top"><span>{stat.label}</span><stat.icon size={20}/></div><strong>{stat.value}</strong><small>{stat.caption}</small></section>)}
     <section className="nil-one-card nil-one-chart">
       <header className="nil-one-card-title"><TrendingUp size={18}/><h3>Günlük Trafik</h3>
         <div className="nil-one-switch" role="group" aria-label="Grafik kaynağı">
           <button type="button" aria-pressed={view==="cloudflare"} onClick={()=>setView("cloudflare")}>Cloudflare</button>
           <button type="button" aria-pressed={view==="consent"} onClick={()=>setView("consent")}>İzinli</button>
         </div>
       </header>
       <div className="nil-one-chart-body">
         {graph.length ? graph.map((d,i)=><div key={d.day} className="nil-one-chart-col" title={d.day+": "+d.a+" / "+d.b}>
           <div className="nil-one-chart-pair"><div className="nil-one-chart-bar" style={{height:Math.max(2,d.a/ceiling*100)+"%"}}/><div className="nil-one-chart-bar nil-one-chart-alt" style={{height:Math.max(0,d.b/ceiling*100)+"%"}}/></div>
           <small>{i%Math.max(1,Math.ceil(graph.length/7))===0||i===graph.length-1?d.day.slice(5):""}</small>
         </div>):<p className="nil-one-muted">{busy?"Veriler yükleniyor…":view==="cloudflare"?cfError||"Cloudflare verisi yok.":supError||"İzinli veri yok."}</p>}
       </div>
       <footer>Cloudflare: HTTP istekleri · İzinli: sayfa ve WhatsApp olayları</footer>
     </section>
     <MiniBreakdown name="Trafik Kaynakları" icon={Globe2} segment={cloud?.breakdown?.referrers} display={source}/>
     <MiniBreakdown name="Ülkeler" icon={Globe2} segment={cloud?.breakdown?.countries} display={country}/>
     <MiniBreakdown name="Cihaz Türleri" icon={Laptop2} segment={cloud?.breakdown?.devices} display={device}/>
     <section className="nil-one-card nil-one-summary">
       <header className="nil-one-card-title"><Activity size={17}/><h3>Özet / En Çok Bakılanlar</h3></header>
       <div className="nil-one-summary-list">
         {(report?.top_pages??[]).slice(0,4).map(p=><div key={p.path}><span title={p.path}>{p.path}</span><strong>{number(p.views)}</strong></div>)}
         {!report?.top_pages?.length&&<p className="nil-one-muted">{supError||"Henüz kayıt bulunamadı."}</p>}
       </div>
       <small>En çok görüntülenen sayfalar · izinli ölçüm</small>
     </section>
   </div>
   {cfError && <p role="alert" className="nil-one-alert">{cfError}</p>}
   <p className="nil-one-footer">Cloudflare kaynak, ülke ve cihaz verileri istek temellidir; tekil müşteri sayısı değildir. Kendi ziyaretlerin de Cloudflare sayımlarına dahildir.</p>
 </div>;
}
