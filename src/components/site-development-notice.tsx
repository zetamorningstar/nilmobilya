import { useEffect, useState } from "react";
import { X } from "lucide-react";

/** Oturumda bir kez gösterilir; intro açılışından sonra aşağıdan yükselir. */
const SESSION_KEY = "nil-development-notice-dismissed-v1";
const INTRO_KEY = "nil-intro-seen";

export function SiteDevelopmentNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      timer = setTimeout(() => {
        try {
          if (sessionStorage.getItem(SESSION_KEY) !== "1") setOpen(true);
        } catch {
          setOpen(true);
        }
      }, 550);
    };

    // Önceki ziyarette intro tamamlandıysa kısa bir gecikmeyle göster.
    try {
      if (sessionStorage.getItem(INTRO_KEY)) show();
      else window.addEventListener("nil:reveal", show, { once: true });
    } catch {
      window.addEventListener("nil:reveal", show, { once: true });
    }
    return () => {
      window.removeEventListener("nil:reveal", show);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const close = () => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* storage blocked */ }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="nil-dev-notice-layer fixed inset-0 z-[85] flex items-center justify-center px-4 pointer-events-none">
      <aside
        role="status"
        aria-label="Site yapım aşaması bilgilendirmesi"
        className="nil-dev-notice relative pointer-events-auto w-full max-w-[530px] overflow-hidden rounded-[14px] border border-[#cba36b]/65 bg-[#242528]/[.97] px-7 py-9 text-[#f7f4ef] shadow-[0_32px_100px_rgba(0,0,0,.72),0_0_48px_rgba(194,145,77,.12)] backdrop-blur-2xl sm:px-11 sm:py-11"
        onWheel={(event) => event.stopPropagation()}
        onTouchEnd={(event) => event.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#e3b87a] to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#b8894b]/[.12] blur-[55px]" />
        <button
          type="button"
          onClick={close}
          aria-label="Duyuruyu kapat"
          className="absolute right-4 top-4 rounded-md border border-white/10 bg-white/5 p-2 text-[#d1cbc3] transition-all hover:border-[#cba36b]/60 hover:bg-white/10 hover:text-white"
        >
          <X size={18} strokeWidth={1.6} />
        </button>
        <div className="relative">
          <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.27em] text-[#d3ab73]">
            <span aria-hidden="true" className="inline-block h-[2px] w-9 bg-[#d3ab73]" />
            Nil Mobilya · Bilgilendirme
          </p>
          <h2 className="max-w-[410px] pr-5 font-serif text-[clamp(27px,4.5vw,36px)] leading-[1.12] tracking-[-.025em]">
            Sitemiz <span className="text-[#d5ab70] italic">yapım</span><br />
            aşamasındadır.
          </h2>
          <p className="mt-5 max-w-[420px] text-[14px] leading-7 text-[#d3d0cb]">
            Şu anda siparişlerimiz <span className="font-medium text-[#e0b77d]">WhatsApp üzerinden</span> alınmaktadır.
            Ürünlerimiz ve özel ölçü üretim talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
          <a
            href="https://wa.me/905360236146?text=Merhaba%2C%20Nil%20Mobilya%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-md border border-[#cba36b]/75 bg-[#cba36b]/10 px-5 py-3 text-[12px] font-semibold tracking-[.08em] text-[#e8c392] transition-colors hover:bg-[#cba36b]/20"
          >
            WhatsApp ile İletişime Geç →
          </a>
          <div aria-hidden="true" className="mt-6 flex items-center gap-3">
            <span className="h-px w-16 bg-[#d3ab73]" />
            <span className="h-[5px] w-[5px] rotate-45 border border-[#d3ab73]" />
          </div>
        </div>
      </aside>
    </div>
  );
}
