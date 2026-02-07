"use client";

import { motion, type Variants } from "framer-motion";

const animationVariants: Record<string, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

interface MotionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: keyof typeof animationVariants;
  /** Use viewport-based trigger instead of mount-based */
  whileInView?: boolean;
  /** Only animate once when scrolled into view */
  once?: boolean;
  duration?: number;
}

export function MotionWrapper({
  children,
  delay = 0,
  className,
  variant = "fade-up",
  whileInView = false,
  once = true,
  duration = 0.5,
}: MotionWrapperProps) {
  const variants = animationVariants[variant];

  if (whileInView) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        variants={variants}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
