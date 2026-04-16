"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type FadeInWhenVisibleProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Negative = slide in from the left (good for left-to-right column stagger). */
  x?: number;
  duration?: number;
  amount?: number | "some" | "all";
};

export default function FadeInWhenVisible({
  children,
  className,
  delay = 0,
  y = 20,
  x,
  duration = 0.55,
  amount = 0.15,
}: FadeInWhenVisibleProps) {
  const reduce = useReducedMotion();

  const hidden = reduce
    ? { opacity: 1, x: 0, y: 0 }
    : {
        opacity: 0,
        y,
        ...(x !== undefined ? { x } : {}),
      };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}
