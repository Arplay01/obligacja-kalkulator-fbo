# Kalkulator obligacji skarbowych — PoC dla FBO

Repo zawiera proof of concept kalkulatora obligacji skarbowych przygotowywanego jako artefakt rekrutacyjny pod rolę Product Managera w Finanse Bardzo Osobiste.

To nie jest jeszcze finalna aplikacja. Na tym etapie repo ma przede wszystkim pokazać:

- sposób myślenia produktowego,
- pracę z AI i agentami,
- rozdzielenie source-of-truth od promptów do prototypowania,
- podejście do UX dla osoby początkującej.

## Co jest najważniejsze

- `docs/project-context.md` — krótki kontekst projektu i decyzje bazowe.
- `docs/product/brief.md` — problem, segment, hipotezy i zakres PoC.
- `docs/product/prd.md` — zachowanie produktu i struktura ekranu.
- `docs/product/calculation-spec.md` — logika obliczeń i uproszczenia PoC.
- `docs/product/source-of-truth.md` — źródła danych, polityka aktualizacji i walidacji.
- `docs/process/portfolio-integration.md` — kontrakt integracyjny dla wersji osadzanej w portfolio przez `iframe`.
- `docs/product/prototype-brief.md` — jedyny właściwy input do szybkiego prototypowania.
- `docs/product/prototype-review-rubric.md` — rubryka oceny wygenerowanych kierunków.

## Ważne zasady

- `PRD` nie jest promptem do generowania prototypów.
- Do eksploracji UI używamy `prototype-brief.md`, nie pełnej dokumentacji produktu.
- Dane obligacji w PoC aktualizujemy ręcznie, z datą aktualizacji i jawnie wskazanym źródłem.
- Excel Marcina pozostaje artefaktem referencyjnym i walidacyjnym dla bardziej zaawansowanej logiki.

## Co nie jest kanoniczne

- `kalkulatory-robocze/` — wcześniejsze szybkie prototypy i szkice. Mogą inspirować, ale nie są source-of-truth dla produktu ani implementacji.
- długie promptowe artefakty robocze — traktujemy je jako materiał procesu, nie jako dokumentację produktu.

## Aktualny kierunek projektu

- segment docelowy PoC: początkujący użytkownik FBO,
- teza produktowa: prosty webowy kalkulator dla Segmentu A + Excel jako narzędzie dla zaawansowanych,
- kierunek wizualny: FBO-adjacent, ale nie kopia 1:1,
- stack domyślny: Next.js, TypeScript, Tailwind, Recharts, Vercel, z możliwością świadomych wyjątków.
