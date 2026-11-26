import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";

const KEY="nil-analytics-consent-v1";
const GA_ID="G-VCCPXJ6HMG";
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args:unknown[])=>void; } }
let gaReady: Promise<boolean> | null = null;
function loadGA(): Promise<boolean> {
 if(typeof window==="undefined" || !["nilmobilyatasarim.com","www.nilmobilyatasarim.com"].includes(location.hostname)) return Promise.resolve(false);
 if(gaReady)return gaReady;
 gaReady=new Promise(resolve=>{
  // GA4 is only initialized after the visitor has opted in.
  window.dataLayer=window.dataLayer||[];
  window.gtag=(...args:unknown[])=>{window.dataLayer?.push(args)};
  window.gtag("js",new Date());
  window.gtag("config",GA_ID,{send_page_view:false});
  const existing=document.getElementById("nil-ga4-script");
  if(existing){resolve(true);return;}
  const script=document.createElement("script");
  script.id="nil-ga4-script";
  script.async=true;
  script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_ID);
  script.onload=()=>resolve(true);
  script.onerror=()=>{gaReady=null;resolve(false)};
  document.head.appendChild(script);
 });
 return gaReady;
}
type Consent="accepted"|"rejected"|null;
export function SiteAnalytics(){
 const [choice,setChoice]=useState<Consent>(null);
 const [preferencesOpen,setPreferencesOpen]=useState(false);
 useEffect(()=>{const v=localStorage.getItem(KEY);if(v==="accepted"||v==="rejected")setChoice(v)},[]);
 const choose=(value:"accepted"|"rejected")=>{localStorage.setItem(KEY,value);setChoice(value);setPreferencesOpen(false);if(choice==="accepted"&&value==="rejected")window.location.reload()};
 useEffect(()=>{
  if(choice!=="accepted")return;
  let active=true;
  let last="";
  // Waiting for the tag to load avoids silently losing the first page_view
  // on slower connections, and handles SPA navigation after initialization.
  const tagReady=loadGA();
  const record=async(type:"page_view"|"whatsapp_click",path:string)=>{
   const db=getSupabaseClient();if(!db)return;
   try{await db.rpc("record_site_event",{p_type:type,p_path:path});}catch{}
  };
  const sendPage=(path:string,href:string,title:string)=>{
    void tagReady.then(ready=>{
      if(!ready||!active)return;
      window.gtag?.("event","page_view",{
        send_to:GA_ID,page_path:path,page_location:href,page_title:title,
        ...(new URLSearchParams(location.search).has("gtm_debug")?{debug_mode:true}:{})
      });
    });
  };
  const view=()=>{const path=location.pathname;if(path.startsWith("/admin"))return;if(path!==last){last=path;void record("page_view",path);sendPage(path,location.href,document.title)}};
  view();
  const interval=window.setInterval(view,700);
  const click=(event:MouseEvent)=>{
   const target=event.target;
   if(!(target instanceof Element))return;
   const a=target.closest("a[href]") as HTMLAnchorElement|null;
   if(a && /(?:wa\.me|api\.whatsapp\.com)/i.test(a.href)){
    void record("whatsapp_click",location.pathname);
    // WhatsApp links contain the customer's composed message in ?text=.
    // Never forward the full URL, contact details, or message to GA4.
    const safeDestination=new URL(a.href).origin+new URL(a.href).pathname;
    void tagReady.then(ready=>{if(ready&&active)window.gtag?.("event","whatsapp_click",{send_to:GA_ID,page_path:location.pathname,link_url:safeDestination})});
   }
   const marked=target.closest("[data-marketing-event]");
   const marketingEvent=marked?.getAttribute("data-marketing-event");
   if(marketingEvent==="quote_category_select"||marketingEvent==="quote_whatsapp_open"){
    void tagReady.then(ready=>{if(ready&&active)window.gtag?.("event",marketingEvent,{send_to:GA_ID,page_path:location.pathname})});
   }
  };
  document.addEventListener("click",click,true);
  return()=>{active=false;clearInterval(interval);document.removeEventListener("click",click,true)};
 },[choice]);
 if(typeof window!=="undefined" && window.location.pathname.startsWith("/admin"))return null;
 if(choice!==null && !preferencesOpen)return <button type="button" onClick={()=>setPreferencesOpen(true)} className="fixed bottom-3 left-3 z-[9998] rounded-full border border-[#6b5940]/60 bg-[#18191e]/90 px-3 py-2 text-[11px] text-[#d5b37c] shadow-lg backdrop-blur-md hover:bg-[#24252b]">Analitik tercihleri</button>;
 return <aside aria-label="Analitik tercihleri" className="fixed bottom-5 left-1/2 z-[9999] w-[min(440px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border border-[#6b5940] bg-[#18191e] p-5 text-[#f2eee7] shadow-2xl">
  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d5b37c]">Nil Mobilya · Gizlilik</p>
  <p className="mt-3 text-sm leading-6 text-[#d1cdd0]">Sitemizi geliştirmek için sayfa görüntülemelerini ve WhatsApp tıklamalarını anonim olay sayıları olarak ölçmek istiyoruz. Kabul etmezsen ölçüm yapılmaz. Tercihini istediğin zaman bu sayfadaki “Analitik tercihleri” düğmesinden değiştirebilirsin.</p>
  <div className="mt-4 flex gap-3"><button onClick={()=>choose("rejected")} className="flex-1 rounded-lg border border-[#51525a] px-4 py-3 text-sm">Reddet</button><button onClick={()=>choose("accepted")} className="flex-1 rounded-lg bg-[#c6a16a] px-4 py-3 text-sm font-semibold text-[#191919]">Kabul Et</button></div>
 </aside>;
}
