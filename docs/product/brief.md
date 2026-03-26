# Brief - finalny kierunek kalkulatora obligacji dla FBO

## Po co istnieje ten produkt

To PoC prostego kalkulatora obligacji skarbowych dla początkującej osoby z ekosystemu FBO.

Nie próbujemy budować webowego odpowiednika Excela 1:1. Chodzi o narzędzie, które szybko pokaże, co można zrobić z pieniędzmi poza biernym trzymaniem ich na lokacie albo koncie i jak zrobić pierwszy krok bez przeciążenia.

## Problem użytkownika

Początkujący użytkownik:

- widzi, że pieniądze tracą wartość,
- zna nazwę "obligacje", ale nie wie, czy to rozwiązanie dla niego,
- nie chce finansowego interfejsu eksperckiego,
- potrzebuje prostoty, zrozumienia i intencji działania.

To nie jest problem "jak porównać wszystkie serie obligacji". To jest problem "co mogę zrobić z pieniędzmi i jak ruszyć z miejsca".

## Dla kogo jest ten PoC

### Główny odbiorca

Początkująca osoba FBO, która:

- chce zachować wartość oszczędności,
- nie zna mechaniki poszczególnych produktów,
- potrzebuje spokojnego, czytelnego wejścia w temat.

### Poza głównym zakresem

Osoba zaawansowana, która chce więcej parametrów, scenariuszy i kontroli. Dla niej nadal lepszym narzędziem pozostaje arkusz Excel Marcina.

## Główna wartość produktu

Produkt ma dać użytkownikowi cztery rzeczy:

- natychmiastowy szacunkowy wynik,
- prosty obraz kosztu bezruchu,
- porównanie z czymś znajomym, czyli lokatą albo kontem,
- jasny następny krok, jeśli chce kupić pierwszą obligację.

## Teza produktowa

Najlepszy kierunek dla tego PoC to answer-first calculator:

- odpowiedź jest na górze,
- szczegóły są na żądanie,
- copy tłumaczy trudne pojęcia lokalnie,
- doświadczenie prowadzi od zrozumienia do aktywacji.

To narzędzie ma być edukacyjne, uczciwe i spokojne. Nie ma działać jak ranking zwycięzców ani jak narzędzie do finansowej optymalizacji.

## Dlaczego ten format wygrał

Pierwsze podejścia były szersze, bardziej analityczne i zostawiały więcej miejsca na wykresy, porównania i parametry.

W praktyce okazało się, że dla laika to nie jest najkrótsza droga do decyzji. Lepszy efekt dał format, który:

- pokazuje wartość od razu,
- redukuje lęk,
- upraszcza wybory,
- tłumaczy tylko to, co potrzebne w danym momencie,
- daje kolejny krok w tym samym ekranie.

## Zakres obecnego PoC

Produkt skupia się na jednym ekranie i jednym głównym zadaniu:

pokazać, co dzieje się z pieniędzmi użytkownika przy wybranej obligacji, jak to wypada wobec lokaty i konta oraz co zrobić dalej.

W scope są:

- wybór serii obligacji detalicznych,
- kwota inwestycji,
- prosty scenariusz inflacji,
- opcje zaawansowane na żądanie,
- wynik netto,
- koszt nicnierobienia,
- porównanie do znanych alternatyw,
- materiały edukacyjne i zakupowe.

## Non-goals

Ten PoC nie ma:

- być eksperckim porównywaczem wszystkich scenariuszy,
- zastępować Excela 1:1,
- projektować doświadczenia wokół wykresów jako głównej warstwy,
- rozwiązywać całego świata oszczędzania i inwestowania,
- porównywać obligacji z ETF-ami, akcjami czy portfelami,
- budować skomplikowanego flow wieloetapowego.

Zrezygnowaliśmy też z wykresów jako głównej warstwy produktu. Wymagają większej wiedzy domenowej i większego scope'u pracy, żeby były naprawdę czytelne dla laika.

## Co będzie oznaczało sukces tego PoC

- użytkownik szybko rozumie sens wyniku,
- widzi koszt bezruchu,
- nie gubi się w pojęciach,
- dostaje prosty kolejny krok,
- interfejs zachowuje spokój mimo finansowego tematu.
