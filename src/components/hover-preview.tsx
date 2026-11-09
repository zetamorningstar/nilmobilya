// ============= Full file contents =============
import { useCallback, useEffect, useRef, useState } from "react";

type PreviewInput = {
  src: string;
  alt: string;
  title: string;
  lines: string[];
  action?: { label: string; onSelect: () => void };
};

type PreviewState = PreviewInput & {
  left: number;
  top: number;
  width: number;
  height: number;
  zoom: number;
  captionLeft: number;
  captionTop: number;
  captionWidth: number;
  connectorLeft: number;
  connectorWidth: number;
  connectorTop: number;
};

const CAPTION_WIDTH = 230;
const CAPTION_GAP = 26;
// How close the piece moves in. Kept small — a gentle trim-in, not a blow-up.
const DESIRED_ZOOM = 1.22;

function buildState(
  input: PreviewInput,
  rect: DOMRect,
  naturalScale: number,
): PreviewState {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Never zoom past the photo's own resolution — that is what keeps it sharp.
  const zoom = Math.max(1, Math.min(DESIRED_ZOOM, naturalScale));

  // The box stays exactly where the furniture sits; only the image inside
  // trims in (edges crop away), so the piece appears to lean closer.
  const captionLeft = Math.min(
    rect.right + CAPTION_GAP,
    vw - CAPTION_WIDTH - 12,
  );
  const connectorLeft = rect.right;
  const connectorWidth = Math.max(0, captionLeft - CAPTION_GAP - rect.right);
  const captionTop = rect.top + Math.min(rect.height * 0.22, 140);

  return {
    ...input,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    zoom,
    captionLeft,
    captionTop: Math.min(captionTop, vh - 160),
    captionWidth: CAPTION_WIDTH,
    connectorLeft,
    connectorWidth,
    connectorTop: Math.min(captionTop, vh - 160) + 18,
  };
}

// Read the photo's real pixel size so we can cap the zoom at native
// resolution. Falls back to the desired zoom if the size can't be read.
function measureNaturalScale(
  src: string,
  rect: DOMRect,
): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = (value: number) => resolve(value);
    img.onload = () => {
      const byWidth = img.naturalWidth / rect.width;
      const byHeight = img.naturalHeight / rect.height;
      done(Math.min(byWidth, byHeight));
    };
    img.onerror = () => done(DESIRED_ZOOM);
    img.src = src;
    // Safety net so a slow network never blocks the preview.
    setTimeout(() => done(DESIRED_ZOOM), 2500);
  });
}

export function useHoverPreview(delay = 1100) {
  const [state, setState] = useState<PreviewState | null>(null);
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const open = useCallback(
    (input: PreviewInput, element: HTMLElement) => {
      clear();
      timer.current = setTimeout(() => {
        const rect = element.getBoundingClientRect();
        measureNaturalScale(input.src, rect).then((naturalScale) => {
          setState(buildState(input, rect, naturalScale));
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setActive(true)),
          );
        });
      }, delay);
    },
    [clear, delay],
  );

  const close = useCallback(() => {
    clear();
    setActive(false);
    setState(null);
  }, [clear]);

  useEffect(() => clear, [clear]);

  const overlay = state ? (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        style={{
          background: "color-mix(in oklab, var(--background) 74%, transparent)",
          opacity: active ? 1 : 0,
          transition: "opacity 320ms linear",
        }}
      />

      {/* Fixed footprint at the furniture's own pixels; the photo inside
          trims toward the center so the piece appears to move closer. */}
      <div
        style={{
          position: "absolute",
          left: state.left,
          top: state.top,
          width: state.width,
          height: state.height,
          overflow: "hidden",
          boxShadow: active ? "0 30px 70px oklch(0 0 0 / 50%)" : "none",
          transition: "box-shadow 420ms ease",
          willChange: "contents",
        }}
      >
        <img
          src={state.src}
          alt={state.alt}
          className="h-full w-full object-cover"
          style={{
            transform: active ? `scale(${state.zoom})` : "scale(1)",
            transition: "transform 420ms cubic-bezier(.22,1,.36,1)",
            willChange: "transform",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: state.connectorLeft,
          top: state.connectorTop,
          width: active ? state.connectorWidth : 0,
          height: 1,
          background: "var(--color-primary)",
          opacity: active ? 0.8 : 0,
          transition:
            "width 340ms cubic-bezier(.22,1,.36,1) 120ms, opacity 240ms linear 120ms",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: state.captionLeft,
          top: state.captionTop,
          width: state.captionWidth,
          opacity: active ? 1 : 0,
          transform: active ? "translate3d(0,0,0)" : "translate3d(-8px,0,0)",
          transition:
            "opacity 300ms linear 180ms, transform 380ms cubic-bezier(.22,1,.36,1) 180ms",
        }}
      >
        <div className="bg-black/90 px-4 py-3 shadow-xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {state.title}
          </p>
        </div>
        {state.lines.map((line, index) => (
          <div key={line} className="mt-[3px] bg-black/85 px-4 py-2 shadow-lg">
            <p
              className="font-sans text-[11px] font-light leading-5 tracking-wide"
              style={{ color: "var(--color-gold-bright)", opacity: 1 - index * 0.15 }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return { open, close, overlay };
}
