/**
 * Top Navigation Bar
 * Design: "Forteca Finansowa" – minimal sticky header with brand and link to FBO
 */

import { Shield } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/40">
      <div className="container h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Kalkulator Obligacji
          </span>
        </div>
        <a
          href="https://marciniwuc.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Finanse Bardzo Osobiste →
        </a>
      </div>
    </nav>
  );
}
