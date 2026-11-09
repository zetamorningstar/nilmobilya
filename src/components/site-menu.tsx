import { Link } from "@tanstack/react-router";
import { Instagram, Phone, Sparkles, X } from "lucide-react";
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
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
      />
      <aside className="absolute inset-y-0 right-0 flex w-[min(100vw,30rem)] flex-col border-l border-foreground/15 bg-background px-8 py-7 animate-in slide-in-from-right duration-500 md:px-12">
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

        <nav className="mt-8 flex flex-1 flex-col justify-center" aria-label="Menü bağlantıları">
          {items.map(([id, label], index) => (
            <a
              key={id}
              href={`${base}#${id}`}
              onClick={onClose}
              className="group flex items-baseline gap-5 border-b border-foreground/10 py-3"
            >
              <span className="w-6 text-[10px] tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-display text-3xl text-foreground/85 transition-colors group-hover:text-primary md:text-4xl">
                {label}
              </span>
            </a>
          ))}
        </nav>

        <div className="space-y-3.5 border-t border-foreground/10 pt-6 text-xs text-foreground/75">
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
          <a href="tel:+905360236146" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Phone className="size-4" /> 0 (536) 023 61 46
          </a>
        </div>
      </aside>
    </div>
  );
}