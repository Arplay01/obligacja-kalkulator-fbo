# Brief — Kalkulator Obligacji Skarbowych PoC

## Cel dokumentu

Ten brief opisuje problem, segment, hipotezy i zakres PoC. Nie opisuje jeszcze szczegółowej logiki obliczeń ani nie służy jako prompt do generowania prototypów.

## Kontekst

Finanse Bardzo Osobiste mają rozbudowany arkusz Excel do symulacji obligacji skarbowych. To narzędzie jest mocne i eksperckie, ale wymaga od użytkownika wiedzy, której osoba początkująca często jeszcze nie ma.

Teza tego PoC jest prosta: nie próbujemy budować webowego odpowiednika Excela 1:1. Budujemy prostsze narzędzie dla osoby, która chce szybko zrozumieć, co stanie się z jej pieniędzmi i czym różnią się główne opcje.

## Problem użytkownika

Osoba początkująca:

- widzi, że pieniądze na koncie tracą wartość,
- słyszała o obligacjach skarbowych, ale nie rozumie ich mechaniki,
- nie wie, jak porównać obligacje z kontem lub lokatą,
- czuje lęk przed złą decyzją i nie chce żargonu ani eksperckiego interfejsu.

## Segmentacja

### Segment A — użytkownik początkujący

To segment docelowy PoC. Szuka jasności, spokoju i odpowiedzi na pytanie: „co stanie się z moimi pieniędzmi?”.

### Segment B — użytkownik zaawansowany

Zna typy obligacji, porównuje scenariusze i chce większej kontroli nad parametrami. Ten segment dalej obsługuje istniejący Excel.

## JTBD

„Kiedy orientuję się, że moje oszczędności na koncie tracą siłę nabywczą, chcę w prosty sposób zobaczyć, co stanie się z moimi pieniędzmi w kolejnych latach, żebym mógł podjąć spokojną i świadomą decyzję. Chcę czuć się bezpiecznie i pewnie przelewając moje pieniądze z mojego konta.”

## Teza produktowa

PoC powinien pomagać w zrozumieniu i porównaniu opcji, a nie w „optymalizacji pod zysk”. To narzędzie edukacyjne, uczciwe i niesprzedażowe.

## Hipotezy

- Porównanie jest cenniejsze dla Segmentu A niż sama kalkulacja jednego instrumentu.
- Wykres i czytelne podsumowanie budują lepszy „aha moment” niż tabela pełna parametrów.
- Framing „co stanie się z moimi pieniędzmi” działa lepiej niż framing „ile zarobię”.
- Prosty start z głębszymi szczegółami na żądanie jest lepszy niż pokazywanie wszystkich opcji od razu.
- Sekcja „co dalej” jest częścią wartości produktu; bez niej kalkulator kończy się zbyt wcześnie.
- Dwa narzędzia dla dwóch segmentów są lepsze niż jeden kompromisowy produkt.

## Non-goals

PoC nie ma:

- przekonywać, że obligacje są zawsze lepsze od lokat,
- zastąpić eksperckiego Excela Marcina,
- porównywać obligacji z ETF-ami lub akcjami,
- rozwiązywać regularnego inwestowania, dokupowania czy budowy portfela,
- modelować wszystkich edge case'ów zaawansowanego użytkownika.

## Zakres PoC

PoC skupia się na jednym ekranie i jednym głównym pytaniu: „co stanie się z moimi pieniędzmi przy różnych bezpiecznych opcjach oszczędzania?”.

Rdzeń rozwiązania:

- minimalna liczba inputów,
- porównanie konto oszczędnościowe vs TOS vs EDO,
- COI jako głębsza warstwa szczegółów,
- jawne pokazanie wpływu inflacji i podatku Belki,
- uczciwy disclaimer i sekcja kolejnego kroku.

## Otwarta walidacja

To repo przyjmuje decyzję „Segment A only” jako założenie robocze PoC, ale szersza strategia FBO nadal wymaga rozmowy i walidacji.

## Najważniejsze pytania discovery

- Jak FBO definiuje sukces kalkulatora?
- Czy prosty kalkulator + Excel to pożądana architektura, czy tylko hipoteza?
- Jakie są docelowe linki i treści dla sekcji „co dalej”?
- Kto i jak będzie aktualizował parametry obligacji?
- Jak bardzo produkt ma żyć wewnątrz ekosystemu FBO, a jak bardzo być osobną stroną narzędziową?
