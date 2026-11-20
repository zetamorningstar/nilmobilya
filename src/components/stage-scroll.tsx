import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  AYARLAR — hızı ve hissi buradan değiştirebilirsin (milisaniye)    */
/* ------------------------------------------------------------------ */
const EXIT_MS = 760; // bir öğenin ekran dışına çıkış süresi
const EXIT_SPREAD = 0; // çıkarken öğeler arası toplam gecikme
const ENTER_MS = 760; // bir öğenin ekranın altından gelme süresi
const ENTER_SPREAD = 0; // gelirken öğeler arası toplam gecikme
const EDGE_PAD = 48; // öğe ekran kenarından bu kadar px daha uzağa gider
const EASE_IN = "cubic-bezier(0.55, 0, 0.2, 1)";
const EASE_OUT = "cubic-bezier(0.2, 0.8, 0.25, 1)";
const MIN_HEIGHT = 560; // bundan kısa ekranlarda normal kaydırmaya döner
const STORE_KEY = "nil-scene-index";
const STEP_GAP = 155; // tekerlekte iki sahne adımı arası en az süre (ms)

type Dir = 1 | -1;
type Kind = "text" | "frame" | "fade" | "rule";
type Atom = { el: HTMLElement; kind: "line" | Kind };

/* Yazıyı satır satır, görünmez kutuların içine böler */
function splitLines(el: HTMLElement) {
  const nodes = Array.from(el.childNodes);
  const simple = nodes.every(
    (n) => n.nodeType === 3 || (n as HTMLElement).tagName === "BR",
  );

  const makeMask = (line: boolean) => {
    const mask = document.createElement("span");
    mask.className = line ? "nil-mask nil-mask--line" : "nil-mask";
    const inner = document.createElement("span");
    inner.className = "nil-mask__in";
    mask.appendChild(inner);
    return { mask, inner };
  };

  const build = () => {
    el.textContent = "";
    const tokens: ({ w: string } | { br: true })[] = [];
    nodes.forEach((n) => {
      if (n.nodeType === 3) {
        (n.textContent ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .forEach((w) => tokens.push({ w }));
      } else if (simple) {
        tokens.push({ br: true });
      }
    });

    // <span>, link gibi içerik varsa bölmeden tek kutu yap
    if (!simple || tokens.length === 0) {
      const { mask, inner } = makeMask(false);
      nodes.forEach((n) => inner.appendChild(n));
      el.appendChild(mask);
      return;
    }

    const spans: (HTMLElement | null)[] = [];
    tokens.forEach((t, i) => {
      if ("br" in t) {
        el.appendChild(document.createElement("br"));
        spans.push(null);
        return;
      }
      if (i > 0 && !("br" in tokens[i - 1]!)) el.appendChild(document.createTextNode(" "));
      const s = document.createElement("span");
      s.textContent = t.w;
      el.appendChild(s);
      spans.push(s);
    });

    const lines: string[][] = [];
    let lastTop = -99999;
    tokens.forEach((t, i) => {
      if ("br" in t) {
        lastTop = -99999;
        return;
      }
      const top = spans[i]!.offsetTop;
      if (Math.abs(top - lastTop) > 4) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1]!.push(t.w);
    });

    el.textContent = "";
    lines.forEach((ws) => {
      const { mask, inner } = makeMask(true);
      inner.textContent = ws.join(" ");
      el.appendChild(mask);
    });
  };

  build();
  return {
    rebuild: build,
    undo: () => {
      el.textContent = "";
      nodes.forEach((n) => el.appendChild(n));
    },
  };
}

/*
 * Bir öğe için giriş / çıkış animasyonu.
 * Öğe, bulunduğu yerden ekranın dışına (ya da dışından) gerçek piksel mesafesiyle taşınır:
 *   ileri giderken  → eski sahne yukarı çıkar, yeni sahne ekranın altından gelir
 *   geri giderken   → eski sahne aşağı iner, yeni sahne ekranın üstünden gelir
 */
