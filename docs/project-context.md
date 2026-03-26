# Project Context

To repo dokumentuje proof of concept kalkulatora obligacji skarbowych dla Finanse Bardzo Osobiste i proces dojścia do jego obecnej formy.

## Obecny stan projektu

- aktualnym source of truth dla UI, UX, copy i zachowania jest `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/`,
- obecne `brief` i `PRD` opisują już finalny kierunek, a nie pierwotny plan,
- rewrite 1:1 do `Next.js + TypeScript` jest już wdrożony w rootowej aplikacji,
- obecny prototyp zostaje w repo jako referencja dla produkcyjnej implementacji,
- `@archiwum/` zawiera tylko historyczne materiały, bez roli aktywnego kontekstu.

## Jaki problem rozwiązujemy

To nie jest projekt o porównywaniu obligacji dla samego porównywania.

Sedno problemu jest takie:

- pieniądze trzymane bez ruchu tracą wartość,
- początkujący użytkownik nie wie, co może z nimi zrobić poza lokatą lub kontem,
- obligacje brzmią sensownie, ale wejście w temat jest trudne,
- potrzeba prostoty, spokoju i aktywacji, a nie ciężkiego narzędzia eksperckiego.

## Dla kogo budowany jest ten PoC

- Segment docelowy: początkujący użytkownik FBO, który chce zrozumieć podstawowe opcje i zrobić pierwszy krok.
- Segment zaawansowany: dalej obsługiwany przez istniejący arkusz Excel.

## Najważniejsze decyzje bazowe

- Kierunek produktu: answer-first, prosty wynik najpierw, szczegóły później.
- Kierunek wizualny: FBO-adjacent, ale nie kopia 1:1.
- Główny nośnik wartości: prostota, koszt bezruchu, porównanie do znanych punktów odniesienia i czytelny next step.
- Finalny model osadzenia: `/kalkulator` wewnątrz portfolio, w `iframe`, na tym samym originie.
- Tone of voice: edukacyjny, uczciwy, bez tonu sprzedażowego.
- Repo publiczne ma pokazywać gotowy produkt i wybrany ślad procesu, a nie pełen warsztat iteracji.

## Hierarchia source of truth

1. `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/` - UI, UX, copy i zachowanie.
2. `docs/product/brief.md` - finalne założenia produktu.
3. `docs/product/prd.md` - finalny opis flow i interakcji.
4. `docs/process/portfolio-integration.md` - kontrakt osadzenia w portfolio.
5. `@archiwum/` - historyczne dokumenty i starsze założenia, które mogą być przydatne tylko jako materiał procesu.

Jeśli historyczny dokument rozjeżdża się z obecnym prototypem w obszarze UI, UX, copy albo kolejności doświadczenia, wygrywa aktualny prototyp.

## Routing dokumentów

- `README.md` - wejście do całego case study.
- `docs/product/brief.md` - problem, odbiorca i finalna teza produktu.
- `docs/product/prd.md` - aktualny produkt krok po kroku.
- `docs/process/decision-log.md` - najważniejsze decyzje w kolejności.
- `docs/process/pivot.md` - zmiana kierunku od pierwszego pomysłu do obecnego rozwiązania.
- `docs/process/prototyping-notes.md` - screeny i przebieg iteracji.
- `docs/process/process-patterns.md` - patterny pracy i iteracji.
- `docs/process/portfolio-integration.md` - docelowy model osadzenia.

## Zasada operacyjna

Kolejne iteracje powinny wychodzić już z aktualnej aplikacji `Next.js`, a nie z wcześniejszych prototypów. Referencyjny prototyp 1:1 zostaje tylko jako punkt porównania dla UI, UX i copy.
