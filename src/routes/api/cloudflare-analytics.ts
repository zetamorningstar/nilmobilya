import { createFileRoute } from "@tanstack/react-router";

type CloudflareDay = { dimensions?: { date?: string }; sum?: { requests?: number }; uniq?: { uniques?: number } };
type RequestGroup = { count?: number; dimensions?: { clientCountryName?: string; clientDeviceType?: string; clientRefererHost?: string } };
type BreakdownResponse = { data?: { viewer?: { zones?: Array<{ breakdown?: RequestGroup[] }> } }; errors?: Array<{message?: string}> };
type Breakdown = { label: string; requests: number };
async function readBreakdown(token: string, zoneId: string, dimension: "clientCountryName" | "clientDeviceType" | "clientRefererHost", from: string, until: string): Promise<{ rows: Breakdown[]; error: string | null }> {
  const query = `query TrafficBreakdown($zoneTag: string, $start: Time, $end: Time) {
    viewer { zones(filter: {zoneTag: $zoneTag}) {
      breakdown: httpRequestsAdaptiveGroups(
        filter: {datetime_geq: $start, datetime_lt: $end}
        limit: 30
        orderBy: [count_DESC]
      ) { count dimensions { ${dimension} } }
    }}
  }`;
  try {
    const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: {Authorization: "Bearer " + token,"Content-Type": "application/json"},
      body: JSON.stringify({query,variables:{zoneTag:zoneId,start:from,end:until}}),
      cache: "no-store",
    });
    if (!response.ok) return {rows:[],error:"Cloudflare ayrıntı sorgusu şu an kullanılamıyor."};
    const data = await response.json() as BreakdownResponse;
    if (data.errors?.length || !data.data?.viewer?.zones?.[0]) return {rows:[],error:"Bu ayrıntı Cloudflare planı veya sorgu limiti nedeniyle sunulamadı."};
    const list = data.data.viewer.zones[0].breakdown ?? [];
    return {
      rows:list.map(d=>({
        label:String(d.dimensions?.[dimension] || "Bilinmiyor").slice(0,140),
        requests:Math.max(0,Number(d.count ?? 0)),
      })).filter(d=>Number.isFinite(d.requests)),
      error:null,
    };
  } catch {
    return {rows:[],error:"Ayrıntılı analitik bağlantısı geçici olarak kullanılamıyor."};
  }
}

type CloudflareResponse = {
  data?: { viewer?: { zones?: Array<{ httpRequests1dGroups?: CloudflareDay[] }> } };
  errors?: Array<{ message?: string }>;
};

const noStore = { "Cache-Control": "private, no-store", "Vary": "Authorization" };
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: noStore });