function travelDistance(el: HTMLElement, phase: "in" | "out", dir: Dir) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const up = -(r.bottom + EDGE_PAD); // öğeyi ekranın üstüne atar
  const down = vh - r.top + EDGE_PAD; // öğeyi ekranın altına atar
  if (phase === "out") return dir === 1 ? up : down;
  return dir === 1 ? down : up;
}

/* Öğenin o anki dikey kayma değeri (giriş animasyonu yarıdaysa sıfır olmaz) */
function currentY(el: HTMLElement) {
  const t = getComputedStyle(el).translate;
  if (!t || t === "none") return 0;
  return parseFloat(t.split(" ")[1] ?? "0") || 0;
}

function playAtom(atom: Atom, phase: "in" | "out", dir: Dir, delay: number, fast = false): Animation[] {
  const { el, kind } = atom;
  const dist = travelDistance(el, phase, dir);
  let startOut = 0;
  if (phase === "out") {
    // Giriş yarıdayken yeni geçiş gelirse zıplama olmasın: bulunduğu yerden devam et
    startOut = currentY(el);
    el.getAnimations().forEach((an) => an.cancel());
  }
  // Mevcut pozisyonu önce oku; sonra eski inline translate değerini temizle.
  const incomingPosition = currentY(el);
  el.style.translate = "";
  const from = phase === "in" && incomingPosition !== 0 ? incomingPosition : (phase === "in" ? dist : startOut);
  const to = phase === "in" ? 0 : dist;

  const frames: Keyframe[] = [{ translate: `0 ${from}px` }, { translate: `0 ${to}px` }];
  if (kind === "rule" && phase === "in") {
    frames[0]!.scale = "0 1";
    frames[1]!.scale = "1 1";
  }

  return [
    el.animate(frames, {
      duration: fast ? 520 : (phase === "in" ? ENTER_MS : EXIT_MS),
      delay,
      easing: fast ? "cubic-bezier(0.24, 0.68, 0.32, 1)" : (phase === "in" ? EASE_OUT : EASE_IN),
      fill: phase === "in" ? "backwards" : "forwards",
    }),
  ];
}

