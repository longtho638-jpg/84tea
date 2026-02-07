"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingContact() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className="fixed bottom-6 right-6 z-40 hidden md:block"
    >
      <a
        href="https://zalo.me/84988030204"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-elevation-4 transition-all hover:scale-110 hover:shadow-elevation-5"
        aria-label="Chat on Zalo"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </motion.div>
  );
}
