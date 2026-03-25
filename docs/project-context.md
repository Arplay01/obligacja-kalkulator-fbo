# Project Context

To repo służy do zbudowania i udokumentowania proof of concept kalkulatora obligacji skarbowych dla Finanse Bardzo Osobiste.

## Po co istnieje to repo

- zbudować działający PoC kalkulatora jako artefakt portfolio,
- pokazać sposób pracy PM-a: od problem framingu, przez specyfikację, po prototyp,
- pracować AI-first, ale z jasnym rozdziałem między dokumentacją produktu a promptami do prototypowania.

## Jaki problem rozwiązujemy

PoC nie ma zastąpić rozbudowanego Excela Marcina 1:1. Ma pokazać prostsze webowe narzędzie dla osoby początkującej, która chce zrozumieć, co stanie się z jej pieniędzmi w czasie i jakie opcje ma do wyboru.

## Segment i decyzja scope'owa

- Segment docelowy PoC: początkujący użytkownik FBO, który nie zna typów obligacji i szuka spokoju, jasności i poczucia kontroli.
- Segment zaawansowany: dalej obsługiwany przez istniejący arkusz Excel.
- Założenie robocze repo: prosty kalkulator webowy + Excel dla zaawansowanych to lepszy kierunek niż jeden kompromisowy produkt.

## Decyzje bazowe

- Design direction: FBO-adjacent, ale bez kopiowania wizualnego 1:1.
- Stack policy: core stack z ogłoszenia jako domyślność (`Next.js`, `TypeScript`, `Tailwind`, `Recharts`, `Vercel`), z dopuszczalnymi wyjątkami, jeśli poprawiają jakość PoC.
- Final recruitment delivery mode: kalkulator ma docelowo działać jako trasa `/kalkulator` osadzana w `iframe` wewnątrz portfolio na tym samym originie.
- Recruitment UX policy: kalkulator ma wzmacniać flow przeglądania portfolio i załączników; nie projektujemy głównej ścieżki w oparciu o otwieranie zewnętrznych kart.
- Data policy: parametry obligacji aktualizowane ręcznie, z datą aktualizacji i jawnym wskazaniem źródeł.
- Tone of voice: edukacyjny, uczciwy, bez tonu sprzedażowego i bez FOMO.

## Routing dokumentów

- `README.md` — wejście dla człowieka.
- `docs/project-context.md` — cienki, kanoniczny kontekst dla kolejnych sesji.
- `docs/product/brief.md` — dlaczego budujemy ten produkt i dla kogo.
- `docs/product/prd.md` — co ma robić produkt.
- `docs/product/calculation-spec.md` — jak liczymy.
- `docs/product/source-of-truth.md` — skąd bierzemy dane i jak je odświeżamy.
- `docs/process/portfolio-integration.md` — kontrakt integracyjny dla wersji osadzanej w portfolio.
- `docs/product/prototype-brief.md` — jak zlecać rapid prototyping.
- `docs/product/prototype-review-rubric.md` — jak oceniać wygenerowane kierunki.

## Zasada operacyjna

`PRD` jest source-of-truth dla zachowania produktu, ale nie jest promptem do generowania PoC. Do prototypowania używamy osobnego `prototype-brief.md`.
