import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, Sparkles, X } from "lucide-react";
import { whatsappOfferUrl } from "@/lib/sales";
import { useEffect, type KeyboardEvent as ReactKeyboardEvent, type SyntheticEvent } from "react";

const stop = (event: SyntheticEvent) => event.stopPropagation();

export function SiteMenu({
  open,
  onClose,
  items,
  base = "",
}: {
  open: boolean;
  onClose: () => void;
  items: readonly (readonly [string, string])[];
  /** Ana sayfa dışındaki sayfalarda "/" ver: bağlantılar ana sayfadaki bölüme gider */
  base?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      lang="tr"
      role="dialog"
      aria-modal="true"
      aria-label="Menü"
      className="fixed inset-0 z-50 animate-in fade-in-0 duration-300"
      // Menü açıkken arkadaki sahne kaymasın
      onWheel={stop}
      onTouchEnd={stop}
      onKeyDown={(event: ReactKeyboardEvent) => {
        if (event.key !== "Escape") event.stopPropagation();
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Menüyü kapat"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#080706]/65 backdrop-blur-[14px] transition-[backdrop-filter,background-color] duration-500"
      />
      <aside className="nil-menu-panel absolute inset-y-0 right-0 flex w-[min(100vw,33rem)] flex-col overflow-y-auto bg-[#100e0d]/90 px-5 py-6 shadow-[-24px_0_70px_rgba(0,0,0,.32)] animate-in slide-in-from-right duration-500 md:px-9 md:py-8">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl uppercase tracking-[0.08em] text-primary">Menü</span>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="grid size-10 place-items-center text-foreground/85 transition-colors hover:text-primary"
          >
            <X className="size-5" strokeWidth={1.4} />
          </button>
        </div>

        <nav className="mt-7 flex flex-1 flex-col justify-center gap-2.5 py-3" aria-label="Menü bağlantıları">
          {items.map(([id, label], index) => (
            <a
              key={id}
              href={`${base}#${id}`}
              onClick={onClose}
              className="nil-menu-tile group flex items-center gap-4 rounded-[18px] border border-[#54473e]/35 bg-[#1c1815]/85 px-5 py-3.5 transition-[background-color,border-color,transform] duration-300 hover:-translate-x-1 hover:border-[#86705c]/50 hover:bg-[#29211b]/90"
            >
              <span className="w-6 text-[10px] tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(1.45rem,2.3vw,2rem)] text-[#e6dcd1] transition-colors group-hover:text-[#d1b18d]">
                {label}
              </span>
            </a>
          ))}
        </nav>

        <div className="nil-menu-footer space-y-3.5 rounded-[18px] border border-[#54473e]/25 bg-[#1a1613]/70 px-5 py-5 text-xs text-foreground/75">
          <a href="/yasal/kurumsal-bilgiler" onClick={onClose} className="block transition-colors hover:text-primary">Yasal bilgiler ve satış koşulları</a>
          <Link
            to="/odanda-dene"
            onClick={onClose}
            className="flex items-center gap-2 text-primary transition-colors hover:text-foreground"
          >
            <Sparkles className="size-4" /> Odanda dene
          </Link>
          <a
            href="https://www.instagram.com/nill.mobilya/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Instagram className="size-4" /> @nill.mobilya
          </a>
          <a href="mailto:nilmobilyatasarim@gmail.com" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Mail className="size-4" /> nilmobilyatasarim@gmail.com
          </a>
          <a href="tel:+905360236146" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Phone className="size-4" /> 0 (536) 023 61 46
          </a>
          <a href="tel:+905012516134" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Phone className="size-4" /> +90 501 251 61 34
          </a>
          <a href={whatsappOfferUrl()} target="_blank" rel="noopener noreferrer" className="block text-primary hover:text-foreground">
            WhatsApp'tan ölçü ve teklif al →
          </a>
        </div>
      </aside>
    </div>
  );
}