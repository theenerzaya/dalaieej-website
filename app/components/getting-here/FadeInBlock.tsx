"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px on reveal. */
  distance?: number;
};

export default function FadeInBlock({
  children,
  className,
  delay = 0,
  distance = 16,
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
