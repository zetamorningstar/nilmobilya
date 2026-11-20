import { useEffect, useState } from "react";

/** İlk girişte, aynı oturum boyunca tekrar açılmayan hafif bir bilgilendirme. */
const SESSION_KEY = "nil-development-notice-dismissed-v1";

export function SiteDevelopmentNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { setOpen(sessionStorage.getItem(SESSION_KEY) !== "1"); }
    catch { setOpen(true); }
  }, []);

  const close = () => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* storage blocked */ }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside
      role="status"
      aria-label="Web sitesi geliştirme duyurusu"
      className="fixed bottom-5 left-1/2 z-[85] w-[min(92vw,490px)] -translate-x-1/2 rounded-lg border border-[#6c5538] bg-[#171410]/95 p-5 text-[#f1eadd] shadow-[0_12px_55px_rgba(0,0,0,.6)] backdrop-blur-xl"
      onWheel={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#c6a679]">Nil Mobilya · Bilgilendirme</p>
          <h2 className="mt-2 font-serif text-2xl">Web sitemizi geliştiriyoruz.</h2>
        </div>
        <button type="button" onClick={close} aria-label="Duyuruyu kapat" className="px-2 py-1 text-lg text-[#c6b8a6] hover:text-white">×</button>
      </div>
      <p className="mt-2 text-[13px] leading-6 text-[#ccc0b1]">
        Sitemiz geliştirme sürecindedir. Koleksiyonlarımızı inceleyebilir, güncel ürün bilgileri
        ve sipariş koşulları için bizimle iletişime geçebilirsiniz.
      </p>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={close} className="rounded border border-[#ae9066] px-4 py-2 text-xs text-[#ead4b0] transition-colors hover:bg-[#30271d]">Siteyi incelemeye devam et →</button>
      </div>
    </aside>
  );
}
