import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X, Eye, ArrowUp, ArrowDown, ImageOff } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { CATALOG_SLUGS, getCollection, productSlug } from "@/lib/collections";
import { decodeProductDescription, encodeProductDescription } from "@/lib/live-catalog";

type Product = { id:string; title:string; slug:string; description:string; image_urls:string[]; published:boolean; category_id:string|null; sort_order:number };
type Category = { id:string; name:string; slug:string };
type FormData = { title:string; slug:string; description:string; material:string; standardDimensions:string; details:string; dimensions:string; options:string; image_urls:string; published:boolean; category_id:string; sort_order:number };
const empty:FormData = {title:"",slug:"",description:"",material:"",standardDimensions:"",details:"",dimensions:"",options:"",image_urls:"",published:false,category_id:"",sort_order:0};
const slugify=(s:string)=>s.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const field="w-full rounded-md border border-white/20 bg-[#151618] px-4 py-3 text-sm text-white outline-none focus:border-[#c9a46c]";
const label="block text-sm text-[#d7cfc4]";

export function AdminProducts() {
 const [products,setProducts]=useState<Product[]>([]);
 const [categories,setCategories]=useState<Category[]>([]);
 const [editing,setEditing]=useState<string|null>(null);
 const [form,setForm]=useState<FormData>(empty);
 const [showForm,setShowForm]=useState(false);
 const [newCategory,setNewCategory]=useState("");
 const [importing,setImporting]=useState(false);
 const [uploading,setUploading]=useState(false);
 const [previewOpen,setPreviewOpen]=useState(false);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState("");
 const [success,setSuccess]=useState("");
 const load=useCallback(async()=>{
  const db=getSupabaseClient();
  if(!db)return;
  setLoading(true);setError("");
  const [p,c]=await Promise.all([db.from("products").select("id,title,slug,description,image_urls,published,category_id,sort_order").order("sort_order").order("created_at",{ascending:false}),db.from("categories").select("id,name,slug").order("sort_order")]);
  if(p.error||c.error)setError(p.error?.message||c.error?.message||"Veriler alınamadı");
  else {setProducts(p.data as Product[]);setCategories(c.data as Category[])}
  setLoading(false);
 },[]);
 useEffect(()=>{void load()},[load]);
 const edit=(p:Product)=>{const meta=decodeProductDescription(p.description);setEditing(p.id);setForm({title:p.title,slug:p.slug,description:meta.description,material:meta.material,standardDimensions:meta.standardDimensions,dimensions:meta.dimensions.map(x=>x.label+": "+x.value).join("\n"),details:meta.details.map(x=>x.label+": "+x.value).join("\n"),options:meta.options.map(x=>x.label+": "+x.values.join(", ")).join("\n"),image_urls:p.image_urls.join("\n"),published:p.published,category_id:p.category_id||"",sort_order:p.sort_order});setShowForm(true);setPreviewOpen(false);setError("");setSuccess("")};
 const create=()=>{setEditing(null);setForm(empty);setPreviewOpen(false);setShowForm(true);setError("");setSuccess("")};
 const imageList=()=>form.image_urls.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
 const setImageList=(items:string[])=>setForm(current=>({...current,image_urls:items.join("\n")}));
 const reorderImage=(index:number,direction:number)=>{
   const items=imageList();const other=index+direction;
   if(other<0||other>=items.length)return;
   [items[index],items[other]]=[items[other],items[index]];
   setImageList(items);
 };
 async function togglePublish(p:Product){
   const db=getSupabaseClient();if(!db)return;
   setError("");setSuccess("");
   const {error:e}=await db.from("products").update({published:!p.published,updated_at:new Date().toISOString()}).eq("id",p.id);
   if(e){setError("Yayın durumu değiştirilemedi: "+e.message);return;}
   setProducts(current=>current.map(row=>row.id===p.id?{...row,published:!p.published}:row));
   setSuccess(p.published?"Ürün taslağa alındı.":"Ürün yayına alındı.");
 }
 async function uploadImages(files: FileList | null){
  if(!files?.length)return;
  const db=getSupabaseClient();if(!db){setError("Supabase bağlantısı bulunamadı.");return;}
  setUploading(true);setError("");setSuccess("");
  const uploaded: string[] = [];
  try{
    for(const file of Array.from(files)){
      if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("JPG, PNG veya WebP fotoğraf seç.");
      if(file.size>8*1024*1024)throw new Error("Fotoğraf 8 MB'den küçük olmalı.");
      const extension=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
      const name=(globalThis.crypto?.randomUUID?.() ?? String(Date.now())+"-"+Math.random().toString(36).slice(2))+"."+extension;
      const {error:storageError}=await db.storage.from("nil-product-images").upload(name,file,{contentType:file.type,upsert:false});
      if(storageError)throw storageError;
      const {data}=db.storage.from("nil-product-images").getPublicUrl(name);
      uploaded.push(data.publicUrl);
    }
    setForm(current=>({...current,image_urls:[current.image_urls.trim(),...uploaded].filter(Boolean).join("\n")}));
    setSuccess(uploaded.length+" fotoğraf yüklendi. Ürünü kaydederek yayına alabilirsin.");
  }catch(e){setError((e instanceof Error?e.message:"Fotoğraf yüklenemedi.")+" Storage kurulumu için supabase/product-images.sql dosyasını kontrol et.");}
  finally{setUploading(false);}
 }
 async function save(e:FormEvent){
  e.preventDefault();const db=getSupabaseClient();if(!db)return;
  setSaving(true);setError("");setSuccess("");
  const parsePairs=(raw:string)=>raw.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).map(line=>{const at=line.indexOf(":");return at>0?{label:line.slice(0,at).trim(),value:line.slice(at+1).trim()}:null}).filter((p):p is {label:string;value:string}=>!!p && !!p.label && !!p.value);
  const payload={title:form.title.trim(),slug:slugify(form.slug||form.title),description:encodeProductDescription({description:form.description.trim(),material:form.material.trim(),standardDimensions:form.standardDimensions.trim(),dimensions:parsePairs(form.dimensions),details:parsePairs(form.details),options:parsePairs(form.options).map(p=>({label:p.label,values:p.value.split(",").map(v=>v.trim()).filter(Boolean)}))}),image_urls:form.image_urls.split(/\r?\n/).map(s=>s.trim()).filter(Boolean),published:form.published,category_id:form.category_id||null,sort_order:Number(form.sort_order)||0,updated_at:new Date().toISOString()};
  if(!payload.title||!payload.slug){setError("Ürün adı ve bağlantı adı gerekli.");setSaving(false);return}
  const result=editing?await db.from("products").update(payload).eq("id",editing):await db.from("products").insert(payload);
  setSaving(false);
  if(result.error){setError(result.error.message);return}
  setShowForm(false);setEditing(null);setSuccess(editing?"Ürün güncellendi.":"Ürün kaydedildi.");await load();
 }
 async function remove(p:Product){
  if(!window.confirm("\""+p.title+"\" ürününü kalıcı olarak silmek istiyor musun?"))return;
  const db=getSupabaseClient();if(!db)return;
  const {error:e}=await db.from("products").delete().eq("id",p.id);
  if(e)setError(e.message);else{setSuccess("Ürün silindi.");await load()}
 }
 async function addCategory(event:FormEvent){
  event.preventDefault();const db=getSupabaseClient();if(!db||!newCategory.trim())return;
  const {error:e}=await db.from("categories").insert({name:newCategory.trim(),slug:slugify(newCategory)});
  if(e)setError(e.message);else{setNewCategory("");setSuccess("Kategori eklendi.");await load()}
 }
 async function importExistingCatalog(){
  const db=getSupabaseClient();if(!db)return;
  const source=CATALOG_SLUGS.flatMap(slug=>(getCollection(slug)?.products??[]).map(product=>({slug,product})));
  const missing=source.filter(({product})=>!products.some(p=>p.slug===productSlug(product.name)));
  if(!missing.length){setSuccess("Mevcut katalog ürünleri zaten yönetim panelinde.");return}
  if(!window.confirm(missing.length+" mevcut katalog ürünü Supabase'e aktarılacak. Var olan kayıtlar değiştirilmeyecek. Devam edilsin mi?"))return;
  setImporting(true);setError("");setSuccess("");
  try{
    const known=[...categories];
    for(const slug of CATALOG_SLUGS){
      if(!missing.some(item=>item.slug===slug))continue;
      if(known.some(category=>category.slug===slug))continue;
      const collection=getCollection(slug);
      if(!collection)continue;
      // A missing category only needs INSERT. UPSERT also requires UPDATE privileges
      // and caused an unclear failure for installations with insert-only policies.
      const {data,error}=await db.from("categories").insert({name:collection.title,slug}).select("id,name,slug").single();
      if(error){
        if(error.code==="23505"){
          const existing=await db.from("categories").select("id,name,slug").eq("slug",slug).single();
          if(existing.error)throw new Error("Kategori okunamadı ("+slug+"): "+existing.error.message+" ["+existing.error.code+"]");
          known.push(existing.data as Category);
          continue;
        }
        throw new Error("Kategori oluşturulamadı ("+slug+"): "+error.message+" ["+error.code+"]");
      }
      known.push(data as Category);
    }
    for(const {slug,product} of missing){
      const payload={
        title:product.name,slug:productSlug(product.name),
        category_id:known.find(category=>category.slug===slug)?.id??null,
        description:encodeProductDescription({description:product.productInfo||"",material:product.material,standardDimensions:product.standardDimensions||"",details:product.details||[],dimensions:product.dimensions||[],options:product.options||[]}),
        image_urls:[product.image,...(product.gallery||[])],published:true,sort_order:0
      };
      const {error}=await db.from("products").insert(payload);
      if(error && error.code!=="23505")throw new Error("Ürün eklenemedi ("+product.name+"): "+error.message+" ["+error.code+"]");
    }
    await load();
    setSuccess("Mevcut katalog ürünleri aktarılıp düzenlenebilir hale getirildi.");
  }catch(e){setError("Aktarım başarısız: "+(e instanceof Error?e.message:typeof e==="object"&&e!==null&&"message" in e?String(e.message):String(e))+". Hata sürerse Supabase products/categories yazma politikalarını kontrol et.");}
  finally{setImporting(false);}
 }
 return <section className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-3xl">Ürünlerim</h2><p className="mt-1 text-sm text-[#aaa8a5]">Supabase ürün kataloğu · {products.length} ürün</p></div><button type="button" disabled={importing||loading} onClick={()=>void importExistingCatalog()} className="rounded-md border border-[#c9a46c]/60 px-4 py-3 text-sm text-[#e5c08c] disabled:opacity-50">{importing?"Aktarılıyor…":"Mevcut katalogu içe aktar"}</button><button onClick={create} className="inline-flex items-center gap-2 rounded-md bg-[#c9a46c] px-5 py-3 text-sm font-semibold text-[#191817] hover:bg-[#e0bc85]"><Plus size={17}/> Yeni ürün</button></div>
  {error&&<p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
  {success&&<p role="status" className="rounded-md border border-emerald-500/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{success}</p>}
  <form onSubmit={addCategory} className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-[#1d1e20] p-4"><input aria-label="Yeni kategori adı" value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="Yeni kategori adı (ör. TV Üniteleri)" className={field+" min-w-[220px] flex-1"}/><button className="rounded-md border border-[#c9a46c]/60 px-4 py-2 text-sm text-[#e5c08c]">Kategori ekle</button></form>
  {showForm&&<form onSubmit={save} className="space-y-5 rounded-xl border border-[#c9a46c]/45 bg-[#242528] p-5 sm:p-7">
   <div className="flex items-center justify-between"><h3 className="font-serif text-2xl">{editing?"Ürünü düzenle":"Yeni ürün ekle"}</h3><button type="button" onClick={()=>setShowForm(false)} aria-label="Formu kapat"><X size={20}/></button></div>
   <div className="grid gap-4 sm:grid-cols-2"><label className={label}>Ürün adı<input required maxLength={160} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={field+" mt-2"}/></label><label className={label}>Bağlantı adı (boşsa otomatik)<input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="ahsap-tv-unitesi" className={field+" mt-2"}/></label></div>
   <label className={label}>Kategori<select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} className={field+" mt-2"}><option value="">Kategori seçilmedi</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
   <label className={label}>Açıklama<textarea rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={field+" mt-2"}/></label>
   <div className="grid gap-4 sm:grid-cols-2">
    <label className={label}>Malzeme / yüzey bilgisi<input value={form.material} onChange={e=>setForm({...form,material:e.target.value})} placeholder="Örn. Meşe kaplama" className={field+" mt-2"}/></label>
    <label className={label}>Standart ölçüler<input value={form.standardDimensions} onChange={e=>setForm({...form,standardDimensions:e.target.value})} placeholder="Ölçü kesinleşmediyse boş bırak" className={field+" mt-2"}/></label>
   </div>
   <div className="grid gap-4 sm:grid-cols-2">
    <label className={label}>Ölçü tablosu (satır başına Etiket: Değer)<textarea rows={3} value={form.dimensions} onChange={e=>setForm({...form,dimensions:e.target.value})} placeholder={"Genişlik: 120 cm\\nDerinlik: 45 cm"} className={field+" mt-2"}/></label>
    <label className={label}>Teknik özellikler (satır başına Etiket: Değer)<textarea rows={3} value={form.details} onChange={e=>setForm({...form,details:e.target.value})} placeholder={"Malzeme: Ahşap\\nKapak: 2 adet"} className={field+" mt-2"}/></label>
   </div>
   <label className={label}>Seçilebilir seçenekler (Etiket: Değer 1, Değer 2)<textarea rows={2} value={form.options} onChange={e=>setForm({...form,options:e.target.value})} placeholder={"Renk: Beyaz, Antrasit\\nModel: Demirli, Demirsiz"} className={field+" mt-2"}/></label>
   <label className={label}>Görsel URL'leri (her satıra bir adres)<textarea rows={3} value={form.image_urls} onChange={e=>setForm({...form,image_urls:e.target.value})} placeholder="https://... veya /images/urunler/ornek.webp" className={field+" mt-2"}/></label>
   <div className="rounded-lg border border-dashed border-[#c9a46c]/35 bg-[#1a1b1d] p-4">
    <label className={label}>Bilgisayardan fotoğraf yükle (JPG, PNG, WebP; en fazla 8 MB)
      <input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={e=>{void uploadImages(e.target.files);e.target.value="";}} className="mt-2 block w-full text-xs text-[#cfc4b3] file:mr-4 file:rounded-md file:border-0 file:bg-[#c9a46c] file:px-4 file:py-2 file:text-[#1b1916]"/>
    </label>
    {uploading&&<p className="mt-2 text-xs text-[#d4b685]">Fotoğraflar yükleniyor…</p>}
    {form.image_urls.trim()&&<div className="mt-3 flex flex-wrap gap-2">{form.image_urls.split(/\r?\n/).filter(Boolean).map((url,i)=><img key={i} src={url} alt={"Ürün görseli "+(i+1)} className="h-20 w-20 rounded-md border border-white/20 object-contain"/>)}</div>}
   </div>
   {imageList().length>0&&<div className="rounded-lg border border-white/10 bg-[#17181b] p-4">
     <p className="mb-3 text-sm font-semibold text-[#e1c59b]">Fotoğraf sırası (ilk görsel kapak fotoğrafıdır)</p>
     <div className="space-y-2">{imageList().map((url,index)=><div key={index} className="flex flex-wrap items-center gap-3 rounded-md border border-white/10 p-2">
       <img src={url} alt={index===0?"Kapak fotoğrafı":"Fotoğraf "+(index+1)} className="h-16 w-16 rounded-md bg-[#26201a] object-contain"/>
       <span className="min-w-0 flex-1 truncate text-xs text-[#c2b6a5]">{index===0?"Kapak · ":"Görsel "+(index+1)+" · "}{url}</span>
       <button type="button" disabled={index===0} onClick={()=>reorderImage(index,-1)} aria-label="Fotoğrafı öne taşı" className="rounded-md border border-white/15 p-2 disabled:opacity-30"><ArrowUp size={16}/></button>
       <button type="button" disabled={index===imageList().length-1} onClick={()=>reorderImage(index,1)} aria-label="Fotoğrafı arkaya taşı" className="rounded-md border border-white/15 p-2 disabled:opacity-30"><ArrowDown size={16}/></button>
       <button type="button" onClick={()=>setImageList(imageList().filter((_,i)=>i!==index))} aria-label="Fotoğrafı üründen kaldır" title="Yalnızca ürün kaydından kaldırılır" className="rounded-md border border-red-500/30 p-2 text-red-300"><X size={16}/></button>
     </div>)}</div>
   </div>}
   <div className="flex flex-wrap items-center gap-6"><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} className="accent-[#c9a46c]"/> Yayında (veritabanında görünür)</label><label className="text-sm">Sıra <input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:Number(e.target.value)})} className={field+" ml-2 w-24"}/></label></div>
   <p className="text-xs text-[#bcb7b0]">Yayınlanan ürünler sitedeki koleksiyona aktarılır. Galeri için ilk satıra ana fotoğrafı, alt satırlara aynı ürüne ait diğer fotoğraf adreslerini yaz. Kesinleşmeyen ölçüleri boş bırak.</p>
   <div className="flex flex-wrap gap-3">
     <button type="button" onClick={()=>setPreviewOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-[#c9a46c]/60 px-5 py-3 text-sm text-[#e5c08c]"><Eye size={16}/> Önizle</button>
     <button disabled={saving||uploading} className="rounded-md bg-[#c9a46c] px-6 py-3 text-sm font-semibold text-[#171717] disabled:opacity-50">{saving?"Kaydediliyor…":"Ürünü kaydet"}</button>
   </div>
  </form>}
  {previewOpen&&<div role="dialog" aria-modal="true" aria-label="Ürün önizlemesi" className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/85 p-4" onClick={()=>setPreviewOpen(false)}>
    <div className="relative w-full max-w-4xl rounded-xl border border-[#ac895b]/40 bg-[#171411] p-6 text-[#f0e6da] shadow-2xl md:p-9" onClick={event=>event.stopPropagation()}>
      <button type="button" onClick={()=>setPreviewOpen(false)} aria-label="Önizlemeyi kapat" className="absolute right-4 top-4 p-2"><X size={20}/></button>
      <p className="mb-6 text-xs uppercase tracking-widest text-[#c9a46c]">Nil Mobilya · Yayın öncesi önizleme</p>
      <div className="grid gap-8 md:grid-cols-2">
        {imageList()[0]?<img src={imageList()[0]} alt={form.title||"Ürün fotoğrafı"} className="max-h-[480px] w-full rounded-lg bg-[#24201b] object-contain"/>:<div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-white/20"><ImageOff size={28}/></div>}
        <div><p className="text-xs uppercase tracking-wider text-[#c9a46c]">{categories.find(c=>c.id===form.category_id)?.name||"Kategorisiz"}</p>
          <h3 className="mt-3 font-serif text-3xl">{form.title||"Ürün adı"}</h3>
          <p className="mt-3 text-sm text-[#d2bda5]">{form.material}</p>
          <h4 className="mt-7 font-semibold">Ölçüler</h4><p className="mt-2 whitespace-pre-line text-sm text-[#aaa]">{form.dimensions||form.standardDimensions||"Ölçüler teklif sırasında belirlenir."}</p>
          <h4 className="mt-6 font-semibold">Ürün Bilgisi</h4><p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#bbb]">{form.description||"Henüz açıklama eklenmedi."}</p>
          <p className="mt-7 text-xs text-[#d2bda5]">{form.published?"Yayına alınacak":"Taslak olarak kaydedilecek"}</p>
        </div>
      </div>
    </div>
  </div>}
  {loading?<p className="text-sm text-[#bbb]">Ürünler yükleniyor…</p>:products.length===0?<div className="rounded-lg border border-dashed border-white/20 p-9 text-center text-sm text-[#aaa8a5]">Henüz ürün yok. “Yeni ürün” ile ilk ürünü ekle.</div>:<div className="space-y-3">{products.map(p=><div key={p.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-[#1d1e20] p-4">{p.image_urls[0]?<img src={p.image_urls[0]} alt="" className="h-16 w-16 rounded-md object-cover"/>:<div className="h-16 w-16 rounded-md bg-[#343537]"/>}<div className="min-w-[180px] flex-1"><h3 className="font-medium">{p.title}</h3><p className="mt-1 text-xs text-[#aaa8a5]">{categories.find(c=>c.id===p.category_id)?.name||"Kategorisiz"} · {p.published?"Yayında":"Taslak"}</p></div><button type="button" onClick={()=>void togglePublish(p)} className={"rounded-md border px-3 py-2 text-sm "+(p.published?"border-amber-400/40 text-amber-200":"border-emerald-400/40 text-emerald-200")}>{p.published?"Taslağa al":"Yayınla"}</button><button onClick={()=>edit(p)} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm hover:border-[#c9a46c]"><Pencil size={15}/> Düzenle</button><button onClick={()=>void remove(p)} className="inline-flex items-center gap-2 rounded-md border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:border-red-400"><Trash2 size={15}/> Sil</button></div>)}</div>}
 </section>;
}
