/**
 * Hero Section – Kalkulator Obligacji Skarbowych
 * Design: "Forteca Finansowa" – clean header with subtle financial background
 * Light background with dark text, abstract wave pattern
 */

import { motion } from "framer-motion";
import { Shield, TrendingUp, Calculator } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663053381342/F7rbjgGVKbYSQUzFVbwUqC/hero-bg-ne7iymKqJGh8oNuxvjNyEH.webp";

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden border-b border-border/40">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover object-center opacity-25"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-sky-50/60" />
      </div>

      <div className="container relative z-10 pt-8 pb-10 lg:pt-12 lg:pb-14">
        {/* Brand tag */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-5"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">
            Finanse Bardzo Osobiste
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]"
            >
              Kalkulator
              <br />
              <span className="text-primary">Obligacji</span>
              <span className="text-foreground"> Skarbowych</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Porównaj wszystkie typy obligacji i sprawdź, która opcja da Ci
              najlepszy zwrot przy Twoich założeniach.
            </motion.p>
          </div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-wrap gap-2 lg:flex-col lg:items-end"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border/50 text-xs text-muted-foreground backdrop-blur-sm">
              <Calculator className="w-3.5 h-3.5 text-primary/70" />
              <span>8 typów obligacji</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border/50 text-xs text-muted-foreground backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500/80" />
              <span>Porównanie z lokatą</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border/50 text-xs text-muted-foreground backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-amber-500/80" />
              <span>IKE / IKZE</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
