import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

function getTop(el: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let timer: number | undefined;
    const snap = () => {
      if (lenis.isScrolling) {
        timer = window.setTimeout(snap, 140);
        return;
      }
      const vh = window.innerHeight;
      const blocks = Array.from(
        document.querySelectorAll<HTMLElement>("main > section[data-snap], main > footer"),
      );
      let target: number | null = null;
      for (const el of blocks) {
        const dist = getTop(el) - window.scrollY;
        if (dist > -vh * 0.12 && dist < vh * 0.3 && Math.abs(dist) > 2) {
          target = getTop(el);
          break;
        }
      }
      if (target !== null) {
        lenis.scrollTo(target, {
          duration: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      }
    };

    const offScroll = finePointer
      ? lenis.on("scroll", () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(snap, 140);
        })
      : undefined;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      event.preventDefault();
      if (!id || id === "top") {
        lenis.scrollTo(0, { duration: 1.4 });
        return;
      }
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(getTop(el), { duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick);
      offScroll?.();
      lenis.destroy();
    };
  }, []);

  return null;
}