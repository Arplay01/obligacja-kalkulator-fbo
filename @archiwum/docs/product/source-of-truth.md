# Source of Truth - Dane i walidacja

> Status note: ten dokument pozostaje pomocniczy dla danych i walidacji, ale nie opisuje w pełni obecnego produktu. Jeśli pojawia się konflikt z aktualnym flow, copy albo interakcjami, wygrywa `kalkulatory-robocze/fbo-visual-prototype-v2-fbo/` oraz aktualne `brief` i `PRD`.

## Cel dokumentu

Ten dokument rozdziela źródła kanoniczne od materiałów pomocniczych. Jest miejscem, w którym zapisujemy, skąd bierzemy parametry obligacji i jak aktualizujemy PoC.

## Źródła kanoniczne

### 1. Oficjalne źródła obligacji skarbowych

To jest źródło prawdy dla parametrów czasowo wrażliwych:

- miesięczne komunikaty sprzedażowe na `obligacjeskarbowe.pl`,
- strony produktowe dla konkretnych emisji,
- tabele odsetkowe i dokumenty emisyjne.

To właśnie z nich bierzemy:

- oprocentowanie pierwszego okresu,
- marże inflacyjne,
- opłaty za wcześniejszy wykup,
- reguły kapitalizacji i wypłat odsetek.

### 2. Oficjalne dane makro tylko wtedy, gdy są potrzebne we wzorze

- GUS dla inflacji,
- inne oficjalne źródła publiczne tylko wtedy, gdy faktycznie wpływają na wzór.

## Artefakty referencyjne, ale nie kanoniczne

### Excel Marcina

Plik:

- `Kalkulator-obligacji-marzec-2026-Finanse-Bardzo-Osobiste.xlsx`

Rola:

- artefakt walidacyjny,
- źródło zrozumienia bardziej zaawansowanej logiki,
- punkt odniesienia dla wybranych scenariuszy kontrolnych.

Excel nie jest jednak docelowym source-of-truth dla UI ani dla scope'u webowego PoC.

### Artykuł Marcina

URL:

- `https://marciniwuc.com/obligacje-indeksowane-inflacja-kalkulator/`

Rola:

- kontekst edukacyjny,
- język i framing wartości dla użytkownika,
- źródło insightów i pytań użytkowników.

Artykuł nie jest source-of-truth dla aktualnych parametrów liczbowych, bo zawiera historyczne przykłady.

### Wcześniejsze prototypy

- `kalkulatory-robocze/`

Rola:

- inspiracja procesowa,
- porównanie kierunków UX/UI.

To nie jest kanoniczne źródło wymagań produktu ani danych finansowych.

## Aktualny zestaw parametrów PoC

Status:

- aktualizacja ręczna,
- data stempla: `2026-03`,
- do weryfikacji przy każdej nowej iteracji implementacyjnej.

Parametry przyjęte dla marcowej emisji 2026:

- `TOS0329` - `4,65%` stałe,
- `COI0330` - `5,00%` w pierwszym roku, potem `inflacja + 1,50 p.p.`,
- `EDO0336` - `5,60%` w pierwszym roku, potem `inflacja + 2,00 p.p.`.

Punkty startowe do ręcznej weryfikacji:

- list emisyjny TOS0329: `https://www.obligacjeskarbowe.pl/media_files/90dbdef5-0d11-437d-a5cd-6ff770827473.pdf`
- tabela odsetkowa TOS0329: `https://www.obligacjeskarbowe.pl/media_files/ecc8664e-2563-4071-8400-04da5db94ed4.pdf`
- oferta COI: `https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-4-letnie-coi/coi0330/`
- oferta EDO: `https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-10-letnie-edo/`

## Benchmarki niekanoniczne, ale jawne

Nie wszystkie dane mają jedno oficjalne źródło produktu.

W PoC jawnie utrzymujemy własne benchmarki:

- konto oszczędnościowe `4,00%` rocznie jako roboczy benchmark porównawczy.

Taki benchmark:

- musi mieć datę aktualizacji,
- musi być opisany jako założenie PoC,
- nie może być przedstawiany jako „oficjalna najlepsza oferta rynkowa”.

## Procedura ręcznej aktualizacji

1. Sprawdź najnowszy oficjalny komunikat miesięczny i strony emisji.
2. Zaktualizuj parametry w dokumentacji produktu i później w danych implementacyjnych.
3. Zmień datę aktualizacji w interfejsie i w tym pliku.
4. Zweryfikuj co najmniej jeden scenariusz kontrolny względem Excela lub oficjalnych tabel odsetkowych.
5. Jeśli źródła są niespójne, zatrzymaj zmianę i opisz konflikt zamiast zgadywać.

## Czego nie traktujemy jako source-of-truth

- `PRD`,
- `prototype-brief`,
- wcześniejsze szybkie prompty,
- historyczne dane w artykułach,
- blogi, fora i agregatory,
- pamięć modelu.
