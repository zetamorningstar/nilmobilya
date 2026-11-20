import { useState } from "react";
import { Activity, BarChart3, Layers3, TrendingUp } from "lucide-react";

type Counts={total:number;published:number;categories:number}|null;
export function AdminInsights({counts}:{counts:Counts}){
 const [mode,setMode]=useState<"catalog"|"visitors">("catalog");
 const draft=counts?Math.max(0,counts.total-counts.published):0;
 const series=[{label:"Yayında",value:counts?.published??0,tone:"gold"},{label:"Taslak",value:draft,tone:"blue"},{label:"Kategori",value:counts?.categories??0,tone:"slate"}];
 const max=Math.max(1,...series.map(x=>x.value));
 return <section className="admin-panel mb-6 overflow-hidden rounded-xl border border-[#292b32] bg-[#15161b]">
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292b32] px-6 py-5">
   <div className="flex items-center gap-3"><div className="rounded-lg border border-[#b99763]/25 bg-[#b99763]/10 p-2 text-[#d8b47b]"><Layers3 size={19}/></div><div><h2 className="text-base font-semibold">Veri Merkezi</h2><p className="mt-1 text-xs text-[#858894]">Katalog özeti ve analitik hazırlığı</p></div></div>
   <div className="flex rounded-lg border border-[#30323a] bg-[#101115] p-1 text-xs">
    <button aria-pressed={mode==="catalog"} onClick={()=>setMode("catalog")} className={`rounded-md px-4 py-2 transition-colors ${mode==="catalog"?"bg-[#34302b] text-[#e5c18b]":"text-[#90929c] hover:text-white"}`}>Katalog</button>
    <button aria-pressed={mode==="visitors"} onClick={()=>setMode("visitors")} className={`rounded-md px-4 py-2 transition-colors ${mode==="visitors"?"bg-[#34302b] text-[#e5c18b]":"text-[#90929c] hover:text-white"}`}>Ziyaretçiler</button>
   </div>
  </div>
  {mode==="catalog"?<div className="grid gap-8 p-6 lg:grid-cols-[1.45fr_1fr] lg:p-8">
    <div><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-[#8b8d97]">3D Katalog Analizi</p><h3 className="mt-2 text-xl font-semibold">Ürün dağılımı</h3></div><BarChart3 size={20} className="text-[#b99763]"/></div>
      <div className="admin-chart relative flex h-[255px] items-end justify-around overflow-hidden rounded-xl border border-[#292b32] bg-[#0f1014] px-5 pb-10 pt-6" role="img" aria-label={counts?`Yayında ${counts.published}, taslak ${draft}, kategori ${counts.categories}`:"Katalog verileri yükleniyor"}>
       <div className="admin-chart-grid absolute inset-0" aria-hidden="true"/>
       {series.map(item=><div key={item.label} className="relative z-10 flex h-full w-1/4 flex-col items-center justify-end gap-3"><span className="text-sm font-bold tabular-nums text-[#eee]">{counts?item.value:"—"}</span><div className={`admin-3d-bar admin-3d-bar--${item.tone}`} style={{height:counts?`${Math.max(9,item.value/max*145)}px`:"9px"}}/><span className="whitespace-nowrap text-[11px] text-[#a5a6b0]">{item.label}</span></div>)}
      </div>
      <p className="mt-3 text-xs text-[#7f818d]">Gerçek Supabase katalog verileri · 3D görsel efekt</p>
    </div>
    <div className="flex flex-col justify-center gap-4"><div className="rounded-xl border border-[#30323a] bg-[#1c1d23] p-5"><div className="mb-3 flex items-center gap-2 text-[#d7b47e]"><TrendingUp size={17}/><span className="text-xs font-semibold uppercase tracking-wider">Yayın Durumu</span></div><p className="text-3xl font-bold tabular-nums">{counts?.total?Math.round(counts.published/counts.total*100)+"%":counts?"0%":"—"}</p><p className="mt-2 text-xs text-[#9395a0]">Katalogdaki yayınlanmış ürün oranı</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#34363e]"><div className="h-full rounded-full bg-gradient-to-r from-[#80603a] to-[#e6bf7c] transition-all duration-700" style={{width:counts?.total?`${counts.published/counts.total*100}%`:"0%"}}/></div></div><div className="rounded-xl border border-[#30323a] bg-[#1c1d23] p-5"><p className="text-sm font-semibold">Yönetim notu</p><p className="mt-2 text-xs leading-6 text-[#9d9faa]">Bu grafikler veritabanındaki ürün ve kategori sayılarını gösterir. Site trafiği henüz ölçülmüyor.</p></div></div>
  </div>:<div className="flex min-h-[310px] flex-col items-center justify-center px-6 py-12 text-center"><div className="admin-orbit mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#b99763]/30 bg-[#b99763]/10 text-[#d6b47c]"><Activity size={32}/></div><h3 className="text-xl font-semibold">Ziyaretçi analitiği hazırlanıyor</h3><p className="mt-3 max-w-lg text-sm leading-7 text-[#989aa5]">3D görünümlü ziyaret grafiğini gerçek trafik verileriyle göstereceğiz. Google Analytics 4 bağlantısı kurulana kadar sahte ziyaretçi sayısı gösterilmiyor.</p><span className="mt-5 rounded-full border border-[#4a4032] bg-[#2a231b] px-4 py-2 text-xs text-[#d9b67d]">GA4 bağlantısı bekleniyor</span></div>}
 </section>;
}
