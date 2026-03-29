# PRD - obecny produkt kalkulatora obligacji FBO

## Cel dokumentu

Ten dokument opisuje aktualny produkt tak, jak działa w aplikacji `Next.js` pod `/kalkulator`. Jest source of truth dla flow, hierarchii informacji i interakcji, a starszy prototyp pozostaje jedynie historyczną referencją procesu.

## Użytkownik i główne zadanie

- Użytkownik: początkująca osoba z ekosystemu FBO.
- Główne zadanie: zrozumieć, co można zrobić z pieniędzmi poza biernym trzymaniem ich na lokacie albo koncie i jak zrobić pierwszy krok.
- Główna emocja do zaadresowania: niepewność przed wejściem w obligacje.

## Zasady doświadczenia

- Jeden ekran.
- Desktop-first z pełnym wsparciem mobile.
- Brak przycisku `oblicz`.
- Wynik pojawia się od razu i aktualizuje się live.
- Najpierw odpowiedź, potem mechanika.
- Szczegóły są schowane, ale łatwo dostępne.
- Copy ma tłumaczyć, a nie imponować wiedzą.

## Struktura ekranu

### 1. Intro

Góra ekranu zawiera:

- prostą obietnicę wartości,
- krótką notę o porównaniu z lokatą i kontem.

Intro ma być krótkie i nie może spychać wyniku poniżej pierwszego widoku na desktopie.

### 2. Lewa kolumna - parametry

Lewa kolumna zawiera:

- wybór czasu odkładania pieniędzy, z serią obligacji pokazaną jako druga warstwa informacji,
- ręczny wpis kwoty,
- presetowe kwoty,
- nieliniowy suwak do szybkiej zmiany kwoty,
- scenariusze inflacji opisane prostym językiem,
- rozwijaną sekcję `Więcej opcji`.

### 3. Więcej opcji

Sekcja zaawansowana zawiera:

- toggle `Konto IKE`,
- oprocentowanie lokaty,
- oprocentowanie konta oszczędnościowego,
- stopę referencyjną NBP,
- własną inflację.

Każde pole działa live. Użytkownik może wpisywać wartości ręcznie albo zmieniać je przyciskami `-` i `+`.

### 4. Prawa kolumna - wynik

Prawa kolumna pokazuje:

- nazwę wybranej serii,
- krótki opis mechaniki serii,
- badge typu oprocentowania,
- hero `Szacowany zysk netto`,
- `Na koniec`,
- `Średnio / rok`.

To jest główna odpowiedź produktu i najważniejszy punkt uwagi.

### 5. Koszt bezruchu

Bezpośrednio pod hero znajduje się krótkie zdanie typu `W praktyce`, które łączy wynik obligacji z kosztem bezruchu.

Jego zadaniem jest:

- pokazać utratę siły nabywczej,
- zbudować emocjonalny sens działania,
- osadzić wynik w codziennym języku, nie tylko w finansowych liczbach.

### 6. Szczegóły kalkulacji

Sekcja `Pokaż szczegóły kalkulacji` jest disclosure.

Domyślnie nie dominuje ekranu. Po rozwinięciu pokazuje:

- wpłaconą kwotę,
- odsetki brutto,
- podatek Belki,
- efektywny wynik roczny.

Trudniejsze pojęcia są wyjaśniane lokalnymi tooltipami.

### 7. Porównanie z lokatą i kontem

Sekcja `Porównaj z lokatą i kontem` pokazuje dwa znane punkty odniesienia:

- lokatę,
- konto oszczędnościowe.

Pokazuje wynik netto, łączną wartość oraz krótką interpretację różnicy wobec wybranej obligacji. Sekcja jest domyślnie rozwinięta, ale użytkownik może ją zwinąć.

### 8. Następny krok

Sekcja `Jak kupić?` ma zamienić zrozumienie w działanie.

Zawiera:

- krótki opis wyzwania mailowego,
- jedno wyraźne CTA prowadzące dalej.

### 9. Głębsze warstwy edukacyjne

Sekcja `Jeśli chcesz wejść głębiej` zawiera disclosure z dodatkowymi warstwami:

- czym są obligacje i dlaczego to sensowny pierwszy krok,
- jak działa wybrana seria,
- wykres i tabela rok po roku,
- kiedy obligacje, a kiedy lokata.

To jest warstwa edukacyjna, a nie rdzeń głównej decyzji.

### 10. Więcej materiałów

Na dole znajdują się trzy ścieżki:

- artykuł edukacyjny,
- kalkulator Excel dla zaawansowanych,
- powrót do portfolio.

Karta `Wróć do portfolio` ma specjalny status. W wersji osadzonej ma prowadzić do zamknięcia layera, a nie być zwykłym linkiem na zewnątrz.

### 11. Trust footer

Na końcu ekranu użytkownik dostaje:

- disclaimer edukacyjny,
- datę aktualizacji danych,
- disclosure z uproszczeniami symulacji.

## Zachowanie i interakcje

- Zmiana dowolnego inputu aktualizuje wynik bez przeładowania ekranu.
- Zmiana wybranego czasu i serii aktualizuje hero, opis produktu, badge, teksty edukacyjne, porównanie i tabelę.
- Kwota może być wpisywana ręcznie i formatowana w locie.
- Suwak ma wspierać szybkie ustawianie popularnych kwot, ale nie ogranicza ręcznego wpisu większych wartości.
- `IKE` wpływa tylko na obligacje, nie na lokatę i konto.
- Tooltips pojawiają się lokalnie przy trudniejszych pojęciach.
- Mobile ma układać ekran w jednej kolumnie, a najważniejszy wynik pozostaje dostępny także w fixowanym docku.

## Najważniejsze reguły UX

- Zero przycisku `oblicz`.
- Wynik ma być widoczny od razu.
- Szczegóły mają być schowane, jeśli nie są potrzebne do pierwszej decyzji.
- Trudne pojęcia tłumaczymy tam, gdzie pojawia się opór.
- Użytkownik najpierw dostaje odpowiedź, potem mechanikę.
- Porównanie z lokatą i kontem wspiera decyzję, ale nie zamienia produktu w ranking.
- CTA zakupowe ma pojawić się dopiero po zbudowaniu sensu wyniku.

## Poza zakresem obecnego PoC

- wykres jako główna warstwa produktu,
- chart-first comparator,
- eksperckie porównywanie wszystkich scenariuszy,
- pełna logika Excela 1:1,
- regularne wpłaty, portfele i bardziej zaawansowane strategie,
- porównania z ETF-ami, akcjami i innymi klasami aktywów,
- perswazyjne etykiety typu `najlepsze`, `wygrywa`, `kup teraz`.

## Acceptance criteria

- Po wejściu na ekran użytkownik rozumie, co narzędzie robi i czego może się po nim spodziewać.
- Wybrany czas i seria, kwota, inflacja i opcje zaawansowane wpływają na wynik live.
- Hero wynik netto jest najważniejszą warstwą wyniku.
- Most narracyjny o koszcie bezruchu pojawia się bezpośrednio pod hero.
- Szczegóły kalkulacji i głębsze warstwy edukacyjne nie przeciążają pierwszego widoku.
- Produkt prowadzi od zrozumienia do kolejnego kroku bez zmuszania użytkownika do studiowania pełnej mechaniki.
