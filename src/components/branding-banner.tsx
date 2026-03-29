"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

export function BrandingBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-3 pt-8 pb-2"
    >
      <div className="h-px w-16 bg-border" />
      <p className="text-sm text-muted-foreground">
        Made in 🇮🇳 with ❤️ by{" "}
        <a
          href="https://mohitbagri-portfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          MOHIT BAGRI
        </a>
      </p>
      <a
        href="https://github.com/Mohit-Bagri/convert-kar"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground transition-all hover:border-yellow-500/50 hover:text-foreground hover:shadow-[0_0_12px_rgba(234,179,8,0.15)]"
      >
        <Star className="h-3.5 w-3.5 text-yellow-500 group-hover:fill-yellow-500 transition-colors" />
        Star on GitHub if you found this useful
      </a>
    </motion.div>
  );
}