export function initStage(options: { persist?: boolean } = {}) {
  const persist = options.persist ?? true;
  const stage = document.querySelector<HTMLElement>(".nil-stage");
  if (!stage) return undefined;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
  if (window.innerHeight < MIN_HEIGHT) return undefined;
  // Touch devices need natural page scrolling; the desktop scene lock clips mobile content.
  if (window.matchMedia("(max-width: 1099px), (pointer: coarse)").matches) return undefined;

  const root = document.documentElement;
  const scenes = Array.from(stage.querySelectorAll<HTMLElement>(".nil-scene"));
  if (scenes.length < 2) return undefined;

  const idToIndex = new Map<string, number>();
  scenes.forEach((s, i) => s.id && idToIndex.set(s.id, i));

  root.classList.add("nil-staged");

  // Yazıları satırlara böl
  const splitters = new Map<HTMLElement, ReturnType<typeof splitLines>>();
  const items = (scene: HTMLElement) =>
    Array.from(scene.querySelectorAll<HTMLElement>("[data-s]"));
  const splitAll = () => {
    scenes.forEach((scene) =>
      items(scene).forEach((el) => {
        if (el.dataset["s"] !== "text") return;
        const existing = splitters.get(el);
        if (existing) existing.rebuild();
        else splitters.set(el, splitLines(el));
      }),
    );
  };
  splitAll();

  const atomsOf = (scene: HTMLElement): Atom[] => {
    const out: Atom[] = [];
    items(scene).forEach((el) => {
      const kind = el.dataset["s"] as Kind;
      if (kind === "text") {
        el.querySelectorAll<HTMLElement>(".nil-mask").forEach((line) =>
          out.push({ el: line, kind: "line" }),
        );
      } else {
        out.push({ el, kind });
      }
    });
    return out;
  };

  // Başlangıç sahnesi: adres çubuğundaki #bölüm, yoksa en son bakılan
  let cur = 0;
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash && idToIndex.has(hash)) cur = idToIndex.get(hash)!;
  else if (persist) {
    const saved = Number(sessionStorage.getItem(STORE_KEY));
    if (Number.isInteger(saved) && saved > 0 && saved < scenes.length) cur = saved;
  }
  scenes.forEach((s, i) => s.classList.toggle("is-off", i !== cur));
  root.style.setProperty("--nil-p", String(cur));

  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav]"));
  const linkIndex = (a: HTMLAnchorElement) => {
    const h = (a.getAttribute("href") ?? "").slice(1);
    return h === "top" ? 0 : (idToIndex.get(h) ?? -1);
  };
  const markActive = () =>
    navLinks.forEach((a) =>
      a.setAttribute("aria-current", linkIndex(a) === cur ? "true" : "false"),
    );
  markActive();

  /* ---------------- Kesintisiz, yönü koruyan sahne geçişi ---------------- */
  // Yeni kaydırma geldiğinde eski giriş animasyonu tamamlanmak zorunda değil.
  // Önce mevcut görünür konumu yakalayıp aynı yönde çıkışa çeviriyoruz.
  let desired = cur;
  let transitionTimer: number | undefined;
  let cleanupTimer: number | undefined;
  let transitioning = false;
  const activeAnimations = new Set<Animation>();
  const cancelAnimations = (scene: HTMLElement) => {
    scene.querySelectorAll<HTMLElement>("[data-s], .nil-mask").forEach((el) => {
      el.getAnimations().forEach((animation) => {
        // Mevcut görsel pozisyonu yeni çıkışın başlangıcı olarak koru.
        const y = currentY(el);
        animation.cancel();
        el.style.translate = y ? `0 ${y}px` : "";
        activeAnimations.delete(animation);
      });
    });
  };
  const clearScene = (scene: HTMLElement) => {
    cancelAnimations(scene);
    scene.querySelectorAll<HTMLElement>("[data-s], .nil-mask").forEach((el) => {
      el.style.translate = "";
    });
    scene.classList.add("is-off");
    scene.classList.remove("is-leaving");
  };
  const play = (scene: HTMLElement, phase: "in" | "out", dir: Dir, fast: boolean) => {
    const atoms = atomsOf(scene);
    const spread = phase === "in" ? ENTER_SPREAD : EXIT_SPREAD;
    const step = atoms.length > 1 ? spread / (atoms.length - 1) : 0;
    atoms.forEach((atom, index) => {
      const animations = playAtom(atom, phase, dir, index * step, fast);
      animations.forEach((animation) => activeAnimations.add(animation));
    });
  };
  const goTo = (target: number) => {
    if (target < 0 || target >= scenes.length) return;
    if (document.querySelector(".nil-intro, .nil-opening")) return;
    if (target === desired && transitioning) return;
    if (target === cur && !transitioning) return;

    const dir: Dir = target > cur ? 1 : -1;
    const fast = transitioning;
    desired = target;
    if (transitionTimer !== undefined) window.clearTimeout(transitionTimer);
    if (cleanupTimer !== undefined) window.clearTimeout(cleanupTimer);

    // Önceki geçişten kalan üçüncü sahneleri kapat; yalnızca mevcut ve hedef sahne görünür.
    scenes.forEach((scene, index) => {
      if (index !== cur && index !== target) clearScene(scene);
    });
    const from = scenes[cur]!;
    const to = scenes[target]!;
    cancelAnimations(from);
    from.classList.remove("is-off");
    from.classList.add("is-leaving");
    play(from, "out", dir, fast);
    cancelAnimations(to);
    to.classList.remove("is-off", "is-leaving");
    play(to, "in", dir, fast);

    cur = target; // hedef anında aktif olur: ikinci kaydırma landing'i beklemez
    // Arka plan çapraz geçişi, fotoğraf ve metinle aynı sürede başlar.
    root.style.setProperty("--nil-bg-ms", `${fast ? 340 : ENTER_MS}ms`);
    root.style.setProperty("--nil-p", String(cur));
    if (persist) sessionStorage.setItem(STORE_KEY, String(cur));
    markActive();
    transitioning = true;
    const finishedFrom = from;
    cleanupTimer = window.setTimeout(() => {
      if (finishedFrom !== scenes[cur]) clearScene(finishedFrom);
      cleanupTimer = undefined;
    }, (fast ? 520 : EXIT_MS) + EXIT_SPREAD + 35);
    transitionTimer = window.setTimeout(() => {
      transitioning = false;
      transitionTimer = undefined;
    }, (fast ? 520 : ENTER_MS) + ENTER_SPREAD);
  };
  const step = (d: Dir) => goTo(Math.max(0, Math.min(scenes.length - 1, cur + d)));

  /* ---------------- Girdiler ---------------- */
  let lastWheel = 0;
  let lastStep = 0;
  let prevAbs = 0;
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;
    const abs = Math.abs(e.deltaY);
    const fading = gap < 60 && abs <= prevAbs; // trackpad'in sönme hareketi
    prevAbs = abs;
    if (abs < 6 || fading) return;
    if (now - lastStep < STEP_GAP) return;
    lastStep = now;
    step(e.deltaY > 0 ? 1 : -1);
  };
  window.addEventListener("wheel", onWheel, { passive: false });

  let sy = 0;
  let sx = 0;
  const onTouchStart = (e: TouchEvent) => {
    sy = e.touches[0]!.clientY;
    sx = e.touches[0]!.clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const t = e.changedTouches[0]!;
    const dy = sy - t.clientY;
    const dx = sx - t.clientX;
    if (Math.abs(dy) < 48 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
    step(dy > 0 ? 1 : -1);
  };
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });

  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable='true']")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") step(1);
    else if (e.key === "ArrowUp" || e.key === "PageUp") step(-1);
    else if (e.key === " " && !t.closest("button, a, [role='button']")) step(e.shiftKey ? -1 : 1);
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(scenes.length - 1);
    else return;
    e.preventDefault();
  };
  window.addEventListener("keydown", onKey);

  const onClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href")!.slice(1);
    const idx = id === "top" || id === "" ? 0 : idToIndex.get(id);
    if (idx === undefined) return;
    e.preventDefault();
    goTo(idx);
  };
  document.addEventListener("click", onClick);

  /* Genişlik / font değişince satırları yeniden hesapla */
  let lastW = window.innerWidth;
  const refit = () => {
    if (transitioning) return;
    splitAll();
  };
  let rt = 0;
  const onResize = () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        refit();
      }
    }, 200);
  };
  window.addEventListener("resize", onResize);
  void document.fonts?.ready.then(refit);

  // Giriş animasyonu varsa: ilk sahnenin öğeleri paneller çıkarken yerine gelir
  let onReveal: (() => void) | undefined;
  if (document.querySelector(".nil-opening") && !sessionStorage.getItem("nil-intro-seen")) {
    let released = false;
    onReveal = () => {
      if (released) return;
      released = true;
      // Satırlar yeniden bölünmüş olabilir: öğeleri şimdi al
      const first = atomsOf(scenes[cur]!);
      const stepMs = first.length > 1 ? ENTER_SPREAD / (first.length - 1) : 0;
      first.forEach((a, i) => playAtom(a, "in", 1, i * stepMs));
    };
    window.addEventListener("nil:reveal", onReveal, { once: true });
    later(() => onReveal?.(), 20000); // emniyet
  }

  return () => {
    if (transitionTimer !== undefined) window.clearTimeout(transitionTimer);
    if (cleanupTimer !== undefined) window.clearTimeout(cleanupTimer);
    activeAnimations.forEach((animation) => animation.cancel());
    window.clearTimeout(rt);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    if (onReveal) window.removeEventListener("nil:reveal", onReveal);
    document.removeEventListener("click", onClick);
    splitters.forEach((s) => s.undo());
    scenes.forEach((s) => {
      s.classList.remove("is-off", "is-leaving");
      s.querySelectorAll<HTMLElement>("[data-s], .nil-mask").forEach((el) => { el.style.translate = ""; });
    });
    root.classList.remove("nil-staged");
    root.style.removeProperty("--nil-p");
    root.style.removeProperty("--nil-bg-ms");
  };
}

export function StageScroll({ persist = true }: { persist?: boolean }) {
  useEffect(() => initStage({ persist }), [persist]);
  return null;
}