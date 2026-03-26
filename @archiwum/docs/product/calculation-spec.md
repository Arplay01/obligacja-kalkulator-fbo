# Calculation Spec - Kalkulator Obligacji Skarbowych PoC

> Status note: ten dokument opisuje wcześniejszą warstwę logiki i nie jest już samodzielnym source of truth dla obecnego produktu. Dla aktualnego UI, UX, copy i zachowania wygrywają `docs/product/brief.md`, `docs/product/prd.md` oraz `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/`. Przy rewrite do Next.js warstwę finansową trzeba zweryfikować z aktualnym prototypem i bieżącymi parametrami.

## Cel dokumentu

Ten dokument opisuje logikę obliczeń i uproszczenia PoC. Parametry czasowo wrażliwe są utrzymywane ręcznie i opisane w `source-of-truth.md`.

## Zakres i reguły globalne

- Wejściowa `kwota` jest podawana w PLN i musi być wielokrotnością `100 zł`.
- `Horyzont` jest wyrażony w pełnych latach z zakresu `1–10`.
- `Inflacja` w PoC jest stała przez cały horyzont i przyjmuje jedną z trzech wartości:
  - `2,0%`,
  - `3,5%`,
  - `6,0%`.
- `Podatek Belki` = `19%`.
- W PoC pokazujemy:
  - wartość końcową nominalną,
  - zysk nominalny,
  - wynik realny po uwzględnieniu inflacji.

### Definicje

- `A` - kwota wejściowa.
- `H` - horyzont w latach.
- `i` - wybrana inflacja.
- `t` - podatek Belki (`0,19`).

### Linie referencyjne

- `Linia zachowania siły nabywczej` dla roku `y`:
  - `inflation_threshold(y) = A * (1 + i)^y`
- `Wynik realny` dla końca horyzontu:
  - `real_end = nominal_end / (1 + i)^H`

## Benchmark: konto oszczędnościowe

### Parametr PoC

- benchmark roczny: `4,00%`
- to jest założenie PoC, nie oficjalny parametr jednej instytucji

### Wzór

- `r_account = 0,04`
- `r_account_net = r_account * (1 - t)`
- `account_end(H) = A * (1 + r_account_net)^H`

### Uwagi

- kapitalizacja: roczna,
- IKE nie dotyczy benchmarku konta oszczędnościowego,
- wynik realny liczymy przez podzielenie wyniku nominalnego przez `(1 + i)^H`.

## TOS - obligacje 3-letnie stałoprocentowe

### Parametr PoC

- oprocentowanie stałe: `4,65%`
- opłata za wcześniejszy wykup: `1,00 zł` na każde `100 zł` nominału aktywnej emisji

### Uproszczenia PoC

- jeśli horyzont przekracza `3 lata`, zakładamy serial rollover w kolejne emisje TOS z tym samym oprocentowaniem `4,65%`,
- ignorujemy mechanikę zamiany po `99,90 zł`,
- ignorujemy zaokrąglenia wynikające z kupowania pełnych sztuk po kolejnych rolloverach.

### Logika

#### Pełny 3-letni blok

- `r_tos = 0,0465`
- `gross_block = principal * (1 + r_tos)^3`
- `profit_block = gross_block - principal`
- `standard_reinvested = gross_block - (profit_block * t)`
- `ike_reinvested = gross_block`

#### Niepełny blok końcowy

- `gross_partial = principal * (1 + r_tos)^years_in_partial_block`
- `profit_partial = gross_partial - principal`
- `fee_partial = principal * 0,01`
- `tax_base = max(profit_partial - fee_partial, 0)`
- `standard_partial_end = gross_partial - fee_partial - (tax_base * t)`
- `ike_partial_end = gross_partial - fee_partial`

#### Wynik końcowy

- dla pełnych bloków trzyletnich reinwestujemy środki po opodatkowaniu (`standard`) lub brutto (`IKE`),
- jeśli ostatni blok kończy się przed terminem wykupu, stosujemy wzór niepełnego bloku.

## COI - obligacje 4-letnie indeksowane inflacją

### Parametry PoC

- rok 1: `5,00%`
- rok 2 i dalej: `inflacja + 1,50 p.p.`
- opłata za wcześniejszy wykup: `2,00 zł` na każde `100 zł` nominału aktywnej emisji

### Uproszczenia PoC

- odsetki są wypłacane co roku i nie są reinwestowane,
- jeśli horyzont przekracza `4 lata`, zakładamy rollover w kolejną emisję COI o tych samych regułach,
- przy rolloverze pomijamy cenę zamiany `99,90 zł`,
- horyzont jest liczony tylko w pełnych latach, bez części roku.

### Logika

- `rate_year_1 = 0,05`
- `rate_next_years = i + 0,015`
- principal w obrębie aktywnego czteroletniego bloku nie rośnie, bo odsetki są wypłacane, a nie kapitalizowane

#### Wypłata roczna

- `gross_interest_y = principal * rate_y`
- `standard_interest_y = gross_interest_y * (1 - t)`
- `ike_interest_y = gross_interest_y`

#### Zwrot kapitału

- przy zakończeniu pełnego bloku użytkownik odzyskuje `principal`,
- przy wcześniejszym zakończeniu aktywnego bloku:
  - `fee = principal * 0,02`
  - `returned_principal = principal - fee`

#### Wynik końcowy

- `standard_end = returned_principal + suma_rocznych_standard_interest`
- `ike_end = returned_principal + suma_rocznych_ike_interest`

## EDO - obligacje 10-letnie indeksowane inflacją

### Parametry PoC

- rok 1: `5,60%`
- rok 2 i dalej: `inflacja + 2,00 p.p.`
- opłata za wcześniejszy wykup: `3,00 zł` na każde `100 zł` nominału aktywnej emisji

### Uproszczenia PoC

- slider kończy się na `10 latach`, więc nie modelujemy rollovera do kolejnej emisji EDO,
- zakładamy roczną kapitalizację zgodnie z naturą produktu,
- opłatę za wcześniejszy wykup stosujemy tylko wtedy, gdy `H < 10`.

### Logika

- `capital_0 = A`
- `rate_year_1 = 0,056`
- `rate_next_years = i + 0,02`

#### Kapitalizacja

- `capital_y = capital_(y-1) * (1 + rate_y)`

#### Wyjście standardowe

- jeśli `H = 10`:
  - `fee = 0`
- jeśli `H < 10`:
  - `fee = A * 0,03`

- `gross_profit = capital_H - A`
- `tax_base = max(gross_profit - fee, 0)`
- `edo_standard_end = capital_H - fee - (tax_base * t)`
- `edo_ike_end = capital_H - fee`

## Wyświetlanie wyników

- W trybie domyślnym wykres i główne wartości pokazują scenariusz standardowy.
- Po przełączeniu `IKE` wykres przełącza tylko serie obligacyjne na wariant bez podatku.
- Karty szczegółowe dla obligacji pokazują oba warianty jednocześnie.
- Konto oszczędnościowe pozostaje bez zmian niezależnie od `IKE`.

## Uproszczenia PoC, które muszą być jawne w UI

- inflacja jest stała przez cały horyzont,
- benchmark konta oszczędnościowego jest ręcznym założeniem PoC,
- TOS i COI mogą być modelowane z uproszczonym rolloverem,
- nie modelujemy ceny zamiany `99,90 zł`,
- COI nie reinwestuje wypłacanych odsetek,
- pomijamy dokładne zaokrąglenia wynikające z kupowania pełnych sztuk przy kolejnych rolloverach.
