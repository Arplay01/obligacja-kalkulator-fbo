# PRD — Kalkulator Obligacji Skarbowych PoC

## Cel dokumentu

Ten dokument opisuje zachowanie produktu. Jest source-of-truth dla ekranu, interakcji i zakresu PoC. Nie służy jako prompt do generowania prototypów.

## Użytkownik i zadanie

- Użytkownik: początkujący odbiorca FBO.
- Główne zadanie: zrozumieć, co stanie się z jego pieniędzmi przy różnych bezpiecznych opcjach oszczędzania.
- Główna emocja do zaadresowania: niepewność i lęk przed złą decyzją.

## Model doświadczenia

- Jeden ekran.
- Brak przycisku „oblicz”; zmiany w inputach aktualizują wynik od razu.
- Desktop-first, z pełnym wsparciem mobile.
- Progresywne ujawnianie szczegółów: najpierw prosty wynik, potem głębsze warstwy.

## Struktura ekranu

### 1. Intro

Na górze krótki blok wyjaśniający:

- co porównujemy,
- że narzędzie ma charakter edukacyjny,
- że pomaga zrozumieć, a nie sprzedać konkretny produkt.

Ten blok ma być krótki i nie może spychać kalkulatora poniżej pierwszego widoku na desktopie.

### 2. Inputy

PoC ma dokładnie cztery elementy wejściowe:

- `kwota` — pole liczbowe w PLN, krok co 100 zł, domyślnie `10 000 zł`,
- `horyzont` — kontrolka 1–10 lat, domyślnie `5 lat`,
- `preset inflacji` — `niska 2,0%`, `umiarkowana 3,5%`, `wysoka 6,0%`, domyślnie `umiarkowana`,
- `toggle IKE` — przełącza scenariusze obligacyjne na wariant bez podatku Belki.

Reguły:

- kwota musi być wielokrotnością `100 zł`,
- jeśli kwota jest pusta albo niepoprawna, użytkownik dostaje prosty komunikat inline,
- `IKE` wpływa tylko na obligacje; konto oszczędnościowe nie zmienia wyniku po przełączeniu.

### 3. Główny wykres porównawczy

To jest pierwsza i najważniejsza warstwa wyniku.

Wykres pokazuje:

- `konto oszczędnościowe`,
- `TOS 3-latki`,
- `EDO 10-latki`,
- przerywaną linię `kwoty potrzebnej do utrzymania siły nabywczej`.

Reguły:

- wykres pokazuje wartości dla kolejnych pełnych lat do wybranego horyzontu,
- domyślnie pokazujemy wariant standardowy z podatkiem,
- po przełączeniu `IKE` zmieniają się tylko serie obligacyjne,
- na wykresie nigdy nie pokazujemy więcej niż 4 linii naraz,
- COI nie trafia na wykres główny.

### 4. Karty podsumowania

Pod wykresem znajdują się trzy karty odpowiadające głównym seriom z wykresu:

- konto oszczędnościowe,
- TOS,
- EDO.

Każda karta pokazuje:

- wartość końcową,
- zysk nominalny,
- wynik realny względem inflacji,
- krótką interpretację „co to znaczy”.

Dodatkowo:

- karty obligacyjne pokazują dwa warianty: `standard` i `IKE`,
- karta konta oszczędnościowego pokazuje tylko wariant standardowy z notą, że `IKE nie dotyczy`.

### 5. Szczegóły na żądanie

Domyślnie ukryta sekcja „Pokaż więcej szczegółów” rozwija tabelę porównawczą.

Tabela zawiera trzy serie:

- TOS,
- COI,
- EDO.

Minimalne kolumny:

- typ obligacji,
- rekomendowany horyzont / charakter użycia,
- wartość końcowa,
- wynik realny,
- sposób naliczania odsetek,
- informacja o wcześniejszym wykupie.

Tabela ma uzupełniać wykres, a nie zastępować go. Jej celem jest dopowiedzenie różnic, nie przeciążenie użytkownika.

### 6. Uczciwe porównanie „obligacje vs lokaty”

Pod wynikami ma znaleźć się krótka sekcja edukacyjna:

- kiedy obligacje mają sens,
- kiedy lokata albo konto mogą być lepszym wyborem,
- jakie są różnice w płynności, podatku i ochronie przed inflacją.

Ta sekcja ma budować zaufanie, nie ranking zwycięzcy.

### 7. Sekcja „Twój następny krok”

Po wyniku użytkownik dostaje trzy ścieżki:

- `Jak kupić obligacje krok po kroku`,
- `Chcę lepiej zrozumieć obligacje`,
- `Zapisz wynik i wróć później`.

W PoC linki mogą być placeholderami, ale struktura sekcji i copy muszą istnieć.

### 8. Disclaimer i uproszczenia

Na dole ekranu ma być wyraźnie widoczna warstwa zaufania:

- disclaimer edukacyjny,
- data aktualizacji parametrów,
- lista uproszczeń PoC dostępna bez ukrywania jej w stopce serwisu.

## Zachowanie i stany

- Zmiana dowolnego inputu aktualizuje wykres, karty i tabelę natychmiast.
- Horyzont krótszy niż pełny termin obligacji jest dozwolony; wynik pokazuje scenariusz zakończenia oszczędzania po wybranym czasie i musi to być opisane przy wyniku.
- Jeśli użytkownik wybierze `IKE`, interfejs nie może sugerować, że konto oszczędnościowe także korzysta z tego mechanizmu.
- Produkt nie pokazuje etykiet typu „najlepsza opcja”, „wygrywa”, „kup teraz”.

## Poza zakresem PoC

- ROR, DOR, ROS, ROD, OTS,
- zmienna inflacja rok po roku,
- pełna logika zamiany obligacji po `99,90 zł`,
- regularne wpłaty i budowa portfela,
- porównanie z ETF-ami lub akcjami,
- ciężki wieloetapowy wizard,
- ranking lub perswazyjny scoring produktów.
