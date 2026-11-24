import { useEffect, useMemo, useState } from "react";
import { Calculator, Plus, Trash2, Download, Layers3, Box, ClipboardList, AlertTriangle, ChevronDown } from "lucide-react";

type Material={id:string;name:string;unit:string;price:number;vat:number;inclusive:boolean;deductible:boolean;updatedAt:string};
type Item={id:string;materialId:string;quantity:number;waste:number};
type Recipe={id:string;name:string;category:string;items:Item[];laborHours:number;hourlyCost:number;processing:number;packaging:number;shipping:number;installation:number;other:number;overhead:number;contingency:number;margin:number;salesVat:number;marketLow:number;marketHigh:number;quantity:number;notes:string;updatedAt:string};
type Store={materials:Material[];recipes:Recipe[];selected:string};
const storageKey="nil-private-cost-estimator-v1";
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const materialNames=[
 ["MDF lam 18 mm","plaka"],["MDF ham 18 mm","plaka"],["Suntalam 18 mm","plaka"],
 ["MDF arkalık 8 mm","plaka"],["Kontrplak","plaka"],["Masif ahşap","m³"],
 ["Ahşap kaplama","m²"],["PVC kenar bandı","metre"],["Menteşe","adet"],
 ["Çekmece rayı","takım"],["Kulp","adet"],["Vida / bağlantı","paket"],
 ["Minifix / kavela","adet"],["Tutkal / silikon","adet"],["Lake boya / vernik","litre"],
 ["Zımpara","adet"],["Ayak / baza","adet"],["Askı / montaj aparatı","adet"],
 ["Tezgâh malzemesi","m²"],["Cam / ayna","m²"]
] as const;
const now=()=>new Date().toISOString().slice(0,10);
const defaultMaterials=():Material[]=>(materialNames.map(([name,unit])=>({id:uid(),name,unit,price:0,vat:20,inclusive:false,deductible:true,updatedAt:""})));
const newRecipe=():Recipe=>({id:uid(),name:"Yeni ürün / proje",category:"Özel üretim",items:[],laborHours:0,hourlyCost:0,processing:0,packaging:0,shipping:0,installation:0,other:0,overhead:10,contingency:5,margin:30,salesVat:10,marketLow:0,marketHigh:0,quantity:1,notes:"",updatedAt:now()});
const initial=():Store=>{const r=newRecipe();return{materials:defaultMaterials(),recipes:[r],selected:r.id}};
const num=(n:number)=>Number.isFinite(n)?Math.max(0,n):0;
const money=(n:number)=>n.toLocaleString("tr-TR",{style:"currency",currency:"TRY",minimumFractionDigits:0,maximumFractionDigits:2});
const panel="rounded-2xl border border-[#353c46] bg-[#171b20] p-4 shadow-[0_10px_35px_rgba(0,0,0,.16)] sm:p-5";
const input="w-full min-w-0 rounded-lg border border-[#424b57] bg-[#111419] px-3 py-2.5 text-sm text-[#e7e0d4] outline-none focus:border-[#a98a59]";
const button="inline-flex items-center justify-center gap-2 rounded-lg border border-[#4b5563] bg-[#242a31] px-3.5 py-2.5 text-xs font-medium text-[#d7bd94] transition-colors hover:border-[#826c4c] hover:bg-[#302c27]";
const label="block text-[11px] text-[#aeb6c1]";
export function AdminCostEstimator(){
 const [data,setData]=useState<Store|null>(null);
 const [notice,setNotice]=useState("");
 const [tab,setTab]=useState<"product"|"materials"|"expenses">("product");
 const [showLibrary,setShowLibrary]=useState(false);
 const [showAdvanced,setShowAdvanced]=useState(false);
 const [fileName,setFileName]=useState("nil-maliyet-hesaplari.json");
 useEffect(()=>{try{const raw=localStorage.getItem(storageKey);if(raw){const parsed=JSON.parse(raw) as Store;if(Array.isArray(parsed.materials)&&Array.isArray(parsed.recipes)){setData(parsed);return;}}}catch{}setData(initial());},[]);
 useEffect(()=>{if(!data)return;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch{setNotice("Tarayıcı kaydı başarısız. JSON yedeği al.");}},[data]);
 const recipe=data?.recipes.find(r=>r.id===data.selected)??data?.recipes[0];
 const setRecipe=(patch:Partial<Recipe>)=>setData(prev=>prev?{...prev,recipes:prev.recipes.map(r=>r.id===(recipe?.id)?{...r,...patch,updatedAt:now()}:r)}:prev);
 const setMaterial=(id:string,patch:Partial<Material>)=>setData(prev=>prev?{...prev,materials:prev.materials.map(m=>m.id===id?{...m,...patch,updatedAt:now()}:m)}:prev);
 const calc=useMemo(()=>{
  if(!recipe||!data)return null;
  const lines=recipe.items.map(row=>{const m=data.materials.find(x=>x.id===row.materialId);if(!m)return null;const base=num(m.inclusive?m.price/(1+num(m.vat)/100):m.price),taxIncluded=!m.deductible?num(m.inclusive?m.price-base:base*m.vat/100):0,unitCost=base+taxIncluded,needed=num(row.quantity)*(1+Math.min(500,num(row.waste))/100);return{...row,name:m.name,unit:m.unit,unitCost,needed,sum:needed*unitCost,updatedAt:m.updatedAt,valid:m.price>0};}).filter((x):x is NonNullable<typeof x>=>!!x);
  const materials=lines.reduce((t,l)=>t+l.sum,0);
  const labor=num(recipe.laborHours)*num(recipe.hourlyCost);
  const direct=materials+labor+num(recipe.processing)+num(recipe.packaging)+num(recipe.shipping)+num(recipe.installation)+num(recipe.other);
  const overhead=direct*num(recipe.overhead)/100;
  const contingency=(direct+overhead)*num(recipe.contingency)/100;
  const cost=direct+overhead+contingency;
  const margin=Math.min(95,num(recipe.margin));
  const saleNet=cost/(1-margin/100);
  const saleVat=saleNet*Math.min(100,num(recipe.salesVat))/100;
  const saleGross=saleNet+saleVat;
  const profit=saleNet-cost;
  const count=Math.max(1,num(recipe.quantity));
  return{lines,materials,labor,direct,overhead,contingency,cost,saleNet,saleVat,saleGross,profit,count,margin,missing:lines.filter(l=>!l.valid).length,marketLow:num(recipe.marketLow),marketHigh:num(recipe.marketHigh)};
 },[data,recipe]);
 const exportJson=()=>{if(!data)return;const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),...data},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=fileName;a.click();URL.revokeObjectURL(url);setNotice("Yedek dosyası hazırlandı.")};
 const importJson=async(file:File|undefined)=>{if(!file)return;try{if(file.size>2e6)throw Error("Dosya çok büyük.");const parsed=JSON.parse(await file.text()) as Store;if(!Array.isArray(parsed.materials)||!Array.isArray(parsed.recipes)||parsed.materials.length>500||parsed.recipes.length>500)throw Error("Geçersiz hesaplama yedeği.");setData({materials:parsed.materials,recipes:parsed.recipes,selected:parsed.selected});setNotice("Yedek içe aktarıldı.");}catch{setNotice("Yedek okunamadı. Geçerli bir JSON dosyası seç.");}};
 if(!data||!recipe||!calc)return <p className="p-6 text-sm text-[#c1c6cc]">Hesaplayıcı hazırlanıyor…</p>;
 const editNum=(key:keyof Recipe,val:string)=>setRecipe({[key]:num(Number(val))} as Partial<Recipe>);
 const nField=(title:string,key:keyof Recipe,unit?:string)=><label className={label}>{title}{unit?<span className="ml-1 text-[#858f9d]">({unit})</span>:null}<input type="number" min="0" step="any" value={recipe[key] as number} onChange={e=>editNum(key,e.target.value)} className={input+" mt-1.5"}/></label>;
 const isFresh=calc.lines.some(l=>l.updatedAt&&!isNaN(Date.parse(l.updatedAt))&&Date.now()-Date.parse(l.updatedAt)>30*24*3600e3);
 return <section className="space-y-5 text-[#e9edf2]">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-[10px] uppercase tracking-[.17em] text-[#939eac]">ÜRETİM / FİYATLANDIRMA</p><h1 className="mt-1 font-display text-3xl text-[#c4a36b]">Fiyat Hesaplama</h1><p className="mt-1 text-xs text-[#a9b2bf]">Ürününü oluştur, giderleri gir, satış fiyatını gör.</p></div>
   <div className="flex flex-wrap gap-2"><button className={button} onClick={()=>{const r=newRecipe();setData({...data,recipes:[...data.recipes,r],selected:r.id});setTab("product")}}><Plus size={15}/> Yeni ürün</button><button className={button} onClick={exportJson}><Download size={15}/> Yedek al</button></div>
  </div>
  {notice&&<p role="status" className="rounded-lg border border-[#5f6977] bg-[#27303a] p-3 text-xs">{notice}</p>}
  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(290px,.38fr)]">
   <div className="space-y-4">
    <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#343c46] bg-[#15191e] p-2" aria-label="Hesaplama bölümleri">
     {([["product","1. Ürün"],["materials","2. Malzemeler"],["expenses","3. Giderler"]] as const).map(([id,title])=><button type="button" key={id} onClick={()=>setTab(id)} aria-pressed={tab===id} className={`rounded-lg px-2 py-3 text-xs font-semibold transition-colors sm:text-sm ${tab===id?"bg-[#302c27] text-[#d7bd94]":"text-[#aab2bd] hover:bg-[#252b33]"}`}>{title}</button>)}
    </div>
    {tab==="product"&&<div className={panel}>
     <h2 className="mb-5 flex items-center gap-2 text-base font-semibold"><Box size={18}/> Ürünü tanımla</h2>
     <label className={label}>Kayıtlı ürünler<select className={input+" mt-2"} value={recipe.id} onChange={e=>setData({...data,selected:e.target.value})}>{data.recipes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
     <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className={label}>Ürün adı<input value={recipe.name} onChange={e=>setRecipe({name:e.target.value})} className={input+" mt-2"} maxLength={120}/></label><label className={label}>Ürün kategorisi<input value={recipe.category} onChange={e=>setRecipe({category:e.target.value})} className={input+" mt-2"} maxLength={80}/></label></div>
     <div className="mt-4 grid grid-cols-2 gap-4">{nField("Ürün adedi","quantity","adet")}{nField("Hedef kâr marjı","margin","%")}</div>
     <p className="mt-5 text-xs leading-6 text-[#a5afbc]">Fiyatı doğru hesaplamak için ürünün malzemelerini ve işçilik giderlerini sonraki adımlara gir.</p>
     <div className="mt-5 flex flex-wrap gap-2"><button className={button} onClick={()=>setTab("materials")}>Malzemelere geç →</button><button className={button} onClick={()=>{const c={...recipe,id:uid(),name:recipe.name+" (kopya)",updatedAt:now()};setData({...data,recipes:[...data.recipes,c],selected:c.id})}}>Kopyala</button><button className={button+" !text-red-300"} onClick={()=>{if(!confirm("Bu hesaplamayı silmek istiyor musun?"))return;const remaining=data.recipes.filter(x=>x.id!==recipe.id);if(!remaining.length)remaining.push(newRecipe());setData({...data,recipes:remaining,selected:remaining[0].id})}}><Trash2 size={15}/> Sil</button></div>
    </div>}
    {tab==="materials"&&<div className={panel}>
     <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 text-base font-semibold"><Layers3 size={18}/> Kullanılan malzemeler</h2><p className="mt-1 text-xs text-[#aab3bf]">Ürünün ihtiyacı kadar miktar ve fire payını gir.</p></div><button className={button} onClick={()=>{const m=data.materials[0];if(m)setRecipe({items:[...recipe.items,{id:uid(),materialId:m.id,quantity:1,waste:0}]})}}><Plus size={15}/> Malzeme ekle</button></div>
     <div className="space-y-3">{recipe.items.map(it=>{const m=data.materials.find(x=>x.id===it.materialId);const line=calc.lines.find(x=>x.id===it.id);const change=(patch:Partial<Item>)=>setRecipe({items:recipe.items.map(x=>x.id===it.id?{...x,...patch}:x)});return <div key={it.id} className="rounded-xl border border-[#3a444f] bg-[#111519] p-3">
      <div className="flex items-center gap-2"><select className={input+" flex-1"} value={it.materialId} onChange={e=>change({materialId:e.target.value})}>{data.materials.map(x=><option key={x.id} value={x.id}>{x.name} ({x.unit})</option>)}</select><button aria-label="Malzemeyi kaldır" className="rounded-lg border border-[#414955] p-2.5 text-[#b8c0ca]" onClick={()=>setRecipe({items:recipe.items.filter(x=>x.id!==it.id)})}><Trash2 size={16}/></button></div>
      <div className="mt-3 grid grid-cols-3 items-end gap-3"><label className={label}>Miktar ({m?.unit||"birim"})<input className={input+" mt-1"} type="number" min="0" step="any" value={it.quantity} onChange={e=>change({quantity:num(+e.target.value)})}/></label><label className={label}>Fire %<input className={input+" mt-1"} type="number" min="0" max="500" step="any" value={it.waste} onChange={e=>change({waste:num(+e.target.value)})}/></label><div className="pb-2 text-right text-sm font-medium">{money(line?.sum||0)}</div></div>{m?.price===0&&<p className="mt-2 text-[11px] text-amber-200">Bu malzemenin birim fiyatını aşağıdan ekle.</p>}</div>})}</div>
     {recipe.items.length===0&&<div className="rounded-lg border border-dashed border-[#495461] px-4 py-10 text-center text-xs text-[#acb5c0]">Bu ürünün henüz malzemesi yok.</div>}
     <button type="button" className="mt-5 flex w-full items-center justify-between rounded-xl border border-[#4b5664] bg-[#222932] px-4 py-3 text-sm text-[#e3e8ee]" onClick={()=>setShowLibrary(v=>!v)} aria-expanded={showLibrary}><span>Malzeme kütüphanesi · {data.materials.length} kayıt</span><ChevronDown size={17} className={showLibrary?"rotate-180":""}/></button>
     {showLibrary&&<div className="mt-3 space-y-3 rounded-xl border border-[#36404c] bg-[#11161c] p-3">
       <div className="flex items-center justify-between gap-2"><p className="text-xs leading-5 text-[#aab4c0]">İsim, birim, alış fiyatı ve KDV bilgilerini düzenle.</p><button className={button} onClick={()=>setData({...data,materials:[...data.materials,{id:uid(),name:"Yeni malzeme",unit:"adet",price:0,vat:20,inclusive:false,deductible:true,updatedAt:""}]})}><Plus size={14}/> Yeni</button></div>
       <div className="max-h-[410px] space-y-2 overflow-y-auto">{data.materials.map(m=><div key={m.id} className="rounded-lg border border-[#37424e] p-3">
         <div className="grid grid-cols-[minmax(0,1fr)_85px_100px_32px] gap-2"><input aria-label="Malzeme adı" className={input} value={m.name} onChange={e=>setMaterial(m.id,{name:e.target.value})}/><select aria-label="Birim" className={input} value={m.unit} onChange={e=>setMaterial(m.id,{unit:e.target.value})}>{["plaka","m²","metre","adet","takım","paket","litre","kg","m³","saat"].map(u=><option key={u}>{u}</option>)}</select><input aria-label="Birim fiyatı" className={input} type="number" min="0" step="any" value={m.price} onChange={e=>setMaterial(m.id,{price:num(+e.target.value)})}/><button aria-label="Malzemeyi sil" className="text-[#b0bac5]" onClick={()=>{if(data.recipes.some(r=>r.items.some(i=>i.materialId===m.id))){setNotice("Kullanılan malzemeyi önce reçetelerden kaldır.");return}setData({...data,materials:data.materials.filter(x=>x.id!==m.id)})}}><Trash2 size={15}/></button></div>
         <details className="mt-2 text-xs text-[#9faab8]"><summary className="cursor-pointer py-2">KDV ve alış detayları</summary><div className="grid grid-cols-2 gap-3 pt-2"><label className={label}>Alış KDV (%)<select className={input+" mt-1"} value={m.vat} onChange={e=>setMaterial(m.id,{vat:num(+e.target.value)})}>{[0,1,10,20].map(v=><option key={v} value={v}>%{v}</option>)}</select></label><label className={label}>Alış fiyatı<select className={input+" mt-1"} value={m.inclusive?"incl":"excl"} onChange={e=>setMaterial(m.id,{inclusive:e.target.value==="incl"})}><option value="excl">KDV hariç</option><option value="incl">KDV dahil</option></select></label><label className={label+" col-span-2 flex items-center gap-2"}><input type="checkbox" checked={m.deductible} onChange={e=>setMaterial(m.id,{deductible:e.target.checked})}/> İndirilebilir alış KDV</label></div></details>
       </div>)}</div>
     </div>}
     <button className={button+" mt-4"} onClick={()=>setTab("expenses")}>Giderlere geç →</button>
    </div>}
    {tab==="expenses"&&<div className={panel}>
     <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><ClipboardList size={18}/> İşçilik ve giderler</h2>
     <div className="grid grid-cols-2 gap-4">{nField("Üretim süresi","laborHours","saat")}{nField("Saatlik işçilik maliyeti","hourlyCost","₺/saat")}{nField("Nakliye","shipping","₺")}{nField("Montaj","installation","₺")}</div>
     <button type="button" className="mt-5 flex w-full items-center justify-between border-t border-[#363f49] py-3 text-xs text-[#c3cbd5]" aria-expanded={showAdvanced} onClick={()=>setShowAdvanced(x=>!x)}><span>Detaylı giderler, KDV ve piyasa karşılaştırması</span><ChevronDown size={17} className={showAdvanced?"rotate-180":""}/></button>
     {showAdvanced&&<div className="grid grid-cols-2 gap-4 pt-3">{nField("Fason / CNC / boya","processing","₺")}{nField("Ambalaj","packaging","₺")}{nField("Diğer giderler","other","₺")}{nField("Genel gider","overhead","%")}{nField("Risk / fire payı","contingency","%")}{nField("Satış KDV","salesVat","%")}{nField("Piyasa alt fiyatı","marketLow","₺")}{nField("Piyasa üst fiyatı","marketHigh","₺")}</div>}
     <label className={label+" mt-5"}>Proje notları<textarea className={input+" mt-2 min-h-[90px]"} value={recipe.notes} onChange={e=>setRecipe({notes:e.target.value})} placeholder="Tedarikçi, fiyat tarihi, üretim detayları…"/></label>
     <p className="mt-4 text-[11px] leading-5 text-[#9da8b6]">İşçilik saatlik bedeline işveren maliyetlerini dahil et. Fason hizmetleri ikinci kez sayma. Satış KDV oranını muhasebecinle doğrula.</p>
    </div>}
    <details className="rounded-xl border border-[#303b47] bg-[#151a20] px-4 py-3 text-xs text-[#aeb8c4]"><summary className="cursor-pointer">Yedek ve veri saklama bilgileri</summary><div className="mt-4 space-y-3"><p>Hesaplamalar bu tarayıcıda saklanır; başka cihazlarla eşitlenmez. Düzenli yedek al.</p><label className={label}>Yedek dosya adı<input className={input+" mt-1"} value={fileName} onChange={e=>setFileName(e.target.value)}/></label><label className={label}>JSON yedeğini geri yükle<input type="file" accept=".json,application/json" className="mt-2 block w-full" onChange={e=>{void importJson(e.target.files?.[0]);e.target.value=""}}/></label></div></details>
   </div>
   <aside className="xl:sticky xl:top-[92px] xl:self-start">
    <div className="rounded-2xl border border-[#5b6978] bg-[linear-gradient(145deg,#2a333e,#151b22)] p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
      <div className="flex items-center gap-2 text-sm font-semibold"><Calculator size={17}/> Fiyat özeti</div>
      <p className="mt-4 text-[11px] text-[#b4bdca]">Tahmini satış fiyatı · KDV dahil</p>
      <p className="mt-2 text-[clamp(25px,3vw,37px)] font-semibold tabular-nums tracking-tight text-[#d2b17c]">{money(calc.saleGross)}</p>
      <p className="mt-1 text-xs text-[#aebbc9]">{calc.count} ürün · Birim: {money(calc.saleGross/calc.count)}</p>
      <div className="mt-5 border-t border-[#566171] pt-2">{([["Malzeme",calc.materials],["İşçilik",calc.labor],["Diğer doğrudan giderler",calc.direct-calc.materials-calc.labor],["Genel gider + risk",calc.overhead+calc.contingency],["Toplam maliyet",calc.cost],["KDV hariç satış",calc.saleNet],["Satış KDV",calc.saleVat],["Tahmini kâr",calc.profit]] as const).map(([name,val])=><div key={name} className="flex justify-between gap-3 border-b border-[#4c5765]/45 py-2.5 text-xs"><span className="text-[#b3beca]">{name}</span><strong className="shrink-0">{money(val)}</strong></div>)}</div>
      <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-lg border border-[#606b78] p-3 text-center"><span className="block text-[10px] text-[#b9c4cf]">Hedef marj</span><strong className="mt-1 block text-sm">%{calc.margin}</strong></div><div className="rounded-lg border border-[#606b78] p-3 text-center"><span className="block text-[10px] text-[#b9c4cf]">Birim maliyet</span><strong className="mt-1 block text-sm">{money(calc.cost/calc.count)}</strong></div></div>
      {calc.marketLow>0&&calc.marketHigh>0&&<p className="mt-4 text-xs leading-5 text-[#bcc7d3]">Piyasa: {money(calc.marketLow)} – {money(calc.marketHigh)}. Fiyatın {calc.saleGross<calc.marketLow?"aralığın altında":calc.saleGross>calc.marketHigh?"aralığın üstünde":"aralığın içinde"}.</p>}
      {(calc.missing>0||!recipe.laborHours||!recipe.hourlyCost||calc.cost===0)&&<p role="alert" className="mt-4 flex gap-2 rounded-lg border border-[#766c47]/60 bg-[#2d2b22] p-3 text-[11px] leading-5 text-amber-100"><AlertTriangle size={16} className="shrink-0"/>Eksik fiyat veya işçilik bilgisi var. Bu sonuç henüz güvenilir değil.</p>}
      {isFresh&&<p className="mt-2 text-[11px] text-amber-200">Eski malzeme fiyatlarını güncelle.</p>}
      <p className="mt-4 text-[10px] leading-5 text-[#a4afbb]">Bu araç yaklaşık fiyat hesaplar. Kesin teklif ve KDV sınıflandırması ayrıca kontrol edilmelidir.</p>
    </div>
   </aside>
  </div>
 </section>;
}
