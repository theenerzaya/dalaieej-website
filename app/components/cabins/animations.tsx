"use client";

/**
 * Animation kit for /cabins — recreates the Hoteller "Our Rooms" animation
 * vocabulary on top of framer-motion (already a project dep):
 *
 *   • AnimatedText  → `themegoods-animated-text transition-bottom`
 *                     Words (or lines) slide up from below behind a clipped
 *                     mask, staggered, on scroll-into-view.
 *   • Reveal        → `hoteller_ext_is_smoove`
 *                     Fade + translate-up entrance, tunable delay/duration.
 *   • StaggerGroup  → orchestrates a sequence of `<StaggerItem/>` children.
 *   • ScrollParallax → `hoteller_ext_is_scrollme` (translateY: -120px)
 *                     Scroll-linked Y drift relative to viewport progress.
 *   • HeroFadeOut   → `hoteller_ext_is_fadeout_animation` (direction: up)
 *                     Hero content drifts up + fades as the viewport scrolls
 *                     past the top of the page.
 *   • ImageReveal   → gentle scale-in + clip-path mask reveal from the bottom.
 *
 * All components respect prefers-reduced-motion (framer-motion handles it
 * natively; we also bail out of scroll-linked transforms on that preference).
 */

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionProps,
  type Transition,
  type UseInViewOptions,
} from "framer-motion";
import {
  Fragment,
  type ElementType,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Shared easing — matches Hoteller's smooth "power3.out" feel.              */
/* -------------------------------------------------------------------------- */

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/**
 * `useReducedMotion()` can be unknown on the server and resolve differently on
 * the client, which would swap `<div>` vs `motion.*` and change `AnimatedText`
 * structure — classic hydration failure. We keep SSR + the first client paint
 * on the static branch, then enable motion after mount.
 */
function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}

const DEFAULT_VIEW_OPTS: UseInViewOptions = { once: true, amount: 0.35 };

/* -------------------------------------------------------------------------- */
/*  AnimatedText — word/line stagger slide-up (Hoteller "transition-bottom")  */
/* -------------------------------------------------------------------------- */

type AnimatedTextProps = {
  text: string;
  className?: string;
  as?: ElementType;
  /** Split unit. Words look best for headlines; lines for long paragraphs. */
  mode?: "word" | "line";
  /** Seconds before the first unit starts. */
  delay?: number;
  /** Seconds between units. */
  stagger?: number;
  /** Duration per unit. */
  duration?: number;
  /** How much the mask reveals — 0.35 = 35% into the viewport. */
  amount?: number;
};

/**
 * Splits text into words (or lines), wraps each in an overflow-clipped
 * inline-block, and animates a motion child from translateY(110%) → 0.
 *
 * Intentionally accepts a plain string (not ReactNode) — mirrors Hoteller's
 * widget which works on pre-formatted heading text.
 */
export function AnimatedText({
  text,
  className,
  as: Tag = "span",
  mode = "word",
  delay = 0,
  stagger = 0.05,
  duration = 0.8,
  amount,
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, {
    ...DEFAULT_VIEW_OPTS,
    ...(amount !== undefined ? { amount } : {}),
  });
  const reduce = useReducedMotion();
  const clientReady = useClientReady();

  const units =
    mode === "line"
      ? text.split(/\n/).filter((s) => s.length > 0)
      : text.split(" ");

  if (!clientReady || reduce) {
    return (
      <Tag className={className} ref={ref}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      ref={ref as React.Ref<HTMLSpanElement>}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <Fragment key={`${unit}-${i}`}>
          <span
            className="inline-block overflow-hidden align-bottom pb-[0.14em]"
            aria-hidden="true"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : { y: "110%" }}
              transition={{
                duration,
                ease: EASE_OUT_EXPO,
                delay: delay + i * stagger,
              }}
            >
              {unit}
            </motion.span>
          </span>
          {mode === "word" && i < units.length - 1 ? " " : null}
          {mode === "line" && i < units.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reveal — Hoteller "smoove" fade + translate-up entrance                   */
/* -------------------------------------------------------------------------- */

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  duration?: number;
  /** Translate distance in pixels. Default 28 reads like Hoteller's default. */
  offsetY?: number;
  amount?: number;
};

export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  duration = 1.0,
  offsetY = 28,
  amount,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    ...DEFAULT_VIEW_OPTS,
    ...(amount !== undefined ? { amount } : {}),
  });
  const reduce = useReducedMotion();

  const initial = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: offsetY };
  const animate = inView || reduce ? { opacity: 1, y: 0 } : initial;

  const MotionTag = motion.create(Tag as ElementType) as React.ComponentType<
    MotionProps & { className?: string; ref?: React.Ref<HTMLElement> }
  >;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* -------------------------------------------------------------------------- */
