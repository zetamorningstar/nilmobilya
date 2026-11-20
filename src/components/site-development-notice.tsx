import { useEffect, useState } from "react";
import { X } from "lucide-react";

/** Oturumda bir kez gösterilir; intro açılışından sonra aşağıdan yükselir. */
const SESSION_KEY = "nil-development-notice-dismissed-v1";

export function SiteDevelopmentNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => {
      try {
        if (sessionStorage.getItem(SESSION_KEY) !== "1") setOpen(true);
      } catch {
        setOpen(true);
      }
    };

    // Show the notice as soon as the intro disappears, without an extra delay.
    window.addEventListener("nil:intro-finished", show);
    // Returning visitors may not see the intro at all.
    if (!document.querySelector(".nil-cinema")) show();

    return () => window.removeEventListener("nil:intro-finished", show);
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
        className="nil-dev-notice relative pointer-events-auto w-full max-w-[530px] overflow-hidden rounded-[14px] border border-[#b89260]/45 bg-[linear-gradient(135deg,rgba(27,23,20,.94),rgba(42,34,27,.91)_52%,rgba(25,22,20,.94))] px-7 py-9 text-[#f3eadd] shadow-[0_32px_100px_rgba(0,0,0,.62),0_0_48px_rgba(194,145,77,.07)] backdrop-blur-2xl sm:px-11 sm:py-11"
        onWheel={(event) => event.stopPropagation()}
        onTouchEnd={(event) => event.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#c7a16d]/80 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#a67c4b]/[.09] blur-[55px]" />
        <button
          type="button"
          onClick={close}
          aria-label="Duyuruyu kapat"
          className="absolute right-4 top-4 rounded-md border border-white/10 bg-white/5 p-2 text-[#d6c8b5] transition-all hover:border-[#cba36b]/60 hover:bg-white/10 hover:text-white"
        >
          <X size={18} strokeWidth={1.6} />
        </button>
        <div className="relative">
          <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.27em] text-[#c7a77b]">
            <span aria-hidden="true" className="inline-block h-[2px] w-9 bg-[#c7a77b]" />
            NİL MOBİLYA · KISA BİLGİ
          </p>
          <h2 className="max-w-[410px] pr-5 font-serif text-[clamp(27px,4.5vw,36px)] leading-[1.12] tracking-[-.025em]">
            Size daha iyi bir <span className="text-[#d9b986] italic">deneyim</span><br />
            hazırlıyoruz.
          </h2>
          <p className="mt-5 max-w-[420px] text-[14px] leading-7 text-[#d7cfc4]">
            Web sitemizi geliştirmeye devam ediyoruz. Bu süreçte sipariş ve özel ölçü talepleriniz için <span className="font-medium text-[#e5c293]">WhatsApp üzerinden</span> bizimle iletişime geçebilirsiniz.
          </p>
          <a
            href="https://wa.me/905360236146?text=Merhaba%2C%20Nil%20Mobilya%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-md border border-[#b89260]/55 bg-[#b89260]/[.08] px-5 py-3 text-[12px] font-semibold tracking-[.08em] text-[#e2c49a] transition-colors hover:bg-[#b89260]/[.16]"
          >
            WhatsApp'tan Bize Ulaşın →
          </a>
          <div aria-hidden="true" className="mt-6 flex items-center gap-3">
            <span className="h-px w-16 bg-[#c7a77b]" />
            <span className="h-[5px] w-[5px] rotate-45 border border-[#c7a77b]" />
          </div>
        </div>
      </aside>
    </div>
  );
}
