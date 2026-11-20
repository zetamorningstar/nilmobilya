import { createFileRoute } from "@tanstack/react-router";
import { Database, BarChart3, Images, LockKeyhole, Package, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({ component: AdminSetup });

const modules = [
  { title: "Ürünler", description: "Ürün ekleme, düzenleme ve yayına alma", icon: Package },
  { title: "Sergimiz", description: "Tamamlanan projeleri ve fotoğrafları yönetme", icon: Images },
  { title: "Analitik", description: "Ziyaretler, kategori ilgisi ve WhatsApp tıklamaları", icon: BarChart3 },
  { title: "Veritabanı", description: "Supabase bağlantısı ve güvenli içerik yönetimi", icon: Database },
];

function AdminSetup() {
  return (
    <main className="min-h-screen bg-[#111214] px-5 py-12 text-[#f3eee8] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[.28em] text-[#c9a46c]">Nil Mobilya</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">Yönetim Paneli</h1></div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm hover:border-[#c9a46c]"><ArrowLeft size={16}/> Siteye dön</Link>
        </div>
        <div className="mb-8 rounded-xl border border-[#c9a46c]/40 bg-[#242528] p-6 sm:p-8">
          <div className="flex items-center gap-3 text-[#d7b47e]"><LockKeyhole size={22}/><span className="text-xs font-semibold uppercase tracking-[.18em]">Kurulum aşaması</span></div>
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl">Güvenli yönetici girişi hazırlanıyor.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#c6c2bc]">Bu sayfa yönetim panelinin başlangıç ekranıdır. Henüz yönetici girişi, ürün veritabanı veya gerçek istatistik bağlantısı aktif değildir. Güvenli kimlik doğrulama kurulmadan özel yönetim işlevleri açılmayacaktır.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map(({title,description,icon:Icon}) => <section key={title} className="rounded-xl border border-white/10 bg-[#1d1e20] p-6">
            <Icon className="mb-5 text-[#c9a46c]" size={27}/>
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#aaa8a5]">{description}</p>
            <p className="mt-5 text-xs uppercase tracking-widest text-[#b7a083]">Bağlantı bekleniyor</p>
          </section>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-[#c9a46c]/70 px-4 py-3 text-[#e6c390] hover:bg-[#c9a46c]/10">Supabase hesabını oluştur <ExternalLink size={15}/></a>
          <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-3 hover:bg-white/5">Google Analytics <ExternalLink size={15}/></a>
        </div>
      </div>
    </main>
  );
}
