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

## 16. Końcowy audit UX/UI jest prowadzony na żywym buildzie, nie w oderwaniu od produktu

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** końcowy polish został przeprowadzony jako audit działającej aplikacji, rozdzielony na dwie warstwy: ścieżkę użytkownika i późniejszy tuning wizualny.  
**Dlaczego:** dopiero na żywym ekranie było widać, które elementy realnie spowalniają decyzję, dublują się albo mają złą wagę wizualną.  
**Wartość dla użytkownika:** poprawki wzmacniają realne tempo korzystania z kalkulatora zamiast dodawać przypadkowe ozdobniki.

## 17. Wynik finansowy ma być zawsze poprawny i transparentnie opisany

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** hero wyniku ma zawsze pokazywać finalną wartość jako bezpieczny fallback, a copy zostało doprecyzowane do formy `Szacowany zysk netto`, żeby nie obiecywać fałszywej pewności.  
**Dlaczego:** chwilowe `0,00 zł` i zbyt kategoryczny język natychmiast podważały wiarygodność kalkulatora finansowego.  
**Wartość dla użytkownika:** użytkownik dostaje wynik, któremu łatwiej zaufać - poprawny technicznie i uczciwie opisany.

## 18. Selekcja obligacji ma być prowadzona językiem czasu, nie skrótów serii

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** picker obligacji został uporządkowany wokół pytania o czas odkładania pieniędzy, a symbol serii przesunięto do trzeciej warstwy informacji.  
**Dlaczego:** początkujący użytkownik myśli kategorią czasu i celu, a nie skrótów typu `OTS`, `COI` czy `EDO`.  
**Wartość dla użytkownika:** wejście do kalkulatora jest bardziej naturalne i nie wymaga znajomości technicznego języka obligacji.

## 19. Wyjaśnienia i założenia mają być blisko decyzji, ale nie na jej drodze

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** edukacyjne treści i wyjaśnienia mechaniki zostały przesunięte niżej, do sekcji disclosure, a kluczowe założenia porównania i inflacji zostały pokazane przy samym wyniku lub przy odpowiednich kontrolkach.  
**Dlaczego:** blok edukacyjny wstawiony między obietnicę a kalkulator spowalniał wejście, a ukryte defaulty lokaty i konta osłabiały zrozumienie porównania.  
**Wartość dla użytkownika:** użytkownik najpierw liczy, a dopiero potem sięga głębiej - ale nadal rozumie najważniejsze założenia bez szukania ich po ekranie.

## 20. Końcowy ekran ma opowiadać jedną decyzję, nie kilka osobnych faktów

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** wynik, wpływ inflacji, porównanie i głębsze sekcje zostały spięte w jedną narrację: od odpowiedzi, przez koszt bezruchu, po dodatkowe szczegóły i materiały.  
**Dlaczego:** osobne liczby i osobne sekcje nie składały się automatycznie w prosty wniosek dla początkującej osoby.  
**Wartość dla użytkownika:** kalkulator prowadzi do decyzji czytelniej, bo mówi nie tylko `ile możesz zyskać`, ale też `co to znaczy w praktyce`.

## 21. Lżejszy wariant wizualny staje się nowym defaultem produktu

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** po osobnym eksperymencie wizualnym wybrany został lżejszy kierunek z białą bazą strony, spokojniejszymi powierzchniami kart i czerwonym akcentem bliższym identyfikacji FBO, a następnie został wdrożony na `main`.  
**Dlaczego:** wcześniejsza, bardziej kremowa warstwa wizualna zbyt mocno zlewała tło, formularz i karty, przez co wynik i hierarchia sekcji traciły czytelność.  
**Wartość dla użytkownika:** ekran jest lżejszy, wyraźniej prowadzi wzrok do odpowiedzi i lepiej rozdziela strefę działania od strefy wyniku.

## 22. Layout kalkulatora został przebudowany pod hierarchię odpowiedzi, a nie równowagę kolumn

**Data sesji zamknięcia:** `2026-03-29`  
**Decyzja:** po audycie UX/UI przebudowana została waga layoutu: lewa kolumna została uproszczona jako strefa konfiguracji, prawa dostała więcej przestrzeni jako strefa odpowiedzi, hero wyniku zyskało większy oddech, a sekcje wtórne zostały rozdzielone mocniejszym rytmem pionowym.  
**Dlaczego:** wcześniejszy układ był zbyt równy wizualnie - formularz, wynik i kolejne sekcje konkurowały o uwagę zamiast prowadzić użytkownika do najważniejszej odpowiedzi.  
**Wartość dla użytkownika:** ekran czytelniej komunikuje, gdzie podejmuje się decyzję, a gdzie dostaje się odpowiedź, dzięki czemu kalkulator jest łatwiejszy do skanowania i szybszy w użyciu.

## 23. Porównywarka wychodzi jako osobna ścieżka po kalkulatorze

**Data sesji zamknięcia:** `2026-03-31`  
**Decyzja:** porównanie długiego horyzontu zostało wdrożone jako osobna trasa `/porownaj`, zamiast rozbudowywać główny ekran `/kalkulator` o kolejną warstwę dashboardu.  
**Dlaczego:** kalkulator główny odpowiada na proste pytanie o jedną serię obligacji, a porównywarka wymaga szerszego układu, większego wykresu i innego tempa eksploracji.  
**Wartość dla użytkownika:** początkująca osoba nadal dostaje prosty punkt wejścia, a bardziej świadomy użytkownik ma naturalny kolejny krok bez przeciążania pierwszego ekranu.

## 24. Obliczam i Porównuję stają się dwoma trybami jednego narzędzia

**Data sesji zamknięcia:** `2026-03-31`  
**Decyzja:** oba widoki zostały spięte wspólnym przełącznikiem `Obliczam / Porównuję`, osadzonym na górze lewej kolumny.  
**Dlaczego:** osobna porównywarka bez wyraźnego przejścia mogłaby wyglądać jak drugi, niezależny produkt zamiast rozwinięcia tego samego flow.  
**Wartość dla użytkownika:** łatwiej przechodzić między szybkim policzeniem jednej obligacji a szerszym porównaniem scenariuszy.

## 25. Porównywarka może wejść na main jako świadomy WIP preview

**Data sesji zamknięcia:** `2026-03-31`  
**Decyzja:** `/porownaj` zostało wypuszczone na `main` jako publicznie widoczny preview z celowym blurrem, blokadą interakcji i komunikatem `Praca w trakcie`.  
**Dlaczego:** zespół chciał pokazać kierunek produktu i zachować spójny routing już teraz, ale bez udawania, że warstwa porównawcza jest ostatecznie domknięta.  
**Wartość dla użytkownika:** użytkownik widzi, dokąd rozwija się narzędzie, a jednocześnie nie dostaje mylącego sygnału, że niedokończona porównywarka jest już pełnoprawnym, zaufanym workflow.
