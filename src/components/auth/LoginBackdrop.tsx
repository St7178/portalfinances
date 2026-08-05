"use client";

import { useEffect, useRef } from "react";

/**
 * Purely decorative: animated accent grid lines + a slow rising-particle
 * canvas behind the login card. Self-contained (no props, no auth logic) so
 * it can be dropped in or removed without touching the real sign-in form.
 */
export function LoginBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    if (reduceMotion) return;

    type Particle = { x: number; y: number; v: number; o: number };
    let particles: Particle[] = [];
    let raf = 0;

    const makeParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.3 + 0.1,
    });

    const init = () => {
      const count = Math.floor((canvas.width * canvas.height) / 11000);
      particles = Array.from({ length: count }, makeParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.3 + 0.1;
        }
        ctx.fillStyle = `rgba(220,235,220,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      }
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{`
        .login-accent-lines { position: absolute; inset: 0; pointer-events: none; opacity: .6; }
        .login-hline, .login-vline { position: absolute; background: var(--border); will-change: transform, opacity; }
        .login-hline { left: 0; right: 0; height: 1px; transform: scaleX(0); transform-origin: 50% 50%; animation: login-draw-x .8s cubic-bezier(.22,.61,.36,1) forwards; }
        .login-vline { top: 0; bottom: 0; width: 1px; transform: scaleY(0); transform-origin: 50% 0%; animation: login-draw-y .9s cubic-bezier(.22,.61,.36,1) forwards; }
        .login-hline:nth-child(1) { top: 18%; animation-delay: .12s; }
        .login-hline:nth-child(2) { top: 50%; animation-delay: .22s; }
        .login-hline:nth-child(3) { top: 82%; animation-delay: .32s; }
        .login-vline:nth-child(4) { left: 22%; animation-delay: .42s; }
        .login-vline:nth-child(5) { left: 50%; animation-delay: .54s; }
        .login-vline:nth-child(6) { left: 78%; animation-delay: .66s; }
        @keyframes login-draw-x { 0% { transform: scaleX(0); opacity: 0; } 60% { opacity: .9; } 100% { transform: scaleX(1); opacity: .6; } }
        @keyframes login-draw-y { 0% { transform: scaleY(0); opacity: 0; } 60% { opacity: .9; } 100% { transform: scaleY(1); opacity: .6; } }
        @media (prefers-reduced-motion: reduce) {
          .login-hline, .login-vline { animation: none; transform: none; opacity: .5; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_25%,color-mix(in_oklch,var(--color-primary)_16%,transparent),transparent_60%)]"
      />

      <div aria-hidden className="login-accent-lines">
        <div className="login-hline" />
        <div className="login-hline" />
        <div className="login-hline" />
        <div className="login-vline" />
        <div className="login-vline" />
        <div className="login-vline" />
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60 mix-blend-screen"
      />
    </>
  );
}
