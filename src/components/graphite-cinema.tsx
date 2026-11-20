import { useEffect, useState, type CSSProperties } from "react";
import "./graphite-cinema.css";

const KEY = "nil-graphite-cinema-v5-seen";
const letters = [..."NİL MOBİLYA"];
export function GraphiteCinema() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const force = new URLSearchParams(window.location.search).get("intro") === "1";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || (!force && sessionStorage.getItem(KEY))) return;
    setVisible(true);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem(KEY, "1");
      setVisible(false);
    };
    const timeout = window.setTimeout(finish, 4700);
    return () => { done = true; window.clearTimeout(timeout); };
  }, []);
  if (!visible) return null;
  return (
    <div className="nil-cinema" role="presentation" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget && event.animationName === "nil-cinema-exit") {
        sessionStorage.setItem(KEY, "1"); setVisible(false);
      }
    }}>
      <div className="nil-cinema__flow nil-cinema__flow--a" />
      <div className="nil-cinema__flow nil-cinema__flow--b" />
      <div className="nil-cinema__flow nil-cinema__flow--c" />
      <div className="nil-cinema__beam" /><div className="nil-cinema__shade" />
      <div className="nil-cinema__center">
        <div className="nil-cinema__mark">N</div>
        <div className="nil-cinema__brand" aria-label="NİL MOBİLYA">
          {letters.map((letter, i) => letter === " " ? <span key={i} className="nil-cinema__space" /> :
            <span key={i} aria-hidden="true" className="nil-cinema__letter" style={{"--spread": `${(i-4.5)*7}px`} as CSSProperties}>{letter}</span>)}
        </div>
        <div className="nil-cinema__line" /><div className="nil-cinema__tag">FORM · MALZEME · ZAMANSIZLIK</div>
      </div>
      <button type="button" className="nil-cinema__skip" onClick={() => {sessionStorage.setItem(KEY, "1");setVisible(false);}}>GEÇ</button>
    </div>
  );
}
