# Portfolio Integration Contract

## Po co istnieje ten plik

Ten dokument zapisuje wymagania integracyjne dla finalnej wersji rekrutacyjnego PoC. Repo pozostaje kanonicznym źródłem produktu i logiki, ale docelowy kalkulator ma być osadzony wewnątrz strony portfolio.

## Docelowy model osadzenia

- kalkulator działa w tym samym projekcie `Next.js` co portfolio,
- ścieżka docelowa: `app/kalkulator/page.tsx`,
- kalkulator jest otwierany w modalnym oknie `shadcn Dialog`,
- portfolio osadza kalkulator jako `iframe` z `src="/kalkulator"`,
- modal ma rozmiar `95vw` szerokości i `85vh` wysokości.

To oznacza, że ekran kalkulatora nie powinien zakładać, że jest pełną stroną serwisu otwieraną w osobnej karcie na desktopie.

## Priorytet doświadczenia rekrutacyjnego

Ten PoC istnieje na potrzeby rekrutacji i ma wzmacniać odbiór portfolio, a nie działać jak osobny produkt akwizycji.

- priorytetem jest maksymalnie dobry UX i UI w kontekście przeglądania portfolio,
- kalkulator ma utrzymywać użytkownika w tym samym flow eksploracji case study i załączników,
- nie otwieramy zewnętrznych kart przeglądarki jako części głównej ścieżki doświadczenia,
- jeśli użytkownik przechodzi do kolejnych materiałów, powinno to dziać się w tym samym kontekście produktu portfolio, nie przez wybijanie go poza doświadczenie.

## Wymagania implementacyjne

### Zgodność z `iframe`

- strona `/kalkulator` musi działać poprawnie wewnątrz `iframe`,
- nie wolno dodawać przekierowań, które wyrywają użytkownika z tej ścieżki,
- nie wolno zwracać nagłówka `X-Frame-Options: DENY` dla tej trasy,
- jeśli aplikacja używa polityk nagłówków globalnych, `/kalkulator` musi pozostać osadzalne w tym samym originie,
- kalkulator nie komunikuje się z rodzicem i nie używa `window.top` ani `window.parent`.

### Layout i przewijanie

- layout musi wypełniać dostępną przestrzeń kontenera: `100%` szerokości i `100%` wysokości,
- nie zakładamy stałych wymiarów viewportu ani pełnoekranowego okna przeglądarki,
- strona musi być responsywna w ograniczonej przestrzeni modala,
- własny scroll kalkulatora jest dozwolony; `iframe` obsłuży przewijanie.

### Architektura wdrożeniowa

- kalkulator nie jest osobnym serwerem ani osobną aplikacją,
- wdrożenie ma korzystać z App Routera w tym samym repozytorium portfolio,
- jeśli pojawi się osobny layout dla `/kalkulator`, powinien być lekki i podporządkowany osadzeniu w modalu.
- decyzje nawigacyjne i CTA powinny wspierać model "zostań na miejscu" zamiast odsyłania do nowych kart.

## Wskazówki dla implementacji Next.js

- traktuj `/kalkulator` jak niezależny ekran osadzany, a nie fragment zależny od strony głównej portfolio,
- unikaj elementów layoutu, które wymagają wysokości typu "pełny ekran przeglądarki" bez fallbacku na wysokość kontenera,
- jeśli w projekcie pojawi się globalna konfiguracja `headers`, sprawdź ją także pod kątem tej konkretnej trasy,
- nie buduj zależności od API rodzica, `postMessage` ani synchronizacji stanu z modalem.

## Kryteria akceptacji

- otwarcie modala z `iframe src="/kalkulator"` renderuje działający ekran bez błędów osadzenia,
- zawartość dopasowuje się do `95vw` x `85vh` bez ucinania kluczowego układu przez sztywne wymiary,
- użytkownik może przewijać treść kalkulatora, jeśli wysokość wyniku przekracza przestrzeń modala,
- trasa `/kalkulator` nie wymaga komunikacji z rodzicem do działania,
- wdrożenie pozostaje w jednym projekcie `Next.js`,
- główna ścieżka kalkulatora i powiązanych materiałów nie otwiera zewnętrznych kart.
