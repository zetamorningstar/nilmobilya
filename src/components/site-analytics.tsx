import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";

const KEY="nil-analytics-consent-v1";
type Consent="accepted"|"rejected"|null;
export function SiteAnalytics(){
 const [choice,setChoice]=useState<Consent>(null);
 useEffect(()=>{const v=localStorage.getItem(KEY);if(v==="accepted"||v==="rejected")setChoice(v)},[]);
 useEffect(()=>{
  if(choice!=="accepted")return;
  let last="";
  const record=async(type:"page_view"|"whatsapp_click",path:string)=>{
   const db=getSupabaseClient();if(!db)return;
   try{await db.rpc("record_site_event",{p_type:type,p_path:path});}catch{}
  };
  const view=()=>{const path=location.pathname;if(path.startsWith("/admin"))return;if(path!==last){last=path;void record("page_view",path)}};
  view();
  const interval=window.setInterval(view,700);
  const click=(event:MouseEvent)=>{
   const target=event.target;
   if(!(target instanceof Element))return;
   const a=target.closest("a[href]") as HTMLAnchorElement|null;
   if(a && /(?:wa\.me|api\.whatsapp\.com)/i.test(a.href))void record("whatsapp_click",location.pathname);
  };
  document.addEventListener("click",click,true);
  return()=>{clearInterval(interval);document.removeEventListener("click",click,true)};
 },[choice]);
 if(choice!==null)return null;
 return <aside aria-label="Analitik tercihleri" className="fixed bottom-5 left-1/2 z-[9999] w-[min(440px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border border-[#6b5940] bg-[#18191e] p-5 text-[#f2eee7] shadow-2xl">
  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d5b37c]">Nil Mobilya · Gizlilik</p>
  <p className="mt-3 text-sm leading-6 text-[#d1cdd0]">Sitemizi geliştirmek için sayfa görüntülemelerini ve WhatsApp tıklamalarını anonim olay sayıları olarak ölçmek istiyoruz. Kabul etmezsen ölçüm yapılmaz. Tercihini daha sonra tarayıcı verilerini temizleyerek sıfırlayabilirsin.</p>
  <div className="mt-4 flex gap-3"><button onClick={()=>{localStorage.setItem(KEY,"rejected");setChoice("rejected")}} className="flex-1 rounded-lg border border-[#51525a] px-4 py-3 text-sm">Reddet</button><button onClick={()=>{localStorage.setItem(KEY,"accepted");setChoice("accepted")}} className="flex-1 rounded-lg bg-[#c6a16a] px-4 py-3 text-sm font-semibold text-[#191919]">Kabul Et</button></div>
 </aside>;
}
