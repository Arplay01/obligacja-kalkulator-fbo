# Brainstorm: Gdzie ulokować oszczędności? - Design Ideas

## Kontekst
Narzędzie dla FBO (Finanse Bardzo Osobiste) pomagające początkującym porównać obligacje skarbowe z lokatami/kontami oszczędnościowymi. Odbiorca: osoba, która nigdy nie inwestowała, szuka spokoju i kontroli, zero tolerancji na żargon.

---

<response>
<idea>

## Idea 1: "Papierowa Mądrość" - Editorial / Newspaper Design

**Design Movement:** Editorial Design / New Journalism Typography - inspiracja gazetami finansowymi, ale ciepłymi i przyjaznymi, nie korporacyjnymi.

**Core Principles:**
1. Typografia jako nawigacja - nagłówki prowadzą wzrok, hierarchia jest czytelna bez ikon
2. Ciepło zamiast chłodu - kolory ziemi i papieru zamiast korporacyjnego niebieskiego
3. Informacja w kontekście - każda liczba ma wyjaśnienie obok, nie w tooltipie

**Color Philosophy:** Tło jak stary papier (kremowy #F5F0E8), tekst w ciemnym brązie (#2C2416), akcenty w ciepłym terakotowym (#C4553A) dla ważnych elementów i zielonym szałwiowym (#5B7B5E) dla pozytywnych wartości. Odejście od "finansowego niebieskiego" buduje zaufanie przez odmienność.

**Layout Paradigm:** Kolumnowy układ gazetowy - główna kolumna z kalkulatorem, boczna kolumna z wyjaśnieniami. Na mobile kolumny się składają naturalnie.

**Signature Elements:**
1. "Marginalia" - krótkie wyjaśnienia w bocznej kolumnie, jak notatki na marginesie książki
2. Linie oddzielające sekcje jak w gazecie, nie karty z cieniami

**Interaction Philosophy:** Spokojne, deliberatywne - użytkownik czyta i rozumie, nie klika chaotycznie. Suwaki zamiast pól tekstowych.

**Animation:** Minimalna - delikatne fade-in sekcji przy scrollu, płynne przejścia wartości w kalkulatorze. Bez efektów "wow".

**Typography System:** DM Serif Display dla nagłówków (serif, ciepły, czytelny), Source Sans 3 dla treści (humanistyczny sans-serif, doskonała czytelność).

</idea>
<text>Podejście gazetowe/edytorskie - ciepłe, papierowe tło, typografia prowadzi użytkownika jak artykuł. Marginalia z wyjaśnieniami. Spokojne, deliberatywne.</text>
<probability>0.08</probability>
</response>

<response>
<idea>

## Idea 2: "Ścieżka Decyzji" - Conversational Wizard / Guided Journey

**Design Movement:** Conversational UI / Guided Design - inspiracja najlepszymi onboardingami (Typeform, Linear), ale z polską ciepłotą.

**Core Principles:**
1. Jedno pytanie na raz - nie przytłaczaj, prowadź krok po kroku
2. Natychmiastowy feedback - każda zmiana parametru natychmiast aktualizuje wynik
3. Porównanie jest celem - nie "oblicz zysk z EDO", ale "co lepsze dla TWOJEJ sytuacji"

**Color Philosophy:** Czyste, jasne tło (#FAFAF8), głęboki granat (#1A1F36) jako główny tekst, ciepły bursztyn (#E8A838) jako akcent prowadzący wzrok, delikatny miętowy (#D4E8E0) dla pozytywnych wyników. Paleta buduje poczucie bezpieczeństwa i profesjonalizmu bez korporacyjności.

**Layout Paradigm:** Pełnoekranowe kroki (wizard) przechodzące w dashboard porównawczy. Krok 1-3: pytania. Krok 4: pełny widok porównawczy z wykresami.

**Signature Elements:**
1. Progress bar z etapami podróży - "Twoja sytuacja → Opcje → Porównanie → Twoja decyzja"
2. Karty porównawcze z subtelnymi gradientami - każda opcja (lokata, obligacje) ma swoją kartę z kluczowymi liczbami

**Interaction Philosophy:** Prowadzenie za rękę - użytkownik nigdy nie jest zagubiony, zawsze wie gdzie jest i co dalej. Suwaki z real-time preview.

**Animation:** Płynne przejścia między krokami (slide), animowane liczby (count-up), delikatne spring animations na kartach porównawczych.

**Typography System:** Plus Jakarta Sans (geometryczny, nowoczesny, ciepły) dla całości - różne wagi tworzą hierarchię. Tabular nums dla liczb.

</idea>
<text>Guided wizard - jedno pytanie na raz, prowadzenie za rękę, kończy się dashboardem porównawczym. Ciepły bursztyn + granat. Typeform meets financial planning.</text>
<probability>0.06</probability>
</response>

<response>
<idea>

## Idea 3: "Przejrzystość" - Swiss/Brutalist Data Design

**Design Movement:** Swiss International Style meets Data Visualization - klarowność, precyzja, szacunek dla danych. Inspiracja: Edward Tufte, Swiss posters.

**Core Principles:**
1. Dane mówią same za siebie - minimalna dekoracja, maksymalna czytelność
2. Siatka jako fundament - sztywny grid system, wszystko wyrównane
3. Kontrast jako hierarchia - rozmiar i waga fontu, nie kolory, tworzą strukturę

**Color Philosophy:** Prawie monochromatyczne - białe tło (#FFFFFF), czarny tekst (#111111), jeden akcent: intensywny pomarańczowy (#FF6B35) dla interaktywnych elementów i kluczowych danych. Szarości (#666, #999, #DDD) dla hierarchii. Prostota kolorystyczna = mniej decyzji wizualnych = więcej uwagi na treść.

**Layout Paradigm:** Sztywna siatka 12-kolumnowa, asymetryczna - dane po lewej (8 kolumn), kontekst po prawej (4 kolumny). Duże odstępy między sekcjami.

**Signature Elements:**
1. Duże, odważne liczby - wynik porównania w gigantycznym foncie, nie do przeoczenia
2. Minimalistyczne wykresy liniowe - czyste linie bez siatki, tylko dane

**Interaction Philosophy:** Bezpośrednia manipulacja - suwaki, przełączniki, natychmiastowa reakcja. Bez modali, bez kroków - wszystko na jednej stronie.

**Animation:** Funkcjonalna - animowane przejścia wartości, płynne przesuwanie wykresów. Zero dekoracyjnych animacji.

**Typography System:** Space Grotesk (geometryczny, techniczny, ale cieplejszy niż monospace) dla nagłówków i liczb, Inter dla treści objaśniającej.

</idea>
<text>Swiss brutalist data design - monochromatyczne z jednym akcentem, gigantyczne liczby, minimalna dekoracja. Tufte meets web calculator. Wszystko na jednej stronie.</text>
<probability>0.04</probability>
</response>

---

## Wybór: Idea 2 - "Ścieżka Decyzji"

**Dlaczego:** Dla odbiorcy FBO (osoba, która nigdy nie inwestowała, boi się podjąć złą decyzję) guided wizard jest najlepszym podejściem. Zamiast rzucać wszystkie opcje na raz, prowadzimy krok po kroku. To buduje pewność siebie i redukuje lęk przed "złą decyzją". Bursztynowo-granatowa paleta jest ciepła i profesjonalna - odróżnia się od zimnych, korporacyjnych kalkulatorów konkurencji.

Kluczowe decyzje:
- Flow: 3 kroki pytań → dashboard porównawczy
- Krok 1: "Ile masz do ulokowania?" (suwak)
- Krok 2: "Na jak długo możesz odłożyć te pieniądze?" (wybór okresu)
- Krok 3: "Co jest dla Ciebie ważniejsze?" (pewność zysku vs ochrona przed inflacją)
- Dashboard: Porównanie lokata vs obligacje pasujące do profilu, z wykresem wzrostu w czasie
