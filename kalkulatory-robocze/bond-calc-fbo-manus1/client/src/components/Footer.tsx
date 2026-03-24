/**
 * Footer – Disclaimer, attribution, and data source
 * Design: "Forteca Finansowa" – minimal, clean, informative
 */

import { Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/10">
      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary/60" />
              <span className="text-sm font-semibold text-foreground/80">
                Kalkulator Obligacji Skarbowych
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Narzędzie edukacyjne dla osób zaczynających przygodę z inwestowaniem.
            </p>
          </div>

          {/* Disclaimer */}
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1.5">Zastrzeżenie</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kalkulator ma charakter informacyjny. Wyniki są przybliżone i zależą od
              przyjętych założeń. Przed inwestycją zapoznaj się z oficjalnymi warunkami
              na{" "}
              <a
                href="https://www.obligacjeskarbowe.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-0.5"
              >
                obligacjeskarbowe.pl
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              .
            </p>
          </div>

          {/* Data source */}
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1.5">Dane</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Oprocentowanie: marzec 2026. Źródło: Ministerstwo Finansów.
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Inspirowane blogiem{" "}
              <a
                href="https://marciniwuc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Finanse Bardzo Osobiste
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/30">
          <p className="text-[11px] text-muted-foreground/60 text-center">
            Nie jest to porada inwestycyjna. Inwestowanie wiąże się z ryzykiem.
          </p>
        </div>
      </div>
    </footer>
  );
}
