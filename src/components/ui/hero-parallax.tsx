"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  const t = useTranslations("home.hero");

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div
          className="h-[120%] w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-tea-hills.png')",
            backgroundPosition: "center 40%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-surface" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center justify-center px-4"
      >
        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl font-bold text-white md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xl text-white/90 md:text-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <a
              href="#products"
              className="rounded-full bg-primary px-8 py-4 text-lg font-medium text-on-primary shadow-elevation-2 transition-all hover:shadow-elevation-4"
            >
              {t("cta.primary")}
            </a>
            <a
              href="#story"
              className="rounded-full border-2 border-white/80 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {t("cta.secondary")}
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/80"
        >
          <span className="text-sm">{t("scroll")}</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
