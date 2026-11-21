import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { CollectionProduct } from "@/lib/collections";

export function ProductPhotoGallery({ product }: { product: CollectionProduct }) {
  const photos = Array.from(new Set([product.image, ...(product.gallery ?? [])].filter(Boolean)));
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const active = photos[Math.min(current, photos.length - 1)] ?? product.image;
  const change = (direction: number) => setCurrent((index) => (index + direction + photos.length) % photos.length);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (photos.length > 1 && event.key === "ArrowRight") change(1);
      if (photos.length > 1 && event.key === "ArrowLeft") change(-1);
    };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [expanded, photos.length]);

  return (
    <section aria-label="Ürün fotoğraf galerisi" className="min-w-0">
      <div className="group relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-[#b59261]/25 bg-[#1a1714] sm:min-h-[480px]">
        <button type="button" onClick={() => setExpanded(true)} aria-label="Fotoğrafı büyüt" className="flex w-full items-center justify-center p-4 sm:p-6">
          <img src={active} alt={product.name + " – ürün fotoğrafı " + (current + 1)} className="max-h-[690px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" width={1024} height={1280} fetchPriority="high" />
        </button>
        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-[#bd9b6e]/35 bg-[#17120e]/85 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-[#e7c28c]">Ürün Galerisi</span>
        <button type="button" onClick={() => setExpanded(true)} aria-label="Tam ekranda görüntüle" className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/65 p-3 text-white hover:bg-black/85"><Expand size={18}/></button>
        {photos.length > 1 && <>
          <button type="button" onClick={() => change(-1)} aria-label="Önceki fotoğraf" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white"><ChevronLeft size={22}/></button>
          <button type="button" onClick={() => change(1)} aria-label="Sonraki fotoğraf" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white"><ChevronRight size={22}/></button>
          <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white">{current + 1} / {photos.length}</span>
        </>}
      </div>
      {photos.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Fotoğraf küçük görselleri">
        {photos.map((photo, index) => <button key={photo} type="button" onClick={() => setCurrent(index)} aria-pressed={current === index} aria-label={(index + 1) + ". fotoğrafı seç"} className={"h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-[#1b1713] p-1 " + (current === index ? "border-[#d6ad79]" : "border-white/10 hover:border-[#a78962]")}><img src={photo} alt="" loading="lazy" className="h-full w-full object-contain"/></button>)}
      </div>}
      <p className="mt-4 text-xs leading-6 text-[#9e9182]">Renk ve doku, ekran ayarlarına göre farklı görünebilir.</p>
      {expanded && <div role="dialog" aria-modal="true" aria-label={product.name + " büyük fotoğraf"} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080706]/95 p-4 backdrop-blur-lg" onClick={() => setExpanded(false)}>
        <button type="button" autoFocus onClick={() => setExpanded(false)} aria-label="Galeriyi kapat" className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-[#241d17] p-3 text-white"><X size={22}/></button>
        <img src={active} alt={product.name + " büyük fotoğraf"} className="max-h-[85vh] max-w-full object-contain" onClick={event => event.stopPropagation()}/>
        {photos.length > 1 && <div className="absolute bottom-5 flex items-center gap-6 rounded-full border border-white/15 bg-[#231c16] px-5 py-3" onClick={event => event.stopPropagation()}>
          <button type="button" onClick={() => change(-1)} aria-label="Önceki fotoğraf"><ChevronLeft size={23}/></button>
          <span className="text-sm tabular-nums">{current + 1} / {photos.length}</span>
          <button type="button" onClick={() => change(1)} aria-label="Sonraki fotoğraf"><ChevronRight size={23}/></button>
        </div>}
      </div>}
    </section>
  );
}
