# Etap 2 - Polish UI & UX

## Cel tej iteracji

Dzisiejsza sesja była skupiona na dopracowaniu widoku `/porownaj` i domknięciu jego spójności z `/kalkulator`.
Zakres dotyczył jednocześnie:

- architektury layoutu,
- hierarchii informacji,
- copy dla początkującego odbiorcy,
- spójności wizualnej obu widoków,
- czytelności wykresu,
- oraz aktualizacji logiki finansowej do oferty obligacji z 15.04.2026.

Ta iteracja nie była "liftingiem UI", tylko świadomym uporządkowaniem produktu tak, żeby:

- łatwiej było zrozumieć wynik,
- łatwiej było podjąć pierwszą decyzję,
- a `/porownaj` i `/kalkulator` działały jak jeden spójny produkt.

## Najważniejsze decyzje produktowe i UX

### 1. `/porownaj` ma działać jak dashboard, a nie jak zwykła długa strona

Postanowiliśmy, że na szerokich viewportach:

- header razem z nawigacją `Obliczam / Porównuję` jest stale widoczny,
- lewa kolumna z kontrolkami jest stale widoczna,
- prawa kolumna jest głównym obszarem scrolla,
- treść prawej kolumny może chować się pod header,
- tablet portrait i mobile zostają przy prostszym, dokumentowym flow.

To była jedna z kluczowych decyzji całej sesji, bo zmieniła sposób korzystania z widoku `porownaj`.

### 2. Lewy panel ma być traktowany jako narzędzie robocze, a nie zwykła karta w treści

Postanowiliśmy, że:

- panel nie scrolluje się razem z prawą kolumną,
- scroll odbywa się tylko wewnątrz boxa,
- box ma zachować wyraźny odstęp od dolnej krawędzi okna,
- górny offset względem headera ma pozostać stabilny,
- szerokość lewej kolumny zostaje stała, a ewentualne zmiany przestrzeni robimy kosztem prawej kolumny.

### 3. `/porownaj` ma przejąć dojrzały język wizualny z `/kalkulator`

To była świadoma decyzja systemowa:

- tło lewej kolumny zostało spięte z kalkulatorem,
- kafelki wyboru obligacji w `porownaj` zostały ujednolicone z tymi z `/kalkulator`,
- badge typu `Indeksowane inflacją` i `Stałe oprocentowanie` mają działać dokładnie jak w kalkulatorze,
- wspólne komponenty i tokeny mają być źródłem prawdy dla obu widoków.

W praktyce oznacza to, że dalsze poprawki w jednym miejscu mogą zasilać oba widoki.

### 4. Wykres ma być najważniejszą sekcją po prawej stronie

Postanowiliśmy, że:

- wykres trafia na samą górę prawej kolumny,
- jest najmocniejszym elementem hierarchii,
- pozostałe sekcje pod nim mają go tłumaczyć, a nie z nim konkurować,
- tło wykresu ma być spójne z tłem strony,
- strona ma mieć jedno wspólne tło `#FEFDFD`.

### 5. Dla początkującego odbiorcy trzeba tłumaczyć nie tylko wynik, ale też koszt wysiłku

Bardzo ważna decyzja produktowa:

- sama liczba "decyzji" była zbyt abstrakcyjna,
- zamiast tego mówimy prostym językiem, ile razy trzeba wracać do tematu,
- tłumaczymy, że taki moment to zwykle sprawdzenie opcji, wybór odpowiedniej i często przelew pieniędzy,
- pokazujemy, że większa liczba takich momentów realnie utrudnia konsekwentne inwestowanie.

Ta sekcja została zaprojektowana pod użytkownika-amatora, który wcześniej raczej nie inwestował.

### 6. Copy w `porownaj` ma wyjaśniać wartość prostym językiem, bez żargonu

Zamiast suchych opisów instrumentów postanowiliśmy:

- zaczynać od wniosku i korzyści dla użytkownika,
- używać krótkich, zrozumiałych wyjaśnień,
- dopiero potem tłumaczyć mechanikę, jeśli jest potrzebna,
- unikać osobnych "dziwnych" komponentów, które psują hierarchię.

