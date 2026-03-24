# Brainstorm: Kalkulator Obligacji Skarbowych – Pomysły na Design

---

<response>
<text>

## Idea 1: "Finanse Spokojne" – Editorial Finance

**Design Movement:** Swiss/International Typographic Style meets modern editorial finance (think: Bloomberg Businessweek meets Notion)

**Core Principles:**
1. Informacja ponad dekorację – każdy piksel służy zrozumieniu danych
2. Hierarchia wizualna przez typografię, nie kolory
3. Przestrzeń oddechowa – duże marginesy, czytelne sekcje
4. Zaufanie przez prostotę – brak "krzykliwych" elementów

**Color Philosophy:** Monochromatyczna baza z jednym akcentem. Ciepłe szarości (#F7F5F2 tło, #1A1A1A tekst) z akcentem w kolorze szmaragdowej zieleni (#10B981) nawiązującym do FBO. Zieleń symbolizuje wzrost i bezpieczeństwo finansowe. Brak gradientów – flat, czyste kolory.

**Layout Paradigm:** Asymetryczny układ z lewym panelem nawigacyjnym (stepper/progress) i główną przestrzenią roboczą po prawej. Na mobile – pełnoekranowy flow krok po kroku. Dane wejściowe i wyniki NIE na jednym ekranie – prowadzenie użytkownika.

**Signature Elements:**
1. Duże, odważne liczby wynikowe (72px+) z subtelną animacją odliczania
2. Minimalistyczne linie oddzielające sekcje zamiast kart z cieniami
3. Ikony w stylu line-art, monochromatyczne

**Interaction Philosophy:** Spokojne, celowe interakcje. Slider do inflacji zamiast pola input. Tooltips wyjaśniające każdy termin prostym językiem. Brak nagłych zmian – płynne przejścia.

**Animation:** Subtelne fade-in sekcji przy scrollu. Liczby "odliczają" do wartości docelowej (counting animation). Wykresy rysują się od lewej do prawej. Micro-interactions na hover: lekkie powiększenie elementów interaktywnych.

**Typography System:** DM Sans (nagłówki, 700) + Inter (body, 400/500). Nagłówki 2.5rem, body 1rem, dane liczbowe w DM Mono dla czytelności tabelarycznej.

</text>
<probability>0.06</probability>
</response>

---

<response>
<text>

## Idea 2: "Kalkulator Kieszonkowy" – Warm Utility Design

**Design Movement:** Soft Brutalism meets Scandinavian Utility (think: Linear.app meets Klarna)

**Core Principles:**
1. Ciepło i przystępność – finanse nie muszą być zimne i korporacyjne
2. Jeden ekran, jeden cel – zero przytłaczania
3. Natychmiastowy feedback – każda zmiana parametru od razu aktualizuje wynik
4. Edukacja wbudowana w interfejs – tooltips i mikro-wyjaśnienia

**Color Philosophy:** Ciepła, przyjazna paleta. Kremowe tło (#FFFBF5) z akcentami w ciepłym indygo (#4F46E5) i miętowej zieleni (#34D399). Indygo buduje zaufanie (bankowość), mięta sygnalizuje pozytywny wynik. Karty z delikatnym cieniem i zaokrąglonymi rogami (12px radius) tworzą wrażenie "kart do gry" – każda obligacja to karta.

**Layout Paradigm:** Card-based, single-column na mobile, 2-kolumnowy grid na desktop (lewa: parametry, prawa: wyniki w real-time). Każdy typ obligacji jako interaktywna karta, którą można "odwrócić" by zobaczyć szczegóły. Sticky summary bar na dole mobile.

**Signature Elements:**
1. "Karty obligacji" z zaokrąglonymi rogami i kolorowym paskiem u góry (inny kolor per typ)
2. Animated progress ring pokazujący realną stopę zwrotu vs inflacja
3. Emoji-like ikony do kategoryzacji (🛡️ bezpieczne, 📈 wzrostowe, 👨‍👩‍👧 rodzinne)

**Interaction Philosophy:** Zabawowa ale informacyjna. Drag-and-drop do porównywania. Suwaki z "snap points" na typowych wartościach inflacji. Natychmiastowe przeliczanie – zero przycisków "Oblicz".

**Animation:** Sprężyste animacje (spring physics) przy otwieraniu kart. Płynne morphing liczb przy zmianie parametrów. Confetti-like particles przy osiągnięciu wyniku powyżej inflacji. Skeleton loading z pulse animation.

**Typography System:** Plus Jakarta Sans (nagłówki, 600/700) + Outfit (body, 400/500). Zaokrąglone, przyjazne kroje. Liczby w Tabular Nums dla wyrównania kolumn.

</text>
<probability>0.08</probability>
</response>

---

<response>
<text>

## Idea 3: "Forteca Finansowa" – Dashboard Clarity

**Design Movement:** Data-Dense Clarity inspired by Stripe Dashboard meets Apple's Human Interface Guidelines

**Core Principles:**
1. Gęstość informacji bez chaosu – dużo danych, ale perfekcyjnie zorganizowanych
2. Progressive disclosure – najpierw prosty widok, szczegóły na żądanie
3. Porównanie jako rdzeń UX – tabela porównawcza to centrum doświadczenia
4. Kontekst zawsze widoczny – użytkownik nigdy nie traci z oczu swoich założeń

**Color Philosophy:** Chłodna profesjonalna baza z ciepłymi akcentami. Białe tło (#FFFFFF) z subtelnymi szarymi sekcjami (#F9FAFB). Główny akcent: głęboki morski (#0EA5E9) dla interaktywnych elementów. Zielony (#22C55E) dla zysków, czerwony (#EF4444) dla strat. Wykresy w gradiencie od morskiego do zielonego – wizualizacja "wzrostu".

**Layout Paradigm:** Top-down flow z sticky header pokazującym aktualne założenia. Trzy sekcje: (1) Parametry w kompaktowym pasku, (2) Tabela porównawcza jako główny element, (3) Szczegółowe wykresy poniżej. Na mobile: accordion-style z sekcjami rozwijalnymi. Desktop: pełny dashboard z side-by-side comparison.

**Signature Elements:**
1. "Sparkline" mini-wykresy w każdym wierszu tabeli porównawczej
2. Floating summary card z najlepszą opcją (always visible)
3. Gradient bar pod nagłówkiem sekcji wyników, wizualizujący skalę zysku

**Interaction Philosophy:** Precyzyjna i responsywna. Kliknięcie w wiersz tabeli rozwija szczegółowy breakdown. Hover na wykresie pokazuje dokładne wartości. Toggle IKE/IKZE natychmiast przelicza wszystko. Porównanie 2 wybranych obligacji w trybie split-screen.

**Animation:** Smooth height transitions przy rozwijaniu sekcji. Chart draw animations z easing. Number morphing przy zmianie parametrów (odometer-style). Subtle parallax na hero section. Staggered fade-in dla wierszy tabeli.

**Typography System:** Geist Sans (nagłówki, 600/700) + Geist Sans (body, 400/500) – jeden font, wiele wag. Tabular figures dla wszystkich liczb. Monospace (Geist Mono) dla kluczowych wartości procentowych.

</text>
<probability>0.07</probability>
</response>
