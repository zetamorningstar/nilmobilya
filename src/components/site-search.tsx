import { Link } from "@tanstack/react-router";
import { Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { collections } from "@/lib/collections";

type Item =
  | { key: string; kind: "hash"; label: string; hint: string; hash: string }
  | { key: string; kind: "collection"; label: string; hint: string; slug: string }
  | { key: string; kind: "ai"; label: string; hint: string };

// Türkçe karakterleri sadeleştirir: "İletişim" ve "iletisim" aynı sayılır
const norm = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

export function SiteSearch({
  sections,
  base = "",
}: {
  sections: readonly (readonly [string, string])[];
  /** Ana sayfa dışındaki sayfalarda "/" ver: bağlantılar ana sayfadaki bölüme gider */
  base?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    collections.forEach((collection) => {
      list.push({
        key: `c-${collection.slug}`,
        kind: "collection",
        label: `${collection.title} koleksiyonu`,
        hint: collection.note,
        slug: collection.slug,
      });
      collection.products.forEach((product) =>
        list.push({
          key: `p-${collection.slug}-${product.name}`,
          kind: "collection",
          label: product.name,
          hint: `${collection.title} · ${product.material}`,
          slug: collection.slug,
        }),
      );
    });
    list.push({ key: "ai", kind: "ai", label: "Odanda dene", hint: "Mobilyayı kendi odanızda görün" });
    sections.forEach(([id, label]) =>
      list.push({ key: `s-${id}`, kind: "hash", label, hint: "Sayfa bölümü", hash: id }),
    );
    return list;
  }, [sections]);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return items.filter((item) => item.kind === "ai" || item.key.startsWith("c-")).slice(0, 4);
    return items
      .map((item) => {
        const label = norm(item.label);
        const hint = norm(item.hint);
        const score = label.startsWith(q) ? 0 : label.includes(q) ? 1 : hint.includes(q) ? 2 : 9;
        return { item, score };
      })
      .filter((entry) => entry.score < 9)
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map((entry) => entry.item);
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rowClass =
    "block border-b border-foreground/10 px-5 py-3 transition-colors last:border-0 hover:bg-foreground/5";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className="nil-icon-btn"
        aria-label={open ? "Aramayı kapat" : "Ara"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? <X className="size-[18px]" strokeWidth={1.4} /> : <Search className="size-[18px]" strokeWidth={1.4} />}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,24rem)] border border-foreground/15 bg-background/95 shadow-2xl backdrop-blur-md animate-in fade-in-0 slide-in-from-top-2 duration-200"
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-foreground/10 px-5">
            <Search className="size-4 shrink-0 text-primary" strokeWidth={1.4} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") listRef.current?.querySelector<HTMLElement>("a")?.click();
              }}
              placeholder="Koleksiyon, parça veya bölüm ara"
              className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div ref={listRef}>
            {results.length === 0 && (
              <p className="px-5 py-6 text-xs text-muted-foreground">Sonuç bulunamadı.</p>
            )}
            {results.map((item) => {
              const content = (
                <>
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    {item.kind === "ai" && <Sparkles className="size-3.5 text-primary" />}
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{item.hint}</span>
                </>
              );
              if (item.kind === "hash")
                return (
                  <a key={item.key} href={`${base}#${item.hash}`} onClick={close} className={rowClass}>
                    {content}
                  </a>
                );
              if (item.kind === "collection")
                return (
                  <Link
                    key={item.key}
                    to="/koleksiyon/$slug"
                    params={{ slug: item.slug }}
                    onClick={close}
                    className={rowClass}
                  >
                    {content}
                  </Link>
                );
              return (
                <Link key={item.key} to="/odanda-dene" onClick={close} className={rowClass}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}