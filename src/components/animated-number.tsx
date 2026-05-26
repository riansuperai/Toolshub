"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (value: number) => string;
  prefix?: string;
  suffix?: string;
};

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function AnimatedNumber({ value, duration = 900, decimals = 0, format, prefix = "", suffix = "" }: Props) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const target = value;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);
      const current = fromRef.current + (target - fromRef.current) * eased;
      setDisplay(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = format
    ? format(display)
    : `${prefix}${display.toLocaleString("nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  return <>{formatted}</>;
}
