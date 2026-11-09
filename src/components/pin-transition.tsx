import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PinTransition() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>("#hero-pin");
      const next = document.querySelector<HTMLElement>("#koleksiyon");
      if (!hero || !next) return;

      gsap.set(next, { yPercent: 100 });

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(next, { yPercent: 100 - 100 * p });
          gsap.set(hero, { yPercent: -10 * p });
        },
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}