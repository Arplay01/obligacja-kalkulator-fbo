import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-extrabold text-[#1A1F36]/10 mb-4">404</p>
        <h1 className="text-xl font-bold text-[#1A1F36] mb-2">Strona nie istnieje</h1>
        <p className="text-sm text-[#1A1F36]/50 mb-8">
          Nie znale\u017Ali\u015Bmy strony, kt\u00F3rej szukasz. Wr\u00F3\u0107 do por\u00F3wnania obligacji.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-[#1A1F36] hover:bg-[#1A1F36]/90 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wr\u00F3\u0107 na stron\u0119 g\u0142\u00F3wn\u0105
        </Button>
      </div>
    </div>
  );
}