/*  StaggerGroup / StaggerItem — orchestrated multi-child reveal              */
/* -------------------------------------------------------------------------- */

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Per-child stagger in seconds. */
  stagger?: number;
  duration?: number;
  offsetY?: number;
  amount?: number;
};

type StaggerContextValue = {
  offsetY: number;
  transition: Transition;
};

const StaggerContext = createContext<StaggerContextValue>({
  offsetY: 24,
  transition: { duration: 1.0, ease: EASE_OUT_EXPO },
});

export function StaggerGroup({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger = 0.08,
  duration = 1.0,
  offsetY = 24,
  amount,
}: StaggerGroupProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    ...DEFAULT_VIEW_OPTS,
    ...(amount !== undefined ? { amount } : {}),
  });
  const reduce = useReducedMotion();
  const ctxValue: StaggerContextValue = {
    offsetY,
    transition: { duration, ease: EASE_OUT_EXPO },
  };

  const parent = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: reduce ? 0 : stagger,
      },
    },
  };

  const MotionTag = motion.create(Tag as ElementType) as React.ComponentType<
    MotionProps & { className?: string; ref?: React.Ref<HTMLElement> }
  >;

  return (
    <StaggerContext.Provider value={ctxValue}>
      <MotionTag
        ref={ref}
        className={className}
        variants={parent}
        initial="hidden"
        animate={inView || reduce ? "show" : "hidden"}
      >
        {children}
      </MotionTag>
    </StaggerContext.Provider>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Optional per-item override. */
  offsetY?: number;
};

export function StaggerItem({
  children,
  className,
  as: Tag = "div",
  offsetY,
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  const { offsetY: ctxOffsetY, transition } = useContext(StaggerContext);
  const y = offsetY ?? ctxOffsetY;

  const child = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition },
      };

  const MotionTag = motion.create(Tag as ElementType) as React.ComponentType<
    MotionProps & { className?: string }
  >;

  return (
    <MotionTag className={className} variants={child}>
      {children}
    </MotionTag>
  );
}

/* -------------------------------------------------------------------------- */
/*  ScrollParallax — Hoteller "scrollme" translateY on scroll progress        */
/* -------------------------------------------------------------------------- */

type ScrollParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Total Y travel across the element's scroll range. Negative = rise. */
  y?: number;
  /**
   * What the progress window is. Framer-motion scroll offset strings.
   * Default: element enters ("start end") → leaves ("end start").
   */
  offset?: [string, string];
};

export function ScrollParallax({
  children,
  className,
  y = -80,
  offset = ["start end", "end start"],
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const clientReady = useClientReady();

  // `offset` is lightly typed in framer-motion; cast is local and safe.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as unknown as never,
  });

  const travel = useTransform(scrollYProgress, [0, 1], [-y / 2, y / 2]);

  if (!clientReady || reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y: travel }}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HeroFadeOut — hero content fades + rises away as you scroll past          */
/* -------------------------------------------------------------------------- */

type HeroFadeOutProps = {
  children: ReactNode;
  className?: string;
  /** Pixels of rise at fully scrolled. */
  rise?: number;
};

export function HeroFadeOut({
  children,
  className,
  rise = 120,
}: HeroFadeOutProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const clientReady = useClientReady();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"] as unknown as never,
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -rise]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);

  if (!clientReady || reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ImageReveal — clip-path mask + subtle scale entrance                      */
/* -------------------------------------------------------------------------- */

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to settle. */
  duration?: number;
  /** Initial start scale, eases to 1. */
  from?: number;
  /** Mask direction. Default "up" (reveal from bottom → top). */
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  amount?: number;
};

const CLIP_FROM: Record<NonNullable<ImageRevealProps["direction"]>, string> = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

const CLIP_TO = "inset(0 0 0 0)";

export function ImageReveal({
  children,
  className,
  duration = 1.2,
  from = 1.08,
  direction = "up",
  delay = 0,
  amount,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    ...DEFAULT_VIEW_OPTS,
    ...(amount !== undefined ? { amount } : {}),
  });
  const reduce = useReducedMotion();
  const clientReady = useClientReady();

  if (!clientReady || reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: "clip-path, transform" }}
      initial={{ clipPath: CLIP_FROM[direction], scale: from }}
      animate={
        inView
          ? { clipPath: CLIP_TO, scale: 1 }
          : { clipPath: CLIP_FROM[direction], scale: from }
      }
      transition={{ duration, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Re-exports for convenience when someone wants the raw motion primitive    */
/* -------------------------------------------------------------------------- */

export { AnimatePresence, motion };
