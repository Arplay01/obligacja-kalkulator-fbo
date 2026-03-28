# Decision log

Krótki log najważniejszych decyzji produktowych, UX i UI. Każdy wpis jest datowany datą zamknięcia sesji, z której dana decyzja pochodzi. Jeśli coś nie daje się pewnie przypisać do zamkniętej sesji, nie trafia do tego logu jako datowana decyzja.

## 1. PRD przestaje być promptem do prototypowania

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** `PRD` zostało rozdzielone od promptów do prototypowania, a source of truth produktu dostał osobne miejsce.  
**Dlaczego:** pełny dokument mieszał zbyt wiele warstw naraz i usztywniał eksplorację.  
**Wartość dla użytkownika:** łatwiej było testować różne kierunki doświadczenia bez przepisywania całego produktu do jednego promptu.

## 2. Głównym odbiorcą zostaje początkujący użytkownik

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** PoC celuje w osobę, która chce zrozumieć pierwszy krok, a nie w użytkownika eksperckiego.  
**Dlaczego:** największy problem był związany z niepewnością, przeciążeniem i brakiem prostego wejścia w temat.  
**Wartość dla użytkownika:** interfejs mógł być prostszy, spokojniejszy i bardziej ludzki.

## 3. Excel zostaje dla zaawansowanych

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** webowy PoC nie próbuje zastąpić arkusza Marcina 1:1.  
**Dlaczego:** jedno narzędzie dla wszystkich szybko rozwadniało produkt i podnosiło próg wejścia.  
**Wartość dla użytkownika:** początkujący dostaje prostszy ekran, a bardziej zaawansowany użytkownik zachowuje warstwę głębi poza PoC.

## 4. Najpierw eksplorujemy kilka lekkich kierunków

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** pierwsza runda prototypowania miała wygenerować kilka lekkich kierunków, a nie od razu jeden finalny build w `Next.js`.  
**Dlaczego:** szybciej było porównać architektury doświadczenia niż debatować o nich w próżni.  
**Wartość dla użytkownika:** finalny kierunek nie był przypadkowy, tylko wybrany po sprawdzeniu realnych alternatyw.

## 5. Produkt od początku ma działać wewnątrz portfolio

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** finalna wersja rekrutacyjna kalkulatora ma działać jako `/kalkulator` w tym samym projekcie `Next.js`, projektowana pod `iframe` i modal.  
**Dlaczego:** kalkulator miał wzmacniać historię produktu w portfolio, a nie funkcjonować jako osobny byt.  
**Wartość dla użytkownika:** przejścia między case study a narzędziem są naturalne i nie wypychają użytkownika z kontekstu.

## 6. Wybrany zostaje FBO-led shell

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** dalsze iteracje idą w kierunku bardziej FBO-led niż portfolio-led.  
**Dlaczego:** ten wariant lepiej wspierał redakcyjny charakter treści i mniej pachniał narzędziem z case study.  
**Wartość dla użytkownika:** ekran jest bliżej języka i klimatu, którego można oczekiwać od FBO.

## 7. Kalkulator przechodzi w amount-first i answer-first flow

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** produkt został przebudowany z surowego kalkulatora w flow, który zaczyna od kwoty, wyniku po ludzku i prostszego tłumaczenia mechaniki.  
**Dlaczego:** cięższy, bardziej narzędziowy ekran podnosił próg wejścia i osłabiał tempo doświadczenia.  
**Wartość dla użytkownika:** użytkownik szybciej rozumie, po co tu jest i co może zrobić dalej.

## 8. Typ oprocentowania ma być sygnałem pomocniczym, nie dominującym badge

**Data sesji zamknięcia:** `2026-03-25`  
**Decyzja:** typ oprocentowania jest komunikowany już na pickerach, ale oszczędnie i bez ciężkiego efektu ramek w ramkach.  
**Dlaczego:** oznaczenia miały pomagać w skanowaniu, a nie dokładać wizualnego hałasu.  
**Wartość dla użytkownika:** selektor obligacji jest czytelniejszy i szybciej komunikuje różnice bez przeciążania ekranu.

## 9. Porównanie z lokatą i kontem zostaje otwarte od razu

