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
    <aside
      role="status"
      aria-label="Site yapım aşaması bilgilendirmesi"
      className="nil-dev-notice fixed bottom-5 left-1/2 z-[85] w-[min(92vw,410px)] -translate-x-1/2 rounded-xl border border-[#8b795d]/50 bg-[#252629]/95 px-5 py-5 text-[#f4f1ec] shadow-[0_18px_55px_rgba(0,0,0,.55)] backdrop-blur-xl"
      onWheel={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Duyuruyu kapat"
        className="absolute right-3 top-3 rounded-md p-1 text-[#b9b7b4] transition-colors hover:bg-white/10 hover:text-white"
      >
        <X size={17} strokeWidth={1.5} />
      </button>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.23em] text-[#c9a66e]">
        Nil Mobilya · Bilgilendirme
      </p>
      <h2 className="pr-5 font-serif text-[23px] leading-snug">Sitemiz yapım aşamasındadır.</h2>
      <span aria-hidden="true" className="mt-4 block h-px w-12 bg-[#c9a66e]/65" />
    </aside>
  );
}