### 7. Na razie chowamy markery wcześniejszego wyjścia z samego wykresu

To była świadoma decyzja czytelności:

- ghost dots wcześniejszego wyjścia zniknęły z wykresu i z legendy,
- informacja została zachowana w tooltipie,
- temat zostaje do przyszłej iteracji, gdy znajdziemy czytelniejszy sposób pokazania tego na wykresie.

## Co wdrożyliśmy

### 1. Nowa architektura strony `/porownaj`

Wdrożony został szeroki shell dashboardowy:

- fixed header z nawigacją,
- fixed lewa kolumna,
- niezależny scroll prawej kolumny,
- pomiar wysokości headera i dynamiczne offsety,
- zachowanie desktop/tablet landscape inne niż tablet portrait/mobile.

Do tego dopracowaliśmy geometrię layoutu:

- większy lewy i prawy gutter strony,
- większy odstęp między lewą i prawą kolumną,
- header wyrównany do tego samego lewego odsunięcia co lewa kolumna,
- prawa kolumna zwężona kosztem większych marginesów i większego oddechu.

### 2. Dopracowanie lewego panelu

Wdrożyliśmy między innymi:

- usunięcie zbędnej małej kwoty pod `Ile chcesz zainwestować?`,
- usunięcie presetów czasu,
- poprawę presetów kwoty, żeby nie wyjeżdżały poza chipy,
- poprawę summary horyzontu, w tym prawdziwą spację i odmianę `rok / lata / lat`,
- mocniejszy, czytelniejszy podgląd liczby lat,
- większy lewy spacing całej kolumny,
- finalny kolor tła lewej kolumny: `#FAF7F2`.

### 3. Ujednolicenie z `/kalkulator`

Wdrożone zostały konkretne rzeczy systemowe:

- wspólny token tła lewej kolumny,
- wspólne style kafelków obligacji,
- wspólne badge dla instrumentów,
- wspólna sekcja CTA `Jak kupić pierwsze obligacje?`,
- wspólne źródło prawdy dla aktualnej oferty obligacji.

To była ważna decyzja architektoniczna: `porownaj` ma korzystać z dojrzałych elementów z `/kalkulator`, a nie budować lokalne warianty bez potrzeby.

### 4. Przebudowa wykresu i jego otoczenia

Wdrożenia:

- wykres trafił na początek prawej kolumny,
- tło wykresu zostało ujednolicone z tłem strony,
- końcówki linii zostały zaokrąglone,
- grubość linii została ujednolicona między seriami,
- poprawiona została czytelność i kolorystyka markerów,
- tooltip został rozbudowany o informację o wartości przed opłatą za wcześniejsze wyjście,
- w legendzie i helperach uprościliśmy komunikację, żeby nie przeciążać wykresu.

Jednocześnie zostawiliśmy świadomie tylko te elementy, które realnie pomagają odczytać wynik.

### 5. Nowy układ rekomendacji pod wykresem

Sekcja rekomendacji została całkowicie przeprojektowana.

Finalny kierunek:

- nie jest już ciężkim boxem wewnątrz wykresu,
- działa jako osobna sekcja pod wykresem,
- ma mocny wspólny nagłówek,
- pod nim są 3 kolumny:
  - dlaczego właśnie ta opcja,
  - co jeśli nic nie zrobisz,
  - dlaczego lokata przegrywa.

Ważne decyzje copy:

- rekomendacja jest pisana językiem korzyści i prostego wyjaśnienia,
- prawa kolumna tłumaczy utratę siły nabywczej prostym językiem,
- trzecia kolumna wyjaśnia, że lokata wymaga odnawiania i że podatek Belki spowalnia wzrost.

### 6. Smart suggestion pod wykresem

Zostawiliśmy i dopracowaliśmy tekst:

`Na X lat [instrument] daje X więcej od obecnie wybranych opcji.`

To rozwiązanie zostało uznane za trafione i pozostało bez zmiany merytorycznej.

Dodatkowo:

