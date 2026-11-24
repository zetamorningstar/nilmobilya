import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, BarChart3, CheckCircle2, ChevronRight, ExternalLink, FileText, Images, LayoutGrid, Package, Plus, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { AdminCloudflareTraffic } from "@/components/admin-cloudflare-traffic";

type Counts = { total: number; published: number; categories: number } | null;
type Product = { id: string; title: string; slug: string; published: boolean; image_urls: string[]; updated_at: string; category_id: string | null };
type Category = { id: string; name: string };
type Daily = { day: string; views: number; whatsapp: number };
type Analytics = { daily: Daily[]; top_pages: { path: string; views: number }[] };
type Section = "overview" | "products" | "showcase" | "analytics";
const formatNumber = (n: number) => n.toLocaleString("tr-TR");
export function AdminDashboard({ counts, navigate }: { counts: Counts; navigate: (section: Section) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsError, setAnalyticsError] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const db = getSupabaseClient();
    if (!db) return;
    let active = true;
    Promise.all([
      db.from("products").select("id,title,slug,published,image_urls,updated_at,category_id").order("updated_at", { ascending: false }).limit(15),
      db.from("categories").select("id,name"),
      db.rpc("admin_site_analytics", { p_days: 14 })
    ]).then(([p, c, a]) => {
      if (!active) return;
      if (!p.error) setProducts((p.data ?? []) as Product[]);
      if (!c.error) setCategories((c.data ?? []) as Category[]);
      if (!a.error && a.data) setAnalytics(a.data as Analytics);
      else setAnalyticsError(true);
    }).catch(() => { if (active) setAnalyticsError(true); });
    return () => { active = false; };
  }, []);
  const visibleProducts = useMemo(() => products.filter(p => p.title.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))).slice(0, 5), [products, search]);
  const daily = analytics?.daily ?? [];
  const totalViews = daily.reduce((sum, d) => sum + d.views, 0);
  const whatsappClicks = daily.reduce((sum, d) => sum + d.whatsapp, 0);
  const top = Math.max(1, ...daily.map(d => Math.max(d.views, d.whatsapp)));
  const draft = counts ? Math.max(0, counts.total - counts.published) : null;
  const stats = [
    { label: "Toplam Ürün", value: counts?.total, icon: Package, tone: "bronze" },
    { label: "Yayındaki Ürün", value: counts?.published, icon: CheckCircle2, tone: "olive" },
    { label: "Taslak", value: draft, icon: FileText, tone: "slate" },
    { label: "Kategori", value: counts?.categories, icon: LayoutGrid, tone: "copper" }
  ];
  return <div className="nil-admin-home space-y-5">
    <section className="nil-admin-hero">
      <div className="relative z-10 max-w-2xl">
        <div className="nil-admin-eyebrow"><span className="nil-admin-line" /> NİL MOBİLYA / YÖNETİM</div>
        <h1>Nil Mobilya<br/><em>Kontrol Merkezi</em></h1>
        <p>Ürünlerinizi, projelerinizi ve performansınızı tek bir yerden yönetin.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => navigate("products")} className="nil-admin-main-action"><Plus size={16}/> Ürünleri yönet <ArrowRight size={15}/></button>
          <button type="button" onClick={() => navigate("showcase")} className="nil-admin-outline-action">Sergimiz <ChevronRight size={15}/></button>
        </div>
      </div>
      <div aria-hidden="true" className="nil-admin-hero-art"><i/><i/><i/><i/><i/></div>
    </section>

    <AdminCloudflareTraffic compact />

    <section aria-label="Katalog istatistikleri" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map(stat => <div key={stat.label} className={`nil-admin-stat nil-admin-stat--${stat.tone}`}>
        <div className="nil-admin-stat-icon"><stat.icon size={20} strokeWidth={1.6}/></div>
        <div><p>{stat.label}</p><strong>{stat.value == null ? "—" : formatNumber(stat.value)}</strong></div>
      </div>)}
    </section>

    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.55fr)_minmax(290px,.85fr)_minmax(260px,.72fr)] xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]">
      <section className="nil-admin-surface">
        <div className="nil-admin-surface-head"><div><div className="nil-admin-section-kicker"><TrendingUp size={16}/> PERFORMANS</div><h2>Site Etkileşimi</h2><p>Son 14 gün · izin verilmiş olay sayıları</p></div><button type="button" onClick={() => navigate("analytics")} className="nil-admin-text-link">Detaylar <ArrowRight size={14}/></button></div>
        {analytics ? <div className="nil-admin-graph">
          <div className="nil-admin-graph-grid" aria-hidden="true"/>
          <div className="nil-admin-graph-bars">
            {daily.map((d, i) => <div className="nil-admin-graph-day" key={d.day} title={d.day + ": " + d.views + " sayfa, " + d.whatsapp + " WhatsApp tıklaması"}>
              <div className="nil-admin-graph-pair"><span style={{ height: Math.max(2, d.views / top * 100) + "%" }} className="nil-admin-view-bar"/><span style={{ height: Math.max(2, d.whatsapp / top * 100) + "%" }} className="nil-admin-wa-bar"/></div>
              <small>{i % 3 === 0 || i === daily.length - 1 ? d.day.slice(5) : ""}</small>
            </div>)}
          </div>
        </div> : <div className="nil-admin-chart-empty"><BarChart3 size={28}/><span>{analyticsError ? "Analitik verisine erişilemiyor." : "Gerçek veriler yükleniyor…"}</span></div>}
        <div className="nil-admin-chart-legend"><span><i className="nil-admin-dot-gold"/> Sayfa görüntülemesi</span><span><i className="nil-admin-dot-blue"/> WhatsApp tıklaması</span></div>
      </section>

      <section className="nil-admin-surface nil-admin-traffic-card">
        <div className="nil-admin-surface-head"><div><div className="nil-admin-section-kicker"><Activity size={16}/> ETKİLEŞİM ÖZETİ</div><h2>Ziyaretçi Özeti</h2><p>Son 14 gün</p></div></div>
        <p className="nil-admin-big-number">{analytics ? formatNumber(totalViews) : "—"}</p>
        <p className="nil-admin-number-subtitle">Sayfa görüntüleme olayı</p>
        <div className="nil-admin-traffic-rows">
          <div><span>WhatsApp tıklamaları</span><strong>{analytics ? formatNumber(whatsappClicks) : "—"}</strong></div>
          <div><span>Tıklama / görüntüleme</span><strong>{analytics && totalViews ? (whatsappClicks / totalViews * 100).toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + "%" : "—"}</strong></div>
        </div>
        <p className="nil-admin-traffic-note">Tekil ziyaretçi veya kesinleşmiş sipariş değildir.</p>
      </section>

      <section className="nil-admin-surface nil-admin-activity">
        <div className="nil-admin-surface-head"><div><div className="nil-admin-section-kicker"><Package size={16}/> KATALOG</div><h2>Son Güncellenenler</h2><p>Ürün kayıtlarına göre</p></div></div>
        <div className="nil-admin-timeline">{products.slice(0, 4).map(p => <div key={p.id} className="nil-admin-timeline-item"><span className="nil-admin-timeline-mark"/><div><strong>{p.title}</strong><span>{p.published ? "Yayında" : "Taslak"} · {p.updated_at ? new Date(p.updated_at).toLocaleDateString("tr-TR") : "Tarih yok"}</span></div></div>)}</div>
        {!products.length && <p className="nil-admin-empty-mini">Ürün kayıtları yükleniyor veya bulunamadı.</p>}
      </section>
    </div>

    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(260px,.72fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="nil-admin-surface">
        <div className="nil-admin-surface-head"><div><div className="nil-admin-section-kicker"><Plus size={16}/> İŞLEMLER</div><h2>Hızlı Erişim</h2></div></div>
        <div className="nil-admin-shortcuts">
          {[
            { label: "Ürün Yönetimi", icon: Package, section: "products" as Section },
            { label: "Sergimize Proje Ekle", icon: Images, section: "showcase" as Section },
            { label: "Analitiği İncele", icon: BarChart3, section: "analytics" as Section }
          ].map(shortcut => <button key={shortcut.label} type="button" onClick={() => navigate(shortcut.section)} className="nil-admin-shortcut"><shortcut.icon size={22} strokeWidth={1.45}/><span>{shortcut.label}</span><ArrowRight size={16}/></button>)}
          <a className="nil-admin-shortcut" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={22} strokeWidth={1.45}/><span>Siteyi Görüntüle</span><ArrowRight size={16}/></a>
        </div>
      </section>

      <section className="nil-admin-surface">
        <div className="nil-admin-surface-head"><div><div className="nil-admin-section-kicker"><Package size={16}/> KATALOG</div><h2>Ürün Yönetimi</h2></div><button type="button" onClick={() => navigate("products")} className="nil-admin-text-link">Tüm ürünler <ArrowRight size={14}/></button></div>
        <label className="nil-admin-search"><Search size={16}/><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürünler arasında ara..." aria-label="Ürünler arasında ara"/></label>
        <div className="nil-admin-products-list">
          {visibleProducts.map(p => <div key={p.id} className="nil-admin-product-row"><div className="nil-admin-product-thumb">{p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" loading="lazy"/> : <Package size={20}/>}</div><div className="nil-admin-product-name"><strong>{p.title}</strong><span>{categories.find(c => c.id === p.category_id)?.name || "Kategorisiz"}</span></div><span className={p.published ? "nil-admin-status is-live" : "nil-admin-status is-draft"}>{p.published ? "Yayında" : "Taslak"}</span></div>)}
          {!visibleProducts.length && <p className="nil-admin-empty-mini">{search ? "Aramayla eşleşen ürün yok." : "Ürünler yükleniyor veya bulunamadı."}</p>}
        </div>
      </section>

      <section className="nil-admin-surface nil-admin-notes">
        <div className="nil-admin-surface-head"><div><div className="nil-admin-section-kicker"><ShieldCheck size={16}/> YÖNETİM</div><h2>Kontrol Notları</h2></div></div>
        <div className="nil-admin-note-inner"><p>Yayına alınan ürünler müşteriler tarafından görüntülenebilir. Değişikliklerden sonra ürün sayfasını ve WhatsApp teklif bağlantısını kontrol edin.</p></div>
        <button type="button" onClick={() => navigate("products")} className="nil-admin-text-link">Katalogu aç <ArrowRight size={14}/></button>
      </section>
    </div>
  </div>;
}
