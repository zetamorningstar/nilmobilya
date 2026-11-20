import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BarChart3, Database, Images, LockKeyhole, LogOut, Package } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";

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

  return <main className="min-h-screen bg-[#111214] px-5 py-12 text-[#f3eee8] sm:px-8">
    <div className="mx-auto max-w-5xl">
      <header className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[.28em] text-[#c9a46c]">Nil Mobilya · Özel Alan</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">Yönetim Paneli</h1></div>
        <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm hover:border-[#c9a46c]"><ArrowLeft size={16}/> Siteye dön</Link>
      </header>
      {status === "loading" && <p className="text-[#c6c2bc]">Oturum kontrol ediliyor…</p>}
      {status === "setup" && <section className="max-w-xl rounded-xl border border-[#c9a46c]/50 bg-[#242528] p-8">
        <LockKeyhole className="text-[#c9a46c]"/><h2 className="mt-4 font-serif text-3xl">Bağlantı bekleniyor</h2>
        <p className="mt-4 text-sm leading-7 text-[#c6c2bc]">Supabase bağlantısı için yerel .env.local dosyasına VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ekle. Ardından geliştirme sunucusunu yeniden başlat.</p>
      </section>}
      {status === "login" && <form onSubmit={login} className="max-w-md rounded-xl border border-[#c9a46c]/50 bg-[#242528] p-7 sm:p-9">
        <LockKeyhole className="text-[#c9a46c]"/><h2 className="mt-4 font-serif text-3xl">Yönetici Girişi</h2>
        <p className="mt-2 text-sm text-[#bbb7b1]">Yalnızca yetkili Nil Mobilya hesapları giriş yapabilir.</p>
        <label className="mt-7 block text-sm text-[#d7cfc4]">E-posta
          <input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-md border border-white/20 bg-[#151618] px-4 py-3 text-white outline-none focus:border-[#c9a46c]"/>
        </label>
        <label className="mt-5 block text-sm text-[#d7cfc4]">Şifre
          <input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-md border border-white/20 bg-[#151618] px-4 py-3 text-white outline-none focus:border-[#c9a46c]"/>
        </label>
        {error && <p role="alert" className="mt-4 text-sm text-[#f1a9a0]">{error}</p>}
        <button type="submit" disabled={busy} className="mt-7 w-full rounded-md bg-[#c9a46c] px-5 py-3 font-semibold text-[#191817] transition hover:bg-[#e0bc85] disabled:opacity-60">{busy?"Kontrol ediliyor…":"Giriş Yap"}</button>
      </form>}
      {status === "admin" && <>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#c9a46c]/35 bg-[#242528] p-5">
          <div><p className="text-xs uppercase tracking-widest text-[#c9a46c]">Yetkili yönetici</p><p className="mt-2 text-sm text-[#d7d0c7]">{account}</p></div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm hover:border-[#c9a46c]"><LogOut size={16}/> Çıkış Yap</button>
        </div>
        <p className="mb-5 text-sm text-[#bbb7b1]">Giriş sistemi aktif. İçerik düzenleme ve analitik bağlantıları sonraki aşamada eklenecek.</p>
        <div className="grid gap-4 sm:grid-cols-2">{modules.map(({title,description,icon:Icon})=><section key={title} className="rounded-xl border border-white/10 bg-[#1d1e20] p-6"><Icon className="mb-5 text-[#c9a46c]" size={27}/><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-[#aaa8a5]">{description}</p><p className="mt-5 text-xs uppercase tracking-widest text-[#b7a083]">Yakında</p></section>)}</div>
      </>}
    </div>
  </main>;
}
