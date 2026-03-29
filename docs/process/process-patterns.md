# Patterny pracy

To nie jest opis idealnego procesu z prezentacji. To jest zestaw patternów, które realnie zadziałały w tej pracy.

## 1. Zaczynam szeroko, potem szybko zawężam

Na starcie lepiej było sprawdzić kilka kierunków niż od razu bronić jednego. Szeroka eksploracja miała sens tylko do momentu, w którym pojawił się mocniejszy kierunek. Potem liczyło się już zawężanie, nie mnożenie opcji.

## 2. Pracuję na artefakcie, nie tylko na specu

Najwięcej odpowiedzi dały kolejne ekrany, nie same opisy. Widać to szczególnie przy hierarchii informacji, ciężarze prawej kolumny i kolejności disclosure.

## 3. Testuję kierunki, nie tylko warianty wizualne

Kolejne iteracje nie były tylko zmianą koloru albo fontu. Zmieniały architekturę doświadczenia: compare-heavy, guided flow, portfolio-led shell, FBO-led shell, answer-first.

## 4. Copy i spacing są częścią produktu

Wiele ważnych decyzji zapadło nie na poziomie wzoru, tylko na poziomie:

- czy coś ma być w jednej linii czy w trzech,
- czy pojęcie trzeba tłumaczyć tooltipem,
- czy dana liczba ma być hero czy tylko helperem,
- czy sekcja ma być boxem, disclosure czy prostym tekstem.

## 5. Odejmowanie daje większy efekt niż dokładanie

Najmocniejsze poprawki bardzo często polegały na usuwaniu:

- zbędnych ramek,
- zbyt technicznych etykiet,
- duplikujących się treści,
- szczegółów pokazanych za wcześnie.

## 6. Najpierw wartość, potem mechanika

Użytkownik najpierw potrzebuje odpowiedzi: czy to ma sens i co się stanie z jego pieniędzmi. Dopiero potem warto pokazać szczegóły kalkulacji, opisy serii i edukacyjne rozwinięcia.

## 7. Trudne pojęcia tłumaczę dokładnie tam, gdzie pojawia się opór

Zamiast robić osobne sekcje edukacyjne na dole, lepiej działały małe wyjaśnienia przy `Podatku Belki`, `IKE`, `efektywnie rocznie` albo przy hero wyniku.

## 8. CTA pojawia się wtedy, gdy użytkownik ma już intencję

Sekcja `Jak kupić?` zaczęła działać dopiero wtedy, gdy trafiła po wyniku i po podstawowym zrozumieniu scenariusza. Wcześniej byłaby tylko kolejnym przyciskiem na ekranie.

## 9. Późny audit najlepiej robić na działającym produkcie

Końcowy polish najwięcej dał wtedy, gdy nie był już debatą o pomysłach, tylko serią konkretnych obserwacji na żywym buildzie. Dużo łatwiej było ocenić:

- czy coś spowalnia wejście do kalkulatora,
- czy wynik jest naprawdę wiarygodny w pierwszej sekundzie,
- czy użytkownik rozumie, z czym porównuje wynik,
- czy dana sekcja jeszcze pomaga, czy już tylko zajmuje miejsce.

## 10. W audycie warto rozdzielić UX flow od zmian wizualnych

Pomogło świadome rozdzielenie dwóch trybów pracy:

- najpierw przebudowa ścieżki użytkownika, copy i hierarchii informacji,
- potem osobny pass dla ciężaru boxów, spacingu, kreski disclosure i proporcji layoutu.

Dzięki temu łatwiej było ocenić, czy coś rozwiązuje problem, czy tylko wygląda inaczej.

## 11. Przy polishu najpierw reuse systemu, potem wyjątki

W późnych poprawkach warto najpierw korzystać z istniejących komponentów, typografii i wag informacji. Nowe style mają sens dopiero wtedy, gdy obecny system naprawdę nie daje odpowiedzi.

To szczególnie pomogło przy:

- helperach i objaśnieniach pod pickerami,
- lekkich kartach w sekcjach wynikowych,
- ujednolicaniu disclosure między kalkulatorem a deep dive.

## AI-assisted workflow

Cały kod i spora część iteracji powstały z pomocą Codex, Cursor, Claude.ai i Claude Code.

AI było tutaj narzędziem przyspieszającym:

- szybkie prototypowanie,
- eksplorację kilku kierunków,
- sprawne poprawki UI,
- porządkowanie logiki i copy.

Najważniejsze pozostawało jednak coś innego: selekcja. Nie każda wygenerowana odpowiedź była dobra. Wartość robiło dopiero ciągłe filtrowanie, upraszczanie i sprowadzanie decyzji z powrotem do użytkownika.
