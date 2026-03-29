# Project Context

To repo dokumentuje proof of concept kalkulatora obligacji skarbowych dla Finanse Bardzo Osobiste i proces dojścia do jego obecnej formy.

## Obecny stan projektu

- aktualnym source of truth dla UI, UX, copy i zachowania jest działająca aplikacja `Next.js` w `app/` i `src/features/calculator/`,
- obecne `brief` i `PRD` opisują już finalny kierunek produktu po iteracjach wykonanych bezpośrednio w aplikacji,
- repo nie jest już prostym rewrite'em prototypu 1:1 - część najważniejszych decyzji zapadła już po wdrożeniu do `Next.js`,
- obecny prototyp zostaje w repo wyłącznie jako historyczna referencja procesu i punkt porównania,
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

1. `app/` i `src/features/calculator/` - realne zachowanie produktu, UI, UX i copy.
2. `docs/product/prd.md` - finalny opis flow i interakcji.
3. `docs/product/brief.md` - finalne założenia produktu.
4. `docs/process/decision-log.md` - trwałe decyzje produktowe, UX i UI.
5. `docs/process/portfolio-integration.md` - kontrakt osadzenia w portfolio.
6. `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/` - historyczna referencja procesu.
7. `@archiwum/` - historyczne dokumenty i starsze założenia, które mogą być przydatne tylko jako materiał procesu.

Jeśli historyczny dokument albo prototyp rozjeżdża się z obecną aplikacją w obszarze UI, UX, copy albo kolejności doświadczenia, wygrywa aktualna implementacja `Next.js`.

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

Kolejne iteracje powinny wychodzić z aktualnej aplikacji `Next.js`, a nie z wcześniejszych prototypów. Referencyjny prototyp zostaje tylko jako punkt porównania dla procesu i historii zmian.
