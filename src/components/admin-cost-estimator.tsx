import { useEffect, useMemo, useState } from "react";
import { Calculator, Plus, Trash2, Save, Download, Layers3, Box, ClipboardList, AlertTriangle, RotateCcw } from "lucide-react";

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
const input="w-full min-w-0 rounded-lg border border-[#424b57] bg-[#111419] px-3 py-2.5 text-sm text-[#f0f2f5] outline-none focus:border-[#9faab8]";
const button="inline-flex items-center justify-center gap-2 rounded-lg border border-[#4b5563] bg-[#292f38] px-3.5 py-2.5 text-xs font-medium text-[#e6eaf0] transition-colors hover:bg-[#38414d]";
const label="block text-[11px] text-[#aeb6c1]";
export function AdminCostEstimator(){
 const [data,setData]=useState<Store|null>(null);
 const [notice,setNotice]=useState("");
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
  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.19em] text-[#9ba6b5]">ÜRETİM / MALİYET YÖNETİMİ</p><h1 className="mt-2 font-display text-3xl sm:text-4xl">Fiyat Hesaplama</h1><p className="mt-2 text-xs leading-6 text-[#a8b1bd]">Ürün reçetesi, gerçek malzeme fiyatı, işçilik, genel gider, kâr marjı ve KDV ile yaklaşık teklif belirle.</p></div><div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={()=>{const r=newRecipe();setData({...data,recipes:[...data.recipes,r],selected:r.id})}}><Plus size={15}/> Yeni Hesaplama</button><button type="button" className={button} onClick={exportJson}><Download size={15}/> JSON Yedeği</button></div></div>
  <div role="note" className="rounded-xl border border-[#5c6470] bg-[#232a33] px-4 py-3 text-xs leading-6 text-[#c6ced8]"><strong>Özel yönetici aracı.</strong> Kayıtlar şimdilik bu tarayıcıda saklanır; başka cihazla otomatik eşitlenmez. Düzenli JSON yedeği al. Bu ekranın fiyatları örnek piyasa verisi değildir. KDV oranını ve alış KDV'sinin indirim durumunu muhasebecinle teyit et.</div>
  {notice&&<p role="status" className="rounded-lg border border-[#697682] bg-[#262e38] px-4 py-2 text-xs">{notice}</p>}
  <div className="grid gap-4 2xl:grid-cols-[minmax(270px,.9fr)_minmax(380px,1.3fr)_minmax(300px,.88fr)]">
   <div className="space-y-4">
    <div className={panel}><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Box size={18}/> Ürün Bilgisi</h2>
      <label className={label}>Hesaplama seç<select className={input+" mt-1.5"} value={recipe.id} onChange={e=>setData({...data,selected:e.target.value})}>{data.recipes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label className={label+" mt-3"}>Ürün / proje adı<input className={input+" mt-1.5"} value={recipe.name} maxLength={120} onChange={e=>setRecipe({name:e.target.value})}/></label>
      <label className={label+" mt-3"}>Kategori<input className={input+" mt-1.5"} value={recipe.category} maxLength={80} onChange={e=>setRecipe({category:e.target.value})}/></label>
      <div className="mt-3 grid grid-cols-2 gap-3">{nField("Ürün adedi","quantity","adet")}{nField("Hedef gerçek kâr marjı","margin","%")}</div>
      <div className="mt-4 flex flex-wrap gap-2"><button type="button" className={button} onClick={()=>{const c={...recipe,id:uid(),name:recipe.name+" (kopya)",updatedAt:now()};setData({...data,recipes:[...data.recipes,c],selected:c.id})}}>Reçeteyi Kopyala</button><button type="button" className={button+" !border-red-900/50 !text-red-300"} onClick={()=>{if(!confirm("Bu hesaplamayı silmek istiyor musun?"))return;const other=data.recipes.filter(x=>x.id!==recipe.id);if(!other.length)other.push(newRecipe());setData({...data,recipes:other,selected:other[0].id})}}><Trash2 size={14}/> Sil</button></div>
    </div>
    <div className={panel}><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><ClipboardList size={18}/> İşçilik ve Operasyon</h2>
     <div className="grid grid-cols-2 gap-3">{nField("Üretim süresi","laborHours","saat")}{nField("Saatlik işveren maliyeti","hourlyCost","₺/saat")}{nField("Fason / CNC / boya","processing","₺")}{nField("Ambalaj","packaging","₺")}{nField("Nakliye","shipping","₺")}{nField("Yerinde montaj","installation","₺")}{nField("Diğer giderler","other","₺")}{nField("Genel gider payı","overhead","%")}{nField("Risk / beklenmeyen","contingency","%")}{nField("Satış KDV oranı","salesVat","%")}</div>
     <p className="mt-3 text-[11px] leading-5 text-[#9ca7b5]">İşveren saatlik maliyetinde brüt ücret, işveren SGK payı, izin ve yan haklar gibi gerçek giderlerini kullan; SGK'yı ikinci kez ekleme. Fason boya ve montajı ayrıca giriyorsan üretim saatlerine tekrar dahil etme.</p>
    </div>
   </div>
   <div className="space-y-4">
    <div className={panel}><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold"><Layers3 size={18}/> Malzeme ve Miktar</h2><button type="button" className={button} onClick={()=>{const m=data.materials[0];if(m)setRecipe({items:[...recipe.items,{id:uid(),materialId:m.id,quantity:1,waste:0}]})}}><Plus size={15}/> Reçeteye Ekle</button></div>
     <div className="space-y-3">{recipe.items.map((it)=>{const m=data.materials.find(x=>x.id===it.materialId);const line=calc.lines.find(x=>x.id===it.id);const change=(patch:Partial<Item>)=>setRecipe({items:recipe.items.map(x=>x.id===it.id?{...x,...patch}:x)});return <div key={it.id} className="rounded-xl border border-[#3c444f] bg-[#111419] p-3"><div className="flex gap-2"><select className={input+" flex-1"} value={it.materialId} onChange={e=>change({materialId:e.target.value})}>{data.materials.map(x=><option key={x.id} value={x.id}>{x.name} ({x.unit})</option>)}</select><button className="rounded-lg border border-[#4c535d] px-3 text-[#c7ced8]" title="Satırı kaldır" onClick={()=>setRecipe({items:recipe.items.filter(x=>x.id!==it.id)})}><Trash2 size={15}/></button></div><div className="mt-2 grid grid-cols-[1fr_1fr_1.1fr] items-end gap-2"><label className={label}>Miktar ({m?.unit||"birim"})<input type="number" min="0" step="any" value={it.quantity} onChange={e=>change({quantity:num(+e.target.value)})} className={input+" mt-1"}/></label><label className={label}>Fire (%)<input type="number" min="0" max="500" step="any" value={it.waste} onChange={e=>change({waste:num(+e.target.value)})} className={input+" mt-1"}/></label><div className="pb-2 text-right text-xs font-semibold">{money(line?.sum||0)}</div></div>{m?.price===0&&<p className="mt-2 text-[11px] text-amber-300">Bu malzemenin fiyatı 0 ₺. Katalogdan güncelle.</p>}</div>})}{!recipe.items.length&&<p className="rounded-lg border border-dashed border-[#4b545f] p-7 text-center text-xs text-[#a7b1be]">Henüz malzeme yok. Yukarıdan reçeteye malzeme ekle.</p>}</div>
    </div>
    <div className={panel}><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-semibold">Malzeme Kütüphanesi</h2><p className="mt-1 text-[11px] text-[#9ea9b7]">İsim, birim, fiyat, alış KDV'si ve indirilebilirlik durumunu yönet.</p></div><button className={button} type="button" onClick={()=>setData({...data,materials:[...data.materials,{id:uid(),name:"Yeni malzeme",unit:"adet",price:0,vat:20,inclusive:false,deductible:true,updatedAt:""}]})}><Plus size={15}/> Malzeme Ekle</button></div>
     <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">{data.materials.map(m=><div key={m.id} className="grid grid-cols-[1.5fr_.6fr_.85fr_auto] gap-2 rounded-xl border border-[#3d444e] bg-[#111419] p-2"><input aria-label="Malzeme adı" className={input} value={m.name} onChange={e=>setMaterial(m.id,{name:e.target.value})}/><select aria-label="Birim" className={input} value={m.unit} onChange={e=>setMaterial(m.id,{unit:e.target.value})}>{["plaka","m²","metre","adet","takım","paket","litre","kg","m³","saat"].map(u=><option key={u}>{u}</option>)}</select><input aria-label="Birim fiyat (TL)" type="number" min="0" step="any" className={input} value={m.price} onChange={e=>setMaterial(m.id,{price:num(+e.target.value)})}/><button aria-label="Malzemeyi sil" className="px-2 text-[#a6b0bd] hover:text-red-300" onClick={()=>{if(recipe.items.some(i=>i.materialId===m.id)||data.recipes.some(r=>r.items.some(i=>i.materialId===m.id))){setNotice("Bu malzeme bir reçetede kullanılıyor. Önce reçeteden kaldır.");return}setData({...data,materials:data.materials.filter(x=>x.id!==m.id)})}}><Trash2 size={15}/></button><div className="col-span-4 grid grid-cols-[1fr_1fr_1.2fr_auto] items-center gap-2 px-1"><label className={label}>Alış KDV (%)<select className={input+" mt-1"} value={m.vat} onChange={e=>setMaterial(m.id,{vat:num(+e.target.value)})}>{[0,1,10,20].map(v=><option key={v} value={v}>%{v}</option>)}</select></label><label className={label}>Fiyat türü<select className={input+" mt-1"} value={m.inclusive?"incl":"excl"} onChange={e=>setMaterial(m.id,{inclusive:e.target.value==="incl"})}><option value="excl">KDV hariç</option><option value="incl">KDV dahil</option></select></label><label className={label+" flex items-center gap-2 pt-5"}><input type="checkbox" checked={m.deductible} onChange={e=>setMaterial(m.id,{deductible:e.target.checked})}/> İndirilebilir alış KDV</label><span className="pt-4 text-[10px] text-[#8d98a5]">{m.updatedAt||"Fiyat girilmedi"}</span></div></div>)}</div>
    </div>
   </div>
   <div className="space-y-4">
    <div className={panel}><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Calculator size={18}/> Maliyet Özeti</h2>
     {([["Malzeme",calc.materials],["İşçilik",calc.labor],["Fason, paketleme, nakliye, montaj, diğer",calc.direct-calc.materials-calc.labor],["Genel gider payı",calc.overhead],["Risk / beklenmeyen payı",calc.contingency]] as const).map(([name,val])=><div key={name} className="flex items-start justify-between gap-3 border-b border-[#353b45] py-2.5 text-xs"><span className="text-[#acb5c1]">{name}</span><strong className="shrink-0">{money(val)}</strong></div>)}
     <div className="mt-3 flex justify-between rounded-lg bg-[#2b333d] px-3 py-3 text-sm font-semibold"><span>Toplam maliyet</span><span>{money(calc.cost)}</span></div>
     <div className="mt-4 rounded-xl border border-[#647080] bg-[linear-gradient(135deg,#353e4a,#1b222b)] p-4"><p className="text-[11px] text-[#c6cfda]">Önerilen satış (KDV dahil) · {calc.count} adet</p><p className="mt-2 text-3xl font-semibold tabular-nums">{money(calc.saleGross)}</p><div className="mt-3 flex justify-between text-xs text-[#ccd4dc]"><span>KDV hariç satış</span><strong>{money(calc.saleNet)}</strong></div><div className="mt-2 flex justify-between text-xs text-[#ccd4dc]"><span>Satış KDV (%{recipe.salesVat})</span><strong>{money(calc.saleVat)}</strong></div><div className="mt-2 flex justify-between text-xs text-[#ccd4dc]"><span>Brüt katkı / kâr</span><strong>{money(calc.profit)}</strong></div></div>
     <div className="mt-3 grid grid-cols-2 gap-2 text-center"><div className="rounded-lg border border-[#434c58] p-3"><span className="block text-[10px] text-[#aab3c0]">Bir adet maliyet</span><strong className="mt-1 block text-sm">{money(calc.cost/calc.count)}</strong></div><div className="rounded-lg border border-[#434c58] p-3"><span className="block text-[10px] text-[#aab3c0]">Bir adet satış (KDV dahil)</span><strong className="mt-1 block text-sm">{money(calc.saleGross/calc.count)}</strong></div></div>
     {calc.missing>0&&<p role="alert" className="mt-3 flex gap-2 text-[11px] leading-5 text-amber-200"><AlertTriangle size={16}/>{calc.missing} malzemede sıfır fiyat var. Teklif vermeden fiyatları doldur.</p>}
     {isFresh&&<p className="mt-2 text-[11px] text-amber-200">30 günden eski malzeme fiyatlarını güncelle.</p>}
     {!recipe.laborHours||!recipe.hourlyCost?<p className="mt-2 text-[11px] text-amber-200">İşçilik süresi veya saatlik maliyet boş. Sonuç eksik kalabilir.</p>:null}
    </div>
    <div className={panel}><h2 className="mb-3 text-sm font-semibold">Piyasa Karşılaştırması</h2><p className="mb-3 text-[11px] leading-5 text-[#aab2bc]">Benzer iş için manuel gözlenen KDV dahil piyasa fiyatlarını gir. Otomatik veri çekilmiyor.</p><div className="grid grid-cols-2 gap-3">{nField("En düşük piyasa","marketLow","₺")}{nField("En yüksek piyasa","marketHigh","₺")}</div>{calc.marketLow>0&&calc.marketHigh>0&&<p className="mt-3 text-xs text-[#cbd2db]">Piyasa aralığı: {money(calc.marketLow)} – {money(calc.marketHigh)}<br/>Senin fiyatın: {calc.saleGross<calc.marketLow?"Aralığın altında":calc.saleGross>calc.marketHigh?"Aralığın üstünde":"Aralığın içinde"}</p>}</div>
    <div className={panel}><h2 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Save size={17}/> Kayıt ve Notlar</h2><textarea className={input+" min-h-[96px]"} value={recipe.notes} onChange={e=>setRecipe({notes:e.target.value})} placeholder="Tedarikçi, fiyat geçerlilik tarihi, teklif koşulları…"/><p className="mt-2 text-[11px] leading-5 text-[#aab3bf]">Otomatik tarayıcı kaydı etkin. Ticari teklif öncesi ölçü, kesim planı, malzeme alış faturası, işçilik ve KDV muhasebeciyle doğrulanmalı.</p><label className={label+" mt-3"}>Yedek dosya adı<input className={input+" mt-1"} value={fileName} onChange={e=>setFileName(e.target.value)}/></label><label className={label+" mt-3"}>JSON yedeği geri yükle<input type="file" accept=".json,application/json" className="mt-2 block w-full text-xs text-[#b9c3d0]" onChange={e=>{void importJson(e.target.files?.[0]);e.target.value="";}}/></label></div>
   </div>
  </div>
 </section>;
}
