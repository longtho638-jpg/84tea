"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

function parseValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+(?:\.\d+)?)\s*(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseFloat(match[1].replace(/,/g, "")), suffix: match[2] };
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const { num, suffix } = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0" + suffix);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500, bounce: 0 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(num);
    }
  }, [isInView, motionValue, num]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      const rounded = Math.round(latest);
      setDisplay(rounded + suffix);
    });
    return unsubscribe;
  }, [spring, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