**Data sesji zamknięcia:** `2026-03-26`  
**Decyzja:** sekcja `Porównaj z lokatą i kontem` jest domyślnie rozwinięta, choć nadal może być zwijana.  
**Dlaczego:** to jedna z najważniejszych warstw interpretacyjnych dla laika, więc nie powinna chować się za dodatkowym kliknięciem.  
**Wartość dla użytkownika:** użytkownik od razu dostaje znany punkt odniesienia dla wyniku obligacji.

## 10. CTA portfolio ma domyślnie zamykać layer, nie otwierać nową ścieżkę

**Data sesji zamknięcia:** `2026-03-26`  
**Decyzja:** w wersji osadzonej `Wróć do portfolio` ma zamykać layer, a fallback do `#kalkulator` zostaje tylko dla standalone.  
**Dlaczego:** najważniejsze było utrzymanie użytkownika w obrębie case study i domknięcie flow bez rozwalania kontekstu.  
**Wartość dla użytkownika:** narzędzie zachowuje się naturalnie wewnątrz portfolio i nie robi zbędnych skoków nawigacyjnych.

## 11. Aktualny prototyp wygrywa z szerszymi docs przy rewrite do Next.js

**Data sesji zamknięcia:** `2026-03-26`  
**Decyzja:** przy przepisywaniu do `Next.js` source of truth dla UI, UX, copy i zachowania jest aktualny prototyp, nawet jeśli starsze dokumenty są szersze albo brzmią inaczej.  
**Dlaczego:** decyzje produktowe były już domknięte na poziomie żywego artefaktu, a nie każdej wcześniejszej notatki.  
**Wartość dla użytkownika:** produkcyjna aplikacja zachowuje wypracowane doświadczenie zamiast gubić je przez reinterpretację dokumentacji.

## 12. Rewrite do Next.js ma zachować produkt 1:1

**Data sesji zamknięcia:** `2026-03-26`  
**Decyzja:** implementacja produkcyjna została potraktowana jako rewrite 1:1, z dopuszczalnymi odchyleniami tylko tam, gdzie wymagała tego architektura, accessibility albo testowalność.  
**Dlaczego:** celem nie było projektowanie produktu od nowa podczas wdrożenia.  
**Wartość dla użytkownika:** finalna aplikacja zachowuje ten sam spokojny, czytelny flow zamiast tracić jakość przez niepotrzebne reinterpretacje.

## 13. Kierunek polishu UX/UI jest decyzją użytkownika, nie sugestią AI

**Data sesji zamknięcia:** `2026-03-28`  
**Decyzja:** w późnym passie UX/UI kierunek zmian był prowadzony przez użytkownika, a agent realizował wdrożenie, testy i walidację.  
**Dlaczego:** ta iteracja nie była eksploracją nowego kierunku produktu, tylko świadomym dopieszczaniem wybranego doświadczenia.  
**Wartość dla użytkownika:** repo zachowuje uczciwy ślad procesu i pokazuje, że finalne decyzje UX/UI nie były autonomiczną kreacją AI.

## 14. Mobile dostaje własne hero wyniku i własną logikę priorytetów

**Data sesji zamknięcia:** `2026-03-28`  
**Decyzja:** na mobile priorytetem stał się answer-first hero przez floating wynik netto i szybsze wejście do kalkulatora kosztem wtórnych elementów first fold.  
**Dlaczego:** pomniejszony desktop nie dawał wystarczająco czytelnego wejścia w narzędzie na telefonie i w embeddzie.  
**Wartość dla użytkownika:** użytkownik mobilny szybciej widzi sens wyniku i mniej walczy z gęstością ekranu.

## 15. Mobile, embed i tablet portrait są traktowane jako osobne środowiska

**Data sesji zamknięcia:** `2026-03-28`  
**Decyzja:** mobile, wąski `iframe` i tablet portrait zostały potraktowane jako osobne środowiska z własnymi breakpointami i decyzjami layoutowymi.  
**Dlaczego:** jeden uniwersalny responsive layer nie wystarczał - część rozdzielczości wpadała w martwe progi między desktopem a telefonem.  
**Wartość dla użytkownika:** kalkulator lepiej zachowuje hierarchię, proporcje i czytelność na realnych urządzeniach, a nie tylko w skrajnym desktopie i skrajnym mobile.
