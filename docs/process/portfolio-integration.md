# Portfolio Integration Contract

## Po co istnieje ten plik

Ten dokument zapisuje docelowy kontrakt integracyjny dla wersji osadzanej w portfolio. Repo pozostaje źródłem produktu i logiki, ale finalny kalkulator ma działać wewnątrz doświadczenia portfolio, a nie obok niego.

## Docelowy model osadzenia

- kalkulator działa w tym samym projekcie `Next.js` co portfolio,
- ścieżka docelowa: `app/kalkulator/page.tsx`,
- portfolio otwiera kalkulator w modalnym layerze,
- zawartość jest renderowana wewnątrz `iframe` z `src="/kalkulator"`,
- modal ma rozmiar około `95vw` x `85vh`.

To oznacza, że ekran kalkulatora nie może zakładać pełnoekranowego kontekstu desktopowego ani osobnej aplikacji otwieranej w nowej karcie.

## Priorytet doświadczenia

Priorytetem jest utrzymanie użytkownika w tym samym flow case study i materiałów portfolio.

- kalkulator ma działać jak część historii produktu,
- główna ścieżka nie powinna wyrywać użytkownika poza portfolio,
- interakcje nawigacyjne powinny wspierać model `zostań na miejscu`,
- jeśli pojawia się wyjście na zewnątrz, musi być to świadoma ścieżka do materiału edukacyjnego albo narzędzia pomocniczego.

## Wymagania implementacyjne

### Zgodność z `iframe`

- trasa `/kalkulator` musi działać poprawnie wewnątrz `iframe`,
- nie wolno dodawać przekierowań, które rozwalają ten flow,
- nie wolno blokować osadzania nagłówkami typu `X-Frame-Options: DENY`,
- jeśli aplikacja ma globalne polityki nagłówków, `/kalkulator` musi pozostać osadzalne w tym samym originie.

### Komunikacja z layerem portfolio

Kalkulator nie powinien wymagać komunikacji z rodzicem do samego działania i liczenia wyników.

Jedyny wyjątek dotyczy CTA `Wróć do portfolio`:

- w wersji osadzonej CTA powinno najpierw próbować zamknąć bieżący layer,
- implementacja może użyć lokalnego close handlera albo `postMessage` do rodzica,
- jeśli żaden mechanizm zamknięcia nie jest dostępny, dozwolony jest fallback do sekcji kalkulatora w portfolio.

To jest świadoma decyzja produktowa. Użytkownik ma wrócić do kontekstu case study, a nie czuć, że "przeszedł na inną stronę".

### Layout i przewijanie

- layout musi wypełniać dostępny kontener, a nie zakładać pełny viewport,
- strona musi być responsywna w przestrzeni modala,
- własny scroll kalkulatora jest dozwolony,
- nie opieramy krytycznych decyzji layoutowych na sztywnych wymiarach okna przeglądarki.

### Linki i wyjścia z doświadczenia

- rdzeń kalkulatora ma utrzymywać użytkownika w portfolio,
- zewnętrzne linki edukacyjne są dozwolone jako świadome, pomocnicze wyjścia,
- nie należy budować głównej ścieżki działania w oparciu o serię nowych kart.

## Wskazówki dla rewrite do Next.js

- traktuj `/kalkulator` jak niezależny ekran osadzany, ale nie osobny produkt,
- zachowaj obecną hierarchię i flow 1:1 względem referencyjnego prototypu,
- logikę zamknięcia layera potraktuj jako kontrakt integracyjny, nie jako detal UI,
- jeśli pojawi się osobny layout dla `/kalkulator`, ma być lekki i podporządkowany osadzeniu.

## Kryteria akceptacji

- otwarcie modala z `iframe src="/kalkulator"` renderuje działający ekran bez błędów osadzenia,
- układ mieści się w `95vw` x `85vh` bez utraty kluczowej hierarchii,
- kalkulator działa samodzielnie także bez rodzica,
- CTA `Wróć do portfolio` potrafi zamknąć layer albo bezpiecznie wrócić do portfolio,
- główna ścieżka produktu pozostaje częścią doświadczenia portfolio, a nie osobną aplikacją.