/** The token and zone ID are never returned to clients. */
export const Route = createFileRoute("/api/cloudflare-analytics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authorization = request.headers.get("Authorization") ?? "";
        const jwt = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
        if (!jwt || jwt.length > 8192) return json({ error: "Oturum doğrulanamadı." }, 401);

        // Public Supabase URL and anon/publishable key; never use a service-role key.
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return json({ error: "Supabase ayarları eksik." }, 503);

        try {
          // Verify the JWT with Supabase Auth, not merely by decoding it locally.
          const auth = await fetch(supabaseUrl + "/auth/v1/user", {
            headers: { apikey: supabaseKey, Authorization: "Bearer " + jwt },
            cache: "no-store",
          });
          if (!auth.ok) return json({ error: "Geçersiz oturum." }, 401);

          // Perform server-side role verification so the Cloudflare token cannot be used by visitors.
          const role = await fetch(supabaseUrl + "/rest/v1/rpc/is_admin", {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: "Bearer " + jwt,
              "Content-Type": "application/json",
            },
            body: "{}",
            cache: "no-store",
          });
          if (!role.ok || (await role.json()) !== true) {
            return json({ error: "Bu işlem için yönetici yetkisi gerekiyor." }, 403);
          }

          // Nitro injects Cloudflare runtime variables during each request.
          // Do not read secrets at module scope or use a cloudflare:workers
          // import: the Vite client build cannot resolve that virtual module.
          const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN;
          const zoneId = process.env.CLOUDFLARE_ZONE_ID;
          if (!token || !zoneId) return json({ error: "Cloudflare analitik değişkenleri eksik." }, 503);

          const url = new URL(request.url);
          const rawDays = Number(url.searchParams.get("days") ?? "7");
          if (![7, 14, 30].includes(rawDays)) return json({ error: "Geçersiz tarih aralığı." }, 400);

          const now = new Date();
          const start = new Date(now);
          start.setUTCDate(start.getUTCDate() - rawDays + 1);
          const dateStart = start.toISOString().slice(0, 10);
          const dateEnd = now.toISOString().slice(0, 10);

          const query = `query DailyTraffic($zoneTag: string, $start: Date, $end: Date) {
            viewer {
              zones(filter: {zoneTag: $zoneTag}) {
                httpRequests1dGroups(
                  filter: { date_geq: $start, date_leq: $end }
                  limit: 31
                  orderBy: [date_ASC]
                ) {
                  dimensions { date }
                  sum { requests }
                  uniq { uniques }
                }
              }
            }
          }`;
          const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables: { zoneTag: zoneId, start: dateStart, end: dateEnd } }),
            cache: "no-store",
          });
          if (!response.ok) {
            return json({ error: "Cloudflare API yanıt vermedi (" + response.status + ")." }, 502);
          }
          const result = (await response.json()) as CloudflareResponse;
          if (result.errors?.length) {
            // Do not echo upstream error text: it may contain sensitive account configuration.
            return json({ error: "Cloudflare sorgusu çalışmadı. Token izinlerini ve Zone ID'yi kontrol et." }, 502);
          }
          const zone = result.data?.viewer?.zones?.[0];
          if (!zone) return json({ error: "Cloudflare alanı bulunamadı. Zone ID veya hesap erişimini kontrol et." }, 502);
          const daily = (zone.httpRequests1dGroups ?? []).map(d => ({
            day: String(d.dimensions?.date ?? ""),
            requests: Number(d.sum?.requests ?? 0),
            uniqueVisitors: Number(d.uniq?.uniques ?? 0),
          })).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.day));
          // Adaptive breakdown is sampled request traffic, not visitors, sessions or verified customers.
          // Query last 24 hours separately so a dataset/plan limitation cannot break daily statistics.
          const breakdownEnd = now.toISOString();
          const breakdownStart = new Date(now.getTime() - 24*60*60*1000).toISOString();
          const [countries, devices, referrers] = await Promise.all([
            readBreakdown(token,zoneId,"clientCountryName",breakdownStart,breakdownEnd),
            readBreakdown(token,zoneId,"clientDeviceType",breakdownStart,breakdownEnd),
            readBreakdown(token,zoneId,"clientRefererHost",breakdownStart,breakdownEnd),
          ]);

          // Unique visitors MUST NOT be summed across dates: that counts repeat visits multiple times.
          // The API reports daily unique IP approximations, not exact human shoppers.
          return json({
            source: "cloudflare",
            period: { start: dateStart, end: dateEnd, days: rawDays },
            daily,
            totalRequests: daily.reduce((sum, day) => sum + day.requests, 0),
            breakdown: {
              period: {start:breakdownStart,end:breakdownEnd,label:"Son 24 saat"},
              countries,devices,referrers,
              note:"Cloudflare örneklenmiş HTTP istekleri. Kişi, oturum veya kesin trafik kaynağı sayısı değildir. Referer başlığı eksik olabilir; kaynak belirtilmeyenler doğrudan ziyaret anlamına gelmeyebilir.",
            },
            uniqueVisitorsNote: "Günlük benzersiz IP tahmini; günlük sayılar toplanarak dönemsel tekil kişi hesaplanamaz.",
          });
        } catch {
          return json({ error: "Analitik verisi alınırken bağlantı hatası oluştu." }, 502);
        }
      },
    },
  },
});
