# Pivot

To nie jest pełna historia każdej iteracji. To zapis najważniejszych momentów, w których kierunek produktu albo sposób jego dowożenia realnie się zmienił. Każdy checkpoint jest datowany datą zamknięcia sesji, z której ten pivot pochodzi.

## Skąd startowaliśmy

Początek był szerszy i bardziej analityczny:

- więcej miejsca dla parametrów,
- więcej porównań między produktami,
- większa rola wykresów i wizualizacji,
- mocniejsze myślenie w kategoriach klasycznego kalkulatora.

To było sensowne jako eksploracja, ale nie jako najlepsza odpowiedź dla początkującego użytkownika.

## Checkpoint 2026-03-25 - najpierw szeroka eksploracja, nie od razu implementacja

Na początku zapadła świadoma decyzja, żeby nie skakać od razu do finalnego buildu w `Next.js`. Najpierw miało powstać kilka lekkich kierunków, które pokażą różne architektury doświadczenia.

To był ważny pivot procesowy: z planowania w próżni na pracę na artefaktach.

## Checkpoint 2026-03-25 - FBO-led shell wygrywa z portfolio-led

Po porównaniu kierunków dalsza praca została oparta na wariancie bardziej FBO-led niż portfolio-led.

To był pivot estetyczny i komunikacyjny:

- mniej case-study feel,
- bardziej redakcyjny rytm,
- większa zgodność z tonem i klimatem FBO.

## Checkpoint 2026-03-25 - produkt przechodzi w answer-first

Najmocniejszy pivot nie dotyczył samego wyglądu. Dotyczył pytania, na które produkt ma odpowiadać.

### Wcześniej

"Jak porównać obligacje?"

### Potem

"Co mogę zrobić z pieniędzmi zamiast zostawiać je bez ruchu i jak zrobić pierwszy krok?"

W praktyce oznaczało to przejście z surowego kalkulatora do flow, które szybciej pokazuje wynik, koszt bezruchu i sens działania.

## Checkpoint 2026-03-26 - rewrite do Next.js nie otwiera produktu na nowo

Kiedy przyszło do implementacji produkcyjnej, zapadła kolejna ważna decyzja: rewrite ma zachować produkt 1:1, zamiast uruchamiać nową rundę projektowania.

To był pivot wykonawczy:

- aktualny prototyp wygrał ze starszymi, szerszymi dokumentami,
- `Next.js` miał dowieźć produkt, a nie przepisać jego sens,
- dopuszczone zostały tylko odchylenia potrzebne dla architektury, accessibility i testów.

## Checkpoint 2026-03-28 - mobile, embed i tablet stają się osobnymi środowiskami

Późny pass UX/UI przyniósł jeszcze jeden istotny pivot, tym razem w sposobie traktowania powierzchni.

To już nie był nowy pivot produktowy, tylko świadoma zmiana egzekucyjna:

- mobile przestał być pomniejszonym desktopem,
- wąski `iframe` został potraktowany jako osobny przypadek,
- tablet portrait dostał własny breakpoint między desktopem a telefonem.

W tej sesji kierunek UX/UI był decyzją użytkownika, a agent realizował wdrożenie i walidację.

## Co zostało po drodze

Nie wszystko z wcześniejszych podejść zostało wyrzucone.

Zostały:

- potrzeba porównania z czymś znajomym,
- jawne tłumaczenie inflacji i podatku,
- chęć pokazania użytkownikowi sensu decyzji,
- warstwa głębszych szczegółów dla osób bardziej dociekliwych.

Zmieniła się kolejność, ciężar i sposób podania tych elementów.
