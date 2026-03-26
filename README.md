# Kalkulator obligacji skarbowych dla FBO

To repo zawiera produkcyjną aplikację `Next.js + TypeScript` dla kalkulatora obligacji skarbowych w ramach rekrutacji na Product Managera w Finanse Bardzo Osobiste. Dodatkowo repo zawiera aktualną dokumentację procesu, który doprowadził do obecnego rozwiązania.

Aktualna implementacja jest wiernym rewrite'em 1:1 prototypu referencyjnego. Repo pokazuje dziś gotowy ekran, finalne decyzje produktowe i wybrany ślad procesu, bez warsztatowego szumu z wcześniejszych iteracji.

## Jaki problem rozwiązujemy

Punkt wyjścia nie brzmiał: "jak porównać wszystkie obligacje".

Punkt wyjścia był prostszy i bardziej ludzki:

- pieniądze tracą wartość,
- konto albo lokata są dla wielu osób domyślnym wyborem,
- obligacje brzmią sensownie, ale pierwszy krok budzi niepewność,
- użytkownik potrzebuje prostoty, zrozumienia i intencji działania, a nie eksperckiego narzędzia finansowego.

## Dla kogo jest ten produkt

Docelowym odbiorcą PoC jest początkująca osoba z ekosystemu FBO, która:

- nie zna mechaniki poszczególnych serii obligacji,
- nie chce finansowego żargonu,
- chce szybko zobaczyć sensowny scenariusz dla swoich pieniędzy,
- potrzebuje spokojnego wejścia, a nie rankingu zwycięzców.

## Do jakiego rozwiązania doszliśmy

Finalny kierunek to answer-first calculator:

- wybierasz serię obligacji,
- wpisujesz kwotę,
- od razu widzisz szacunkowy wynik netto,
- zaraz pod nim dostajesz koszt bezruchu,
- potem porównanie z lokatą i kontem,
- a na końcu prosty kolejny krok: jak kupić pierwszą obligację.

Kluczowy pivot polegał na przejściu z szerokiego porównywacza i bardziej analitycznego flow do prostszego narzędzia aktywacyjnego. Sednem produktu przestało być porównywanie obligacji samo w sobie. Zaczęło nim być uruchomienie decyzji.

## Co warto przeczytać

- [Project context](docs/project-context.md) - krótki kontekst projektu i obecny source of truth.
- [Brief](docs/product/brief.md) - finalne założenia produktu i dlaczego ten format wygrał.
- [PRD](docs/product/prd.md) - aktualny opis produktu zgodny z obecnym prototypem.
- [Decision log](docs/process/decision-log.md) - najważniejsze decyzje w kolejności.
- [Pivot](docs/process/pivot.md) - skąd startowaliśmy i gdzie jesteśmy teraz.
- [Proces iteracji i screeny](docs/process/prototyping-notes.md) - najważniejsze etapy pracy na artefaktach.
- [Patterny pracy](docs/process/process-patterns.md) - jak wyglądał proces iteracyjny od strony produktu, UX i UI.
- [Kontrakt integracyjny](docs/process/portfolio-integration.md) - jak ten ekran ma działać po osadzeniu w portfolio.

## Aktualny source of truth

Najważniejszym źródłem prawdy dla obecnego UI, UX, copy i zachowania jest:

- `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/`

Ten folder zostaje w repo jako referencja 1:1 dla produkcyjnej implementacji.

## Aktualny stan techniczny

- root repo jest aplikacją `Next.js + TypeScript`,
- docelowy ekran działa pod `/kalkulator`,
- `/` przekierowuje do `/kalkulator`,
- styling kalkulatora został przeniesiony z prototypu i ograniczony do subtree kalkulatora,
- logika kalkulacji jest wydzielona od warstwy UI i pokryta testami,
- w repo zostaje tylko finalny prototyp referencyjny, bez starszych roboczych wariantów.

## Struktura repo

- `app/` - routing i layout produkcyjnej aplikacji Next.js.
- `src/features/calculator/` - domena, logika, komponenty i style kalkulatora.
- `docs/` - aktualny kontekst produktu, PRD i zapis decyzji.
- `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/` - referencyjny prototyp 1:1 dla obecnego UI, UX i copy.
- `@archiwum/` - historyczne dokumenty i stare założenia, niekanoniczne.

## Uruchomienie

```bash
npm install
npm run dev
```

Najważniejsze komendy:

- `npm run dev` - lokalny development.
- `npm run build` - build produkcyjny.
- `npm run test` - testy jednostkowe i Playwright.
- `npm run test:visual:update` - aktualizacja snapshotów visual regression.

Starsze dokumenty domenowe i prototypowe zostały przeniesione do `@archiwum/`, żeby nie mieszały bieżącego kontekstu. Jeśli kiedyś będą jeszcze potrzebne, traktujemy je jako historyczny ślad procesu, a nie aktywny source of truth.

## AI-assisted workflow

Kod i duża część procesu powstały z pomocą Codex, Cursor, Claude.ai i Claude Code. AI było tutaj realnym narzędziem pracy: przyspieszało prototypowanie, iterację i porządkowanie kodu. Kierunek produktu, selekcja rozwiązań i korekta UX/UI pozostawały jednak świadomie prowadzone.
