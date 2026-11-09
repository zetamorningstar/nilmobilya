import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./intro/opening.css";

/**
 * Opening sequence:
 *  black → video plays → video fades into black →
 *  a center rectangle opens → the two black halves slide up / down →
 *  homepage text rises into place while the panels leave.
 *
 * Disable: remove <IntroSequence /> from routes/index.tsx.
 * Replay while testing: sessionStorage.removeItem("nil-intro-seen")
 *
 * Needs: public/intro.mp4 (desktop) and public/intro-m.mp4 (mobile).
 * stage-scroll.tsx listens for the "nil:reveal" event dispatched here.
 */

const INTRO_KEY = "nil-intro-seen";

// Timing (seconds)
const VIDEO_SPEED = 1.25; // videonun oynatma hızı (1 = normal)
const FADE = 0.6; // video → black (also: how long before the end the outro starts)
const HOLD_BLACK = 0.1; // full-black beat
const SLIT_VH = 0.09; // half-height of the center rectangle, as a share of the screen
const SLIT_DUR = 0.6;
const OPEN_DUR = 1.1; // panels leave the screen
const BG_SETTLE = 1.8; // photo background settles in behind
const BG_FADE = 2.0; // arka plan fotoğrafı karanlıktan aydınlığa çıkış süresi
const TEXT_AT = 0.6; // panels' exit progress (0–1) at which homepage text starts rising

export function IntroSequence() {
  const [phase, setPhase] = useState<"run" | "off">("run");
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) {
      setPhase("off");
      return;
    }

    const root = rootRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!root || !top || !bottom || !wrap || !video) return;

    // Homepage content stays hidden until the panels are almost gone
    const html = document.documentElement;
    html.classList.add("nil-hold");
    const release = () => html.classList.remove("nil-hold");

    let disposed = false; // effect temizlendi mi (dev'de React efekti 2 kez çalıştırır)
    let finished = false;
    const finish = () => {
  if (finished) return;
  finished = true;
  gsap.set(".nil-bg", { clearProps: "opacity" });
  release();
  sessionStorage.setItem(INTRO_KEY, "1");
  setPhase("off");
};

    // Reduced motion: no video, no split — just a quiet fade
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.dispatchEvent(new Event("nil:reveal"));
      release();
      const t = gsap.to(root, { autoAlpha: 0, duration: 0.6, onComplete: finish });
      return () => {
        t.kill();
      };
    }

    const H = window.innerHeight;
    const bg = document.querySelector<HTMLElement>(".nil-bg");

    // Outro timeline: built paused, started when the video is nearly over
    const tl = gsap.timeline({ paused: true, onComplete: finish });
    tl.to(wrap, { autoAlpha: 0, duration: FADE, ease: "power1.inOut" })
      // 1) a center rectangle opens
      .to(top, { y: -H * SLIT_VH, duration: SLIT_DUR, ease: "power2.out" }, `+=${HOLD_BLACK}`)
      .to(bottom, { y: H * SLIT_VH, duration: SLIT_DUR, ease: "power2.out" }, "<")
      // 2) the two big halves leave; homepage text rises meanwhile
      .addLabel("open", "+=0.15")
      .to(top, { y: -H * 0.53, duration: OPEN_DUR, ease: "power3.inOut" }, "open")
      .to(bottom, { y: H * 0.53, duration: OPEN_DUR, ease: "power3.inOut" }, "open");
    if (bg) {
  tl.fromTo(
    bg,
    { scale: 1.02 },
    { scale: 1, duration: BG_SETTLE, ease: "power2.out", clearProps: "transform" },
    "open",
  ).fromTo(
    bg,
    { opacity: 0 },
    { opacity: 1, duration: BG_FADE, ease: "power1.inOut", clearProps: "opacity" },
    "open",
  );
}

    // Text rises into place when the panels are nearly out — like entering the next block
    tl.call(
      () => {
        window.dispatchEvent(new Event("nil:reveal"));
        release();
      },
      undefined,
      `open+=${OPEN_DUR * TEXT_AT}`,
    );

    let started = false;
    const startOutro = () => {
      if (started || disposed) return;
      started = true;
      tl.play();
    };

    // Video setup (smaller file on phones). Black screen until it can play.
    video.muted = true;
    video.playsInline = true;
    video.src = window.innerWidth < 768 ? "/intro-m.mp4" : "/intro.mp4";
    video.defaultPlaybackRate = VIDEO_SPEED;
    video.playbackRate = VIDEO_SPEED;

    const onTime = () => {
      if (video.duration && video.currentTime >= video.duration - FADE) startOutro();
    };
    const noVideo = () => {
      if (disposed) return; // temizlik sırasındaki pause() play'i iptal eder, bu hata değil
      gsap.set(wrap, { autoAlpha: 0 });
      window.setTimeout(startOutro, 500);
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", startOutro);
    video.addEventListener("error", noVideo);
    video.play().catch(noVideo); // autoplay blocked → straight to the split

    // Failsafe: video never started
    const failsafe = window.setTimeout(() => {
      if (!disposed && !started && video.currentTime === 0) noVideo();
    }, 7000);

    // Any interaction skips ahead to the outro
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const skip = () => startOutro();
    events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));

    return () => {
      disposed = true;
      release();
      events.forEach((e) => window.removeEventListener(e, skip));
      window.clearTimeout(failsafe);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", startOutro);
      video.removeEventListener("error", noVideo);
      video.pause();
      tl.kill();
    };
  }, []);

  if (phase === "off") return null;

  return (
    <div ref={rootRef} className="nil-opening" aria-hidden="true">
      <div ref={topRef} className="nil-opening__panel nil-opening__panel--top" />
      <div ref={bottomRef} className="nil-opening__panel nil-opening__panel--bottom" />
      <div ref={wrapRef} className="nil-opening__video">
        <video ref={videoRef} muted playsInline preload="auto" />
      </div>
    </div>
  );
}
