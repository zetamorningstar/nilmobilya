import { useEffect,useState } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { BarChart3,RefreshCw,ExternalLink } from "lucide-react";
type Daily={day:string;views:number;whatsapp:number};
type Report={daily:Daily[];top_pages:{path:string;views:number}[]};
export function AdminTraffic(){
 const [days,setDays]=useState(14);
 const [report,setReport]=useState<Report|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 const [refresh,setRefresh]=useState(0);
 useEffect(()=>{let alive=true;(async()=>{setLoading(true);setError("");const db=getSupabaseClient();if(!db)return;const {data,error:e}=await db.rpc("admin_site_analytics",{p_days:days});if(!alive)return;if(e)setError("Analitik SQL kurulumu veya yönetici yetkisi kontrol edilmeli: "+e.message);else setReport(data as Report);setLoading(false)})();return()=>{alive=false}},[days,refresh]);
 const total=report?.daily.reduce((n,d)=>n+d.views,0)??0;
 const clicks=report?.daily.reduce((n,d)=>n+d.whatsapp,0)??0;
 const max=Math.max(1,...(report?.daily.flatMap(d=>[d.views,d.whatsapp])??[]));
 const rate=total>0?(clicks/total*100).toFixed(1):"0.0";
 return <section className="admin-panel mb-6 rounded-xl border border-[#292b32] bg-[#15161b] p-6">
  <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-[#c9a46c]">Nil Mobilya · Gerçek olay verileri</p><h2 className="mt-2 text-xl font-bold">Ziyaretçi Analitiği</h2><p className="mt-2 text-xs text-[#9395a0]">Benzersiz kişi değil, izin verilmiş sayfa görüntüleme ve WhatsApp tıklama sayıları</p></div><div className="flex gap-2"><select aria-label="Tarih aralığı" value={days} onChange={e=>setDays(Number(e.target.value))} className="rounded-lg border border-[#393a42] bg-[#202127] px-3 py-2 text-sm"><option value={7}>7 gün</option><option value={14}>14 gün</option><option value={30}>30 gün</option></select><button onClick={()=>setRefresh(x=>x+1)} aria-label="Yenile" className="rounded-lg border border-[#393a42] p-2"><RefreshCw size={18}/></button></div></div>
  {loading?<p className="py-16 text-center text-sm text-[#9b9da7]">Gerçek veriler yükleniyor…</p>:error?<p role="alert" className="rounded-lg border border-amber-600/40 p-5 text-sm text-amber-200">{error}</p>:<>
   <div className="mb-6 grid grid-cols-2 gap-3"><div className="rounded-lg border border-[#33343c] bg-[#1d1e24] p-5"><p className="text-xs text-[#a2a3ad]">Sayfa görüntüleme</p><p className="mt-3 text-3xl font-bold">{total}</p></div><div className="rounded-lg border border-[#33343c] bg-[#1d1e24] p-5"><p className="text-xs text-[#a2a3ad]">WhatsApp tıklaması</p><p className="mt-3 text-3xl font-bold">{clicks}</p></div></div>
   <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#bfc0c8]">Günlük etkileşim grafiği</p><div className="flex items-center gap-4 text-xs text-[#aaa]"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#c9a46c]"/> Sayfa</span><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#7194b6]"/> WhatsApp</span></div></div>
   <div className="admin-chart relative flex h-[260px] items-end justify-between gap-1 overflow-hidden rounded-xl border border-[#292b32] bg-[#0f1014] px-3 pb-9 pt-8 sm:gap-2" role="img" aria-label={`Son ${days} gün toplam ${total} sayfa görüntüleme`}>
    <div className="admin-chart-grid absolute inset-0" aria-hidden="true"/>
    {report?.daily.map((d,i)=><div key={d.day} className="relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${d.day}: ${d.views} görüntüleme, ${d.whatsapp} WhatsApp tıklaması`}><span className="text-[10px] tabular-nums text-[#d7bb90]">{d.views}</span><div className="flex h-[150px] w-full items-end justify-center gap-1"><div className="admin-3d-bar admin-3d-bar--gold !w-[min(18px,37%)]" style={{height:`${Math.max(3,d.views/max*145)}px`}}/><div className="admin-3d-bar admin-3d-bar--blue !w-[min(18px,37%)]" style={{height:`${Math.max(3,d.whatsapp/max*145)}px`}}/></div><span className="text-[9px] text-[#858793]">{days===30?(i%5===0?d.day.slice(5):""):d.day.slice(5)}</span></div>)}
   </div>
   <div className="mt-4 rounded-lg border border-[#33343c] bg-[#1d1e24] px-4 py-3"><span className="text-xs text-[#a2a3ad]">WhatsApp tıklaması / sayfa görüntüleme oranı</span><strong className="ml-3 text-lg text-[#e4bf87]">{rate}%</strong><p className="mt-1 text-[11px] text-[#8e909a]">Bu oran satış dönüşümü veya benzersiz kullanıcı dönüşümü değildir.</p></div>
   <p className="mt-3 text-xs text-[#888a96]">{total===0?"Henüz ölçülmüş ziyaret yok. Site açılıp analitik izni verildiğinde veriler burada görünür.":"Grafikteki sayılar Supabase'den alındı."}</p>
   <div className="mt-6"><h3 className="mb-3 text-sm font-semibold">En çok görüntülenen sayfalar</h3>{report?.top_pages.length?report.top_pages.map(p=><div key={p.path} className="flex justify-between border-b border-[#303139] py-3 text-sm"><span className="text-[#b6b8c1]">{p.path}</span><span className="font-semibold">{p.views}</span></div>):<p className="text-sm text-[#858793]">Henüz veri yok.</p>}</div>
  </>}
  <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs text-[#d7b47e]">Google Analytics 4 (ayrı entegrasyon) <ExternalLink size={13}/></a>
 </section>;
}
