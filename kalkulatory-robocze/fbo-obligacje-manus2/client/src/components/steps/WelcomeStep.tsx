/**
 * WelcomeStep - "Ścieżka Decyzji" landing
 * Design: Warm, inviting, no jargon. Hero with generated illustration.
 * Sets the tone: "We're here to help you understand, not sell you anything."
 */
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Eye, Scale, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onStart: () => void;
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.92_0.06_85)_0%,_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.92_0.04_165)_0%,_transparent_40%)] pointer-events-none" />

      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A1F36] flex items-center justify-center">
              <span className="text-white font-bold text-sm">FBO</span>
            </div>
            <span className="text-sm font-medium text-[#1A1F36]/50">Finanse Bardzo Osobiste</span>
          </div>
          <span className="text-xs text-[#1A1F36]/30 hidden sm:block">Dane aktualne na marzec 2026</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8A838]/10 text-[#B07D1A] text-xs font-semibold mb-6 tracking-wide">
                <Shield className="w-3.5 h-3.5" />
                NARZĘDZIE EDUKACYJNE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#1A1F36] leading-[1.08] tracking-tight mb-5">
                Gdzie ulokować
                <br />
                <span className="bg-gradient-to-r from-[#E8A838] to-[#D4952E] bg-clip-text text-transparent">oszczędności?</span>
              </h1>

              <p className="text-lg text-[#1A1F36]/60 leading-relaxed mb-8 max-w-lg">
                Lokata, konto oszczędnościowe, obligacje skarbowe - co lepiej ochroni Twoje pieniądze? 
                Odpowiedz na <strong className="text-[#1A1F36]/80">3 proste pytania</strong> i porównaj opcje.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <Button
                  onClick={onStart}
                  size="lg"
                  className="bg-[#1A1F36] hover:bg-[#1A1F36]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#1A1F36]/15 transition-all hover:shadow-xl hover:shadow-[#1A1F36]/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Zacznij porównanie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <span className="flex items-center gap-1.5 text-sm text-[#1A1F36]/35">
                  <Clock className="w-3.5 h-3.5" />
                  Zajmie Ci to 30 sekund
                </span>
              </div>

              <p className="text-xs text-[#1A1F36]/30">
                Nie zbieramy żadnych danych. Wszystko działa w Twojej przeglądarce.
              </p>
            </motion.div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#E8A838]/5 to-[#D4E8E0]/20 rounded-3xl blur-xl" />
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663053381342/2cykrWxngA6ev8Ck5syj7Q/hero-bg-mZsAnRfsnYrrQSVTc5PPut.webp"
                  alt="Ilustracja przedstawiająca wzrost oszczędności"
                  className="w-full rounded-2xl relative shadow-lg shadow-[#1A1F36]/5"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
              </div>
            </motion.div>
          </div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14 lg:mt-20 pb-10"
          >
            <div className="grid sm:grid-cols-3 gap-5 max-w-3xl">
              <TrustSignal
                icon={<Scale className="w-4.5 h-4.5 text-[#2D6A4F]" />}
                iconBg="bg-[#D4E8E0]/50"
                title="Uczciwe porównanie"
                description="Jeśli lokata wygrywa - pokażemy to"
              />
              <TrustSignal
                icon={<Eye className="w-4.5 h-4.5 text-[#B07D1A]" />}
                iconBg="bg-[#E8A838]/10"
                title="Bez żargonu"
                description="Wszystko wyjaśnione po ludzku"
              />
              <TrustSignal
                icon={<Shield className="w-4.5 h-4.5 text-[#1A1F36]/50" />}
                iconBg="bg-[#1A1F36]/5"
                title="Ty decydujesz"
                description="Pokazujemy fakty, nie namawiamy"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function TrustSignal({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-[#1A1F36] text-sm">{title}</p>
        <p className="text-sm text-[#1A1F36]/40 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
