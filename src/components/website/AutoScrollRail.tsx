"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function AutoScrollRail({
  children,
  className = "",
  interval = 3600,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  interval?: number;
  ariaLabel: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);

  const pauseAutoScroll = () => {
    pauseUntilRef.current = Date.now() + 8000;
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      if (
        document.hidden ||
        Date.now() < pauseUntilRef.current ||
        rail.scrollWidth <= rail.clientWidth + 8
      ) {
        return;
      }

      const reachedEnd =
        rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 20;

      rail.scrollTo({
        left: reachedEnd ? 0 : rail.scrollLeft + rail.clientWidth * 0.84,
        behavior: "smooth",
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval]);

  return (
    <div
      ref={railRef}
      className={className}
      aria-label={ariaLabel}
      onPointerDown={pauseAutoScroll}
      onTouchStart={pauseAutoScroll}
      onMouseEnter={pauseAutoScroll}
      onFocusCapture={pauseAutoScroll}
    >
      {children}
    </div>
  );
}
