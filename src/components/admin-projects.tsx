import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X, Images, ExternalLink } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";

type Project = {id:string;title:string;description:string;image_urls:string[];published:boolean;sort_order:number};
type Form = {title:string;description:string;place:string;year:string;category:string;photos:string;published:boolean;sort_order:number};
const blank:Form={title:"",description:"",place:"",year:"",category:"diger",photos:"",published:false,sort_order:0};
const PREFIX="NIL_PROJECT_V1:";
const inputClass="mt-2 w-full rounded-lg border border-white/20 bg-[#111215] p-3 text-sm text-white outline-none focus:border-[#c7a16d]";
// Instagram's official public post embeds work with post/reel links; the profile feed
// itself cannot be read automatically from a personal account without authorization.
const instagramPost=(value:string)=>/^https:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/.test(value);
const safePhoto=(value:string)=>{try{const u=new URL(value);return u.protocol==="https:"&&!instagramPost(value)}catch{return value.startsWith("/")}};

function decode(value:string){
  if(!value?.startsWith(PREFIX))return {description:value||"",place:"",year:"",category:"diger"};
  try{
    const v=JSON.parse(value.slice(PREFIX.length));
    return {description:String(v.description||""),place:String(v.place||""),year:String(v.year||""),category:String(v.category||"diger")};
  }catch{return {description:value,place:"",year:"",category:"diger"};}
}
export function AdminProjects(){
  const [projects,setProjects]=useState<Project[]>([]);
  const [editing,setEditing]=useState<string|null>(null);
  const [form,setForm]=useState<Form>(blank);
  const [open,setOpen]=useState(false);
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const refresh=async()=>{
    const db=getSupabaseClient();if(!db){setError("Supabase bağlantısı bulunamadı.");return;}
    const {data,error:e}=await db.from("projects").select("id,title,description,image_urls,published,sort_order").order("sort_order");
    if(e)setError(e.message);else setProjects((data??[]) as Project[]);
  };
  useEffect(()=>{void refresh()},[]);
  const edit=(project:Project)=>{
    const detail=decode(project.description);
    setEditing(project.id);setForm({title:project.title,photos:(project.image_urls||[]).join("\n"),published:project.published,sort_order:project.sort_order,...detail});
    setOpen(true);setError("");setMessage("");
  };
  const add=()=>{setEditing(null);setForm({...blank});setOpen(true);setError("");setMessage("");};
  async function upload(files:FileList|null){
    if(!files?.length)return;const db=getSupabaseClient();if(!db)return;
    setUploading(true);setError("");
    const urls:string[]=[];
    try{
      for(const file of Array.from(files)){
        if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>8*1024*1024)throw new Error("Fotoğraflar JPG/PNG/WebP ve en fazla 8 MB olmalı.");
        const name=crypto.randomUUID()+"."+(file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg");
        const {error:e}=await db.storage.from("nil-product-images").upload("projects/"+name,file,{contentType:file.type});
        if(e)throw e;
        urls.push(db.storage.from("nil-product-images").getPublicUrl("projects/"+name).data.publicUrl);
      }
      setForm(current=>({...current,photos:[current.photos.trim(),...urls].filter(Boolean).join("\n")}));
      setMessage("Fotoğraflar yüklendi. Kaydet'e basarak projeye ekle.");
    }catch(e){setError(e instanceof Error?e.message:"Fotoğraf yüklenemedi.");}
    finally{setUploading(false);}
  }
  async function save(event:FormEvent){
    event.preventDefault();
    const db=getSupabaseClient();if(!db)return;
    setSaving(true);setError("");setMessage("");
    const photos=form.photos.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    if(!photos.length){setSaving(false);setError("En az bir fotoğraf veya herkese açık Instagram gönderi bağlantısı gerekli.");return;}
    if(photos.some(url=>!instagramPost(url)&&!safePhoto(url))){setSaving(false);setError("Yalnızca HTTPS fotoğraf URL’leri veya instagram.com/p/ ve /reel/ bağlantıları kullanılabilir.");return;}
    const payload={
      title:form.title.trim(),description:PREFIX+JSON.stringify({description:form.description.trim(),place:form.place.trim(),year:form.year.trim(),category:form.category}),
      image_urls:photos,published:form.published,sort_order:form.sort_order,
    };
    const result=editing?await db.from("projects").update(payload).eq("id",editing):await db.from("projects").insert(payload);
    setSaving(false);
    if(result.error){setError(result.error.message);return;}
    setOpen(false);setMessage("Proje kaydedildi.");await refresh();
  }
  async function remove(project:Project){
    if(!window.confirm(project.title+" projesini silmek istediğine emin misin?"))return;
    const db=getSupabaseClient();if(!db)return;
    const {error:e}=await db.from("projects").delete().eq("id",project.id);
    if(e)setError(e.message);else{setMessage("Proje silindi.");await refresh();}
  }
  async function toggle(project:Project){
    const db=getSupabaseClient();if(!db)return;
    const {error:e}=await db.from("projects").update({published:!project.published}).eq("id",project.id);
    if(e)setError(e.message);else{setProjects(p=>p.map(x=>x.id===project.id?{...x,published:!x.published}:x));setMessage("Yayın durumu güncellendi.");}
  }
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-serif text-3xl">Sergimiz · Proje Yönetimi</h2><p className="mt-2 text-sm text-[#aaa]">Fotoğraf yükleyebilir veya herkese açık Instagram gönderilerini indirmeden sergileyebilirsin.</p></div><div className="flex gap-3"><a href="/sergimiz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm">Sergiyi aç <ExternalLink size={15}/></a><button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-md bg-[#c9a46c] px-5 py-3 text-sm font-semibold text-[#191817]"><Plus size={17}/> Yeni proje</button></div></div>
    {error&&<p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
    {message&&<p role="status" className="rounded-md border border-emerald-500/30 p-3 text-sm text-emerald-200">{message}</p>}
    {open&&<form onSubmit={save} className="space-y-4 rounded-xl border border-[#c9a46c]/40 bg-[#242528] p-6">
      <div className="flex items-center justify-between"><h3 className="font-serif text-2xl">{editing?"Projeyi düzenle":"Yeni proje"}</h3><button type="button" onClick={()=>setOpen(false)} aria-label="Kapat"><X size={20}/></button></div>
      <label className="block text-sm">Proje başlığı<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={inputClass}/></label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">Yer / şehir<input value={form.place} onChange={e=>setForm({...form,place:e.target.value})} className={inputClass}/></label>
        <label className="text-sm">Yıl<input value={form.year} maxLength={4} onChange={e=>setForm({...form,year:e.target.value})} className={inputClass}/></label>
        <label className="text-sm">Kategori<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputClass}><option value="tv">TV Üniteleri</option><option value="banko">Bankolar</option><option value="dolap">Dolap Sistemleri</option><option value="yatak">Yatak Odası</option><option value="diger">Diğer</option></select></label>
      </div>
      <label className="block text-sm">Proje açıklaması<textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={inputClass}/></label>
      <label className="block text-sm">Fotoğraf veya Instagram gönderi bağlantıları (her satıra bir adres)<textarea rows={4} value={form.photos} onChange={e=>setForm({...form,photos:e.target.value})} className={inputClass} placeholder={"https://www.instagram.com/p/POST_KODU/\nhttps://www.instagram.com/reel/REEL_KODU/"}/><span className="mt-2 block text-xs leading-6 text-[#b6a18b]">Instagram’da gönderiyi aç → Paylaş → Bağlantıyı kopyala. Profil adresi değil, gönderi veya Reel bağlantısı ekle. Fotoğrafı indirmen gerekmez. Otomatik senkronizasyon değildir.</span></label>
      <label className="block text-sm">Bilgisayardan fotoğraf ekle<input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={e=>{void upload(e.target.files);e.target.value="";}} className="mt-2 block w-full text-xs"/></label>
      <div className="flex flex-wrap gap-2">{form.photos.split(/\r?\n/).filter(Boolean).map((url,i)=>instagramPost(url.trim())?<div key={i} className="flex h-20 w-32 items-center justify-center rounded-md border border-[#6c5037] bg-[#211a17] p-2 text-center text-xs text-[#d0ad80]">Instagram gönderisi</div>:<img key={i} src={url.trim()} alt={"Fotoğraf "+(i+1)} className="h-20 w-20 rounded-md border border-white/15 object-cover"/>)}</div>
      <div className="flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Yayında</label><label className="text-sm">Sıra<input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:Number(e.target.value)})} className={inputClass+" ml-2 w-24"}/></label></div>
      <button disabled={saving||uploading} className="rounded-md bg-[#c9a46c] px-6 py-3 text-sm font-semibold text-[#191817] disabled:opacity-50">{saving?"Kaydediliyor…":"Projeyi kaydet"}</button>
    </form>}
    {projects.length===0?<div className="rounded-xl border border-dashed border-white/20 p-10 text-center text-sm text-[#aaa]"><Images className="mx-auto mb-3" size={28}/>Henüz proje eklenmedi. Gerçek üretim fotoğraflarınla başlayabilirsin.</div>:<div className="grid gap-4 md:grid-cols-2">{projects.map(p=><article key={p.id} className="flex gap-4 rounded-lg border border-white/10 bg-[#1d1e20] p-4">{p.image_urls[0]&&(instagramPost(p.image_urls[0])?<div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md border border-[#5d4634] bg-[#211a17] text-center text-sm text-[#d3b28a]">Instagram</div>:<img src={p.image_urls[0]} alt="" className="h-28 w-28 rounded-md object-cover"/>)}<div className="min-w-0 flex-1"><h3 className="font-semibold">{p.title}</h3><p className="mt-2 text-xs text-[#aaa]">{p.published?"Yayında":"Taslak"} · {p.image_urls.length} fotoğraf</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={()=>edit(p)} className="rounded-md border border-white/20 px-3 py-2 text-xs"><Pencil size={14} className="mr-1 inline"/> Düzenle</button><button type="button" onClick={()=>void toggle(p)} className="rounded-md border border-white/20 px-3 py-2 text-xs">{p.published?"Taslağa al":"Yayınla"}</button><button type="button" onClick={()=>void remove(p)} className="rounded-md border border-red-500/30 px-3 py-2 text-xs text-red-300"><Trash2 size={14} className="mr-1 inline"/> Sil</button></div></div></article>)}</div>}
  </section>;
}