- CTA nie znika po aktywacji,
- zmienia się z `Włącz` na `Wyłącz`,
- cały komponent działa jak lekki helper tekstowy,
- kolorystyka została przesunięta w stronę zieleni, bo to pozytywna informacja.

### 7. Sekcja o wysiłku i liczbie powrotów do tematu

Ta sekcja została mocno dopracowana merytorycznie.

Finalnie:

- nie używa już ciężkiego, osobnego labela nad nagłówkiem,
- jest wizualnie bliżej sekcji rekomendacji wyżej,
- tłumaczy, że wynik to nie wszystko i liczy się też liczba powrotów do tematu,
- zamiast abstrakcyjnych "decyzji" używa prostszego języka,
- pokazuje przy każdej opcji, co to oznacza w praktyce.

Wprowadziliśmy też ważne doprecyzowania:

- helper pod nagłówkiem łączy informację czym jest taki moment decyzji i dlaczego ma znaczenie,
- COI dostało wprost wyjaśnienie, że odsetki wpadają co roku na konto i trzeba je reinwestować, jeśli mają dalej pracować,
- osobna podsekcja `Uwaga o COI` została usunięta.

### 8. Uproszczenie całej prawej kolumny

Wdrożone uproszczenia:

- usunięty został opis w headerze `Wpisz kwotę i horyzont - pokażemy Ci, która opcja daje najlepszy wynik.`,
- usunięta została sekcja `Wróć do prostego kalkulatora`,
- usunięte zostały zbędne boxy i obramowania tam, gdzie nie budowały wartości,
- pionowe kreski przy nagłówkach sekcji zostały wzmocnione tak, żeby czytelniej budowały hierarchię.

## Aktualizacja matematyki i danych do 15.04.2026

To był drugi ważny filar tej sesji.

Zaktualizowaliśmy oba widoki, `/kalkulator` i `/porownaj`, do aktualnej oferty obligacji detalicznych na kwiecień 2026.

Wdrożyliśmy:

- jedno wspólne źródło prawdy dla aktualnych stawek,
- aktualne oprocentowanie i marże dla serii,
- aktualny miesiąc oferty w opisach i założeniach,
- poprawkę logiki ROR i DOR dla pierwszego miesiąca promocyjnego,
- potwierdzenie i doprecyzowanie sposobu liczenia podatku Belki.

### Co było ważne matematycznie

- finalne kwoty na wykresie są kwotami netto, po podatku Belki,
- dla obligacji wcześniejsze wyjście uwzględnia opłatę i podatek zgodnie z modelem produktu,
- dla benchmarków lokat poprawiliśmy mechanikę tak, żeby po każdym okresie kolejna lokata startowała z kwoty po opodatkowaniu, a nie z brutto,
- dzięki temu porównanie jest bardziej uczciwe i bliższe realnemu zachowaniu produktu.

## Co zostało sprawdzone w trakcie prac

W trakcie sesji wielokrotnie odpalaliśmy walidację:

- `eslint`,
- `tsc --noEmit`,
- testy jednostkowe `vitest` dla logiki kalkulatora i porównania,
- Playwright dla `/kalkulator` i `/porownaj`,
- oraz wielokrotnie aktualizowaliśmy snapshoty po zmianach wizualnych.

To ważne, bo ta iteracja dotykała jednocześnie:

- UI,
- copy,
- logiki porównania,
- matematyki,
- responsywności,
- i spójności między dwoma głównymi widokami produktu.

## Stan końcowy po tej sesji

Po tej iteracji produkt jest wyraźnie dojrzalszy w 4 wymiarach:

- lepiej prowadzi użytkownika przez wybór,
- lepiej tłumaczy wynik i koszt bezczynności,
- lepiej pokazuje różnicę między prostotą a koniecznością ciągłego wracania do tematu,
- oraz jest spójniejszy wizualnie i logicznie między `/kalkulator` i `/porownaj`.

To nie była kosmetyka. To była iteracja, która uporządkowała architekturę ekranu, model komunikacji z użytkownikiem i aktualność danych finansowych.
