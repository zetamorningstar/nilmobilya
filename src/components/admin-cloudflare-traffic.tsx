import { useCallback, useEffect, useState } from "react";
import { Activity, Cloud, RefreshCw, ShieldCheck } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";

type CloudflareReport = {
  source: "cloudflare";
  period: { start: string; end: string; days: number };
  totalRequests: number;
  uniqueVisitorsNote: string;
  daily: Array<{ day: string; requests: number; uniqueVisitors: number }>;
};
const tr = (v: number) => v.toLocaleString("tr-TR");

export function AdminCloudflareTraffic({ compact = false }: { compact?: boolean }) {
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const [data, setData] = useState<CloudflareReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(v => v + 1), []);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      const db = getSupabaseClient();
      if (!db) { if (alive) { setError("Supabase bağlantısı eksik."); setLoading(false); } return; }
      try {
        const { data: session, error: sessionError } = await db.auth.getSession();
        if (sessionError || !session.session?.access_token) throw new Error("Yönetici oturumu bulunamadı. Yeniden giriş yap.");
        const response = await fetch("/api/cloudflare-analytics?days=" + days, {
          headers: { Authorization: "Bearer " + session.session.access_token },
          cache: "no-store",
        });
        const result = await response.json() as CloudflareReport & { error?: string };
        if (!response.ok) throw new Error(result.error || "Cloudflare analitik verisi alınamadı.");
        if (alive) setData(result);
      } catch (e) {
        if (alive) { setData(null); setError(e instanceof Error ? e.message : "Bağlantı hatası."); }
      } finally { if (alive) setLoading(false); }
    }
    void load();
    return () => { alive = false; };
  }, [days, revision]);

  const max = Math.max(1, ...(data?.daily.map(d => d.requests) ?? []));
  const last = data?.daily[data.daily.length - 1];
  const yesterday = data?.daily[data.daily.length - 2];

  return <section className="nil-admin-surface" aria-label="Cloudflare trafik analizi">
    <div className="nil-admin-surface-head">
      <div>
        <div className="nil-admin-section-kicker"><Cloud size={16}/> CLOUDFLARE / SUNUCU TRAFİĞİ</div>
        <h2>Gerçek Site Trafiği</h2>
        <p>Cloudflare ölçümleri · günlük veriler · Supabase'den ayrı</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {!compact && <select value={days} onChange={e => setDays(Number(e.target.value) as 7 | 14 | 30)} aria-label="Cloudflare tarih aralığı" className="rounded-lg border border-[#47392e] bg-[#141313] px-2 py-2 text-xs text-[#d6c9b9]">
          <option value={7}>7 gün</option><option value={14}>14 gün</option><option value={30}>30 gün</option>
        </select>}
        <button type="button" onClick={refresh} disabled={loading} aria-label="Cloudflare verilerini yenile" title="Yenile" className="rounded-lg border border-[#47392e] p-2 text-[#b7a086] disabled:opacity-40"><RefreshCw size={15} className={loading?"animate-spin":""}/></button>
      </div>
    </div>
    {loading ? <div className="nil-admin-chart-empty"><Activity size={23}/><p>Cloudflare istatistikleri getiriliyor…</p></div>
    : error ? <div role="alert" className="rounded-xl border border-[#74543a] bg-[#2b201a] p-4 text-sm leading-6 text-[#dcc4a9]">{error}<p className="mt-2 text-xs text-[#b5a394]">Cloudflare token ve Zone ID Production ortamında olmalı. API sadece yetkili yöneticiye açıktır.</p></div>
    : data ? <>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#42362d] bg-[#211b19] p-4">
          <p className="text-[11px] text-[#b5a79a]">Toplam HTTP isteği</p>
          <strong className="mt-2 block font-serif text-3xl font-normal text-[#ede1d4]">{tr(data.totalRequests)}</strong>
          <span className="text-[10px] text-[#877d74]">Seçilen dönem</span>
        </div>
        <div className="rounded-xl border border-[#42362d] bg-[#211b19] p-4">
          <p className="text-[11px] text-[#b5a79a]">Son günün tekil IP tahmini</p>
          <strong className="mt-2 block font-serif text-3xl font-normal text-[#ede1d4]">{last ? tr(last.uniqueVisitors) : "—"}</strong>
          <span className="text-[10px] text-[#877d74]">{last?.day || "Veri yok"}</span>
        </div>
      </div>
      <div className="mt-5">
        <p className="mb-3 text-xs font-medium text-[#c7b9aa]">Günlük istek eğilimi</p>
        <div className="nil-admin-graph">
          <div className="nil-admin-graph-grid" aria-hidden="true"/>
          <div className="nil-admin-graph-bars">
            {data.daily.map((d,i) => <div key={d.day} className="nil-admin-graph-day" title={d.day+": "+tr(d.requests)+" HTTP isteği / "+tr(d.uniqueVisitors)+" tekil IP tahmini"}>
              <div className="nil-admin-graph-pair"><span className="nil-admin-view-bar" style={{height:Math.max(2,d.requests/max*100)+"%",width:"56%"}}/></div>
              <small>{i%Math.max(1,Math.ceil(data.daily.length/7))===0 || i===data.daily.length-1?d.day.slice(5):""}</small>
            </div>)}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#a69a8e]"><ShieldCheck size={14}/><span>Yalnızca yöneticiler için korumalı API.</span></div>
      <p className="mt-2 text-[11px] leading-5 text-[#93877d]">{data.uniqueVisitorsNote} Günlük ölçümler Cloudflare Overview ekranındaki son 24 saatlik değerlerden farklı olabilir.</p>
      {!compact && <div className="mt-4 border-t border-[#403328] pt-4 text-xs text-[#a99a8c]">Son gün: {last?.day ?? "—"} · Önceki gün: {yesterday?.day ?? "—"} · Kaynak: Cloudflare GraphQL</div>}
    </> : null}
  </section>;
}
