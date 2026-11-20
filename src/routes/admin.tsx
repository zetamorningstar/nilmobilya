import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BarChart3, Database, Images, LockKeyhole, LogOut, Package, LayoutDashboard, Settings2, ShieldCheck, ChevronRight, Menu, X, CircleHelp, Activity, ExternalLink } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { AdminProducts } from "@/components/admin-products";
import { AdminInsights } from "@/components/admin-insights";
import { AdminTraffic } from "@/components/admin-traffic";
import "@/styles/admin-polish.css";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const modules = [
  { title: "Ürünler", description: "Ürün ekleme, düzenleme ve yayınlama", icon: Package },
  { title: "Sergimiz", description: "Projeler ve fotoğraflar", icon: Images },
  { title: "Analitik", description: "Ziyaret ve WhatsApp tıklama istatistikleri", icon: BarChart3 },
  { title: "Veritabanı", description: "Supabase içerik yönetimi", icon: Database },
];

function AdminPage() {
  const [status, setStatus] = useState<"loading" | "setup" | "login" | "admin">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<"overview" | "products" | "analytics">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<{total:number;published:number;categories:number}|null>(null);
  useEffect(()=>{ if(status!=="admin")return; const db=getSupabaseClient();if(!db)return;let active=true;Promise.all([db.from("products").select("id,published"),db.from("categories").select("id")]).then(([p,c])=>{if(active&&!p.error&&!c.error)setCounts({total:p.data?.length??0,published:p.data?.filter(x=>x.published).length??0,categories:c.data?.length??0})});return()=>{active=false}},[status,section]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) { setStatus("setup"); return; }
    let active = true;
    async function verify() {
      const { data: userResult, error: userError } = await supabase!.auth.getUser();
      if (!active) return;
      if (userError || !userResult.user) { setStatus("login"); return; }
      const { data, error: roleError } = await supabase!.rpc("is_admin");
      if (!active) return;
      if (roleError || data !== true) {
        await supabase!.auth.signOut();
        if (active) { setError("Bu hesap için yönetici yetkisi doğrulanamadı. SQL yetkilendirmesini kontrol et."); setStatus("login"); }
        return;
      }
      setAccount(userResult.user.email ?? "");
      setStatus("admin");
    }
    void verify();
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && active) setStatus("login");
    });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) { setError("Giriş başarısız. E-posta, şifre ve e-posta onayını kontrol et."); setBusy(false); return; }
    const { data, error: roleError } = await supabase.rpc("is_admin");
    if (roleError || data !== true) {
      await supabase.auth.signOut();
      setError("Bu hesapta yönetici yetkisi bulunamadı veya SQL fonksiyonu henüz kurulmadı.");
      setBusy(false);
      return;
    }
    setAccount(email);
    setPassword("");
    setStatus("admin");
    setBusy(false);
  }

  async function logout() {
    await getSupabaseClient()?.auth.signOut();
    setStatus("login");
    setAccount("");
  }


  const navigation = [
    {id:"overview",label:"Genel Bakış",icon:LayoutDashboard,enabled:true},
    {id:"products",label:"Ürün Yönetimi",icon:Package,enabled:true},
    {id:"showcase",label:"Sergimiz",icon:Images,enabled:false},
    {id:"analytics",label:"Analitik",icon:BarChart3,enabled:true},
    {id:"database",label:"Veritabanı",icon:Database,enabled:false},
  ] as const;
  const selectSection=(id:"overview"|"products"|"analytics")=>{setSection(id);setSidebarOpen(false)};
  const panel = "admin-panel rounded-xl border border-[#282a31] bg-[#17181d]";
  const smallLabel = "text-[11px] font-semibold uppercase tracking-[.15em] text-[#92949e]";
  return <main className="min-h-screen bg-[#090a0d] text-[#f2f2f4]">
    {status==="admin" ? <div className="flex min-h-screen">
      {sidebarOpen&&<button aria-label="Menüyü kapat" className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col border-r border-[#303138] bg-[#101115] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen?"translate-x-0":"-translate-x-full"}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-[#303138] px-5">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#b89964]/45 bg-[#b89964]/10 text-[#e5bd7b]"><span className="font-serif text-2xl">N</span></div><div><p className="text-sm font-bold tracking-[.07em]">NİL MOBİLYA</p><p className="mt-1 text-[10px] uppercase tracking-[.18em] text-[#b89964]">Control Center</p></div></div>
          <button onClick={()=>setSidebarOpen(false)} className="lg:hidden"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#72747e]">Çalışma Alanı</p>
          <nav aria-label="Yönetim menüsü" className="space-y-1">
            {navigation.map(item=><button key={item.id} disabled={!item.enabled} onClick={()=>item.enabled&&selectSection(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium transition ${item.enabled?(section===item.id?"bg-[#b89964]/15 text-[#f0c98c] ring-1 ring-[#b89964]/25":"text-[#aeb0ba] hover:bg-[#292b33] hover:text-white"):"cursor-not-allowed text-[#686a74]"}`}>
              <item.icon size={18}/><span className="flex-1">{item.label}</span>{!item.enabled?<span className="text-[9px] uppercase tracking-wider">Yakında</span>:section===item.id?<ChevronRight size={15}/>:null}
            </button>)}
          </nav>
          <div className="mt-8 border-t border-[#303138] pt-6"><p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#72747e]">Sistem</p>
            <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-[#9b9da7]"><Settings2 size={18}/> Ayarlar <span className="ml-auto text-[10px]">Yakında</span></div>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-[#aeb0ba] hover:bg-[#292b33]"><Database size={18}/> Supabase <ExternalLink size={13} className="ml-auto"/></a>
          </div>
        </div>
        <div className="border-t border-[#303138] p-4"><div className="flex items-center gap-3 rounded-lg bg-[#1a1b21] p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b89964]/20 text-sm font-bold text-[#e3bd81]">{account.slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Yönetici</p><p className="truncate text-[11px] text-[#999ba6]">{account}</p></div><button onClick={logout} aria-label="Çıkış yap" title="Çıkış yap" className="text-[#aaaeb8] hover:text-white"><LogOut size={17}/></button></div></div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#303138] bg-[#111216]/95 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3"><button onClick={()=>setSidebarOpen(true)} aria-label="Menüyü aç" className="mr-1 lg:hidden"><Menu size={22}/></button><span className="text-xs text-[#777984]">Yönetim</span><ChevronRight size={14} className="text-[#666874]"/><span className="text-sm font-semibold">{section==="products"?"Ürün Yönetimi":section==="analytics"?"Analitik":"Genel Bakış"}</span></div>
          <div className="flex items-center gap-4"><span className="hidden items-center gap-2 rounded-full border border-[#3c5144] bg-[#1c3026] px-3 py-1.5 text-[11px] font-medium text-[#92d9aa] sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-[#71d99b]"/> Yönetici doğrulandı</span><Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-[#383a43] px-3 py-2 text-xs text-[#c4c5cc] hover:bg-[#292b32]"><ArrowLeft size={15}/> <span className="hidden sm:inline">Siteye dön</span></Link></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          {section==="analytics"?<AdminTraffic/>:section==="products"?<><div className="mb-7"><p className={smallLabel}>Katalog / İçerik Yönetimi</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Ürün Yönetimi</h1><p className="mt-2 text-sm text-[#999ba6]">Kategorileri, taslakları ve ürün bilgilerini tek yerden yönet.</p></div><AdminProducts/></>:
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className={smallLabel}>Yönetim Merkezi / Dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Genel Bakış</h1><p className="mt-3 text-sm text-[#999ba6]">Nil Mobilya içerik yönetimine hoş geldin.</p></div><button onClick={()=>selectSection("products")} className="flex items-center gap-2 rounded-lg bg-[#c5a16d] px-5 py-3 text-sm font-semibold text-[#1b1916] hover:bg-[#e0bb85]"><PlusIcon/> Ürün Yönetimine Git</button></div>
            <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {label:"Toplam Ürün",value:counts?.total,icon:Package,sub:"Katalogdaki tüm ürünler"},
                {label:"Yayındaki Ürün",value:counts?.published,icon:ShieldCheck,sub:"Yayın durumu açık"},
                {label:"Kategoriler",value:counts?.categories,icon:Database,sub:"Tanımlı kategoriler"},
              ].map(stat=><div key={stat.label} className={panel+" p-5"}><div className="mb-5 flex items-center justify-between"><span className={smallLabel}>{stat.label}</span><stat.icon size={19} className="text-[#c5a16d]"/></div><p className="text-3xl font-bold tabular-nums">{stat.value??"—"}</p><p className="mt-3 text-xs text-[#858894]">{stat.sub}</p></div>)}
              <div className={panel+" p-5"}><div className="mb-5 flex items-center justify-between"><span className={smallLabel}>Ziyaretçi Analitiği</span><Activity size={19} className="text-[#c5a16d]"/></div><p className="text-lg font-semibold text-[#a6a8b1]">Henüz bağlı değil</p><p className="mt-3 text-xs text-[#858894]">GA4 / Clarity entegrasyonu bekleniyor</p></div>
            </div>
            <AdminInsights counts={counts}/>
            <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
              <section className={panel+" overflow-hidden"}><div className="flex items-center justify-between border-b border-[#34363d] px-6 py-5"><div><h2 className="text-base font-semibold">Hızlı Erişim</h2><p className="mt-1 text-xs text-[#8e909a]">Yönetim araçları</p></div><LayoutDashboard size={18} className="text-[#9e825c]"/></div><div className="grid gap-3 p-5 sm:grid-cols-2">{modules.map(({title,description,icon:Icon})=><button key={title} disabled={title!=="Ürünler"&&title!=="Analitik"} onClick={()=>title==="Ürünler"?selectSection("products"):title==="Analitik"?selectSection("analytics"):undefined} className={`rounded-xl border border-[#373942] bg-[#1c1d23] p-5 text-left transition ${(title==="Ürünler"||title==="Analitik")?"hover:border-[#c5a16d]/70 hover:bg-[#2c2b2b]":"cursor-not-allowed opacity-60"}`}><div className="mb-5 flex items-center justify-between"><Icon size={21} className="text-[#c5a16d]"/><span className="text-[10px] uppercase tracking-wider text-[#999ba6]">{title==="Ürünler"||title==="Analitik"?"Aktif":"Yakında"}</span></div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-[#9c9ea8]">{description}</p></button>)}</div></section>
              <div className="space-y-5"><section className={panel+" p-6"}><div className="mb-5 flex items-center gap-3"><ShieldCheck className="text-[#8ad0a4]" size={21}/><h2 className="text-base font-semibold">Sistem Durumu</h2></div><div className="space-y-4 text-sm"><div className="flex justify-between gap-3"><span className="text-[#a0a2ad]">Yönetici oturumu</span><span className="text-[#8ad0a4]">Aktif</span></div><div className="flex justify-between gap-3"><span className="text-[#a0a2ad]">Ürün veritabanı</span><span className="text-[#d8bd8d]">{counts?"Bağlı":"Kontrol ediliyor"}</span></div><div className="flex justify-between gap-3"><span className="text-[#a0a2ad]">Trafik analizi</span><span className="text-[#8c8e99]">Bekliyor</span></div></div></section><section className={panel+" p-6"}><div className="mb-3 flex items-center gap-3"><CircleHelp size={20} className="text-[#c5a16d]"/><h2 className="text-base font-semibold">Sonraki Adım</h2></div><p className="text-sm leading-6 text-[#a0a2ad]">Ürünleri yönetebilir, kategoriler oluşturabilir ve yayın durumunu değiştirebilirsin. Fotoğraf yükleme ve analitik bağlantıları sonraki geliştirmede eklenecek.</p></section></div>
            </div>
          </>}
        </div>
      </div>
    </div> : <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-12"><div className="mb-10"><p className="text-xs uppercase tracking-[.24em] text-[#c5a16d]">NİL MOBİLYA · ÖZEL ALAN</p><h1 className="mt-3 font-serif text-5xl">Yönetim Paneli</h1></div>
      {status==="loading"&&<p className="text-[#aaa]">Oturum kontrol ediliyor…</p>}
      {status==="setup"&&<div className="max-w-lg rounded-xl border border-[#c5a16d]/40 bg-[#202127] p-8"><LockKeyhole className="text-[#c5a16d]"/><h2 className="mt-4 text-2xl">Bağlantı bekleniyor</h2><p className="mt-4 text-sm leading-7 text-[#aaa]">Supabase bağlantısını .env.local dosyasında tanımla.</p></div>}
      {status==="login"&&<form onSubmit={login} className="max-w-md rounded-xl border border-[#c5a16d]/40 bg-[#202127] p-8"><LockKeyhole className="text-[#c5a16d]"/><h2 className="mt-4 font-serif text-3xl">Yönetici Girişi</h2><p className="mt-2 text-sm text-[#aaa]">Yalnızca yetkili hesaplar giriş yapabilir.</p><label className="mt-6 block text-sm">E-posta<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-md border border-white/20 bg-[#111216] p-3"/></label><label className="mt-5 block text-sm">Şifre<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-md border border-white/20 bg-[#111216] p-3"/></label>{error&&<p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-md bg-[#c5a16d] p-3 font-semibold text-[#171717]">{busy?"Kontrol ediliyor…":"Giriş Yap"}</button></form>}
      <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm text-[#aaa]"><ArrowLeft size={16}/> Siteye dön</Link>
    </div>}
  </main>;
}
function PlusIcon(){return <span aria-hidden="true" className="text-lg leading-none">+</span>}
