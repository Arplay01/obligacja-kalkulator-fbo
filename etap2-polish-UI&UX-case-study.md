# Etap 2 - Polish UI & UX

## Wersja skrócona pod case study i rozmowę z rekruterem

Ta iteracja nie była kosmetycznym liftingiem UI. Jej celem było uporządkowanie produktu tak, żeby:

- `/porownaj` stało się czytelnym, dojrzałym ekranem decyzyjnym,
- `/porownaj` i `/kalkulator` działały jak jeden spójny produkt,
- a początkujący użytkownik rozumiał nie tylko wynik, ale też co ten wynik oznacza w praktyce.

## 1. Problem: porównywarka zachowywała się jak zwykła długa strona

**Problem**  
Przy pracy na szerokim ekranie użytkownik tracił kontekst. Musiał scrollować całą stronę, a panel ustawień i najważniejsze elementy wyniku nie były stale pod ręką.

**Decyzja**  
Przebudowałem `/porownaj` na dashboardowy shell:

- fixed header,
- stała lewa kolumna z kontrolkami,
- prawa kolumna jako główny obszar scrolla,
- zachowanie dopasowane osobno do desktopu i mobile.

**Efekt**  
Porównywarka zaczęła działać jak narzędzie do pracy z wynikiem, a nie jak długi artykuł z formularzem. Użytkownik może jednocześnie zmieniać parametry i odczytywać efekt bez gubienia kontekstu.

## 2. Problem: `/porownaj` i `/kalkulator` zaczynały wyglądać jak dwa różne produkty

**Problem**  
Porównywarka rozwijała własne komponenty i wzorce wizualne, mimo że kalkulator miał już bardziej dopracowany język interfejsu.

**Decyzja**  
Spiąłem oba widoki przez wspólne źródła prawdy i wspólne komponenty:

- lewa kolumna ma ten sam charakter wizualny,
- kafelki wyboru obligacji są tożsame,
- badge i CTA korzystają z tego samego podejścia,
- aktualna oferta obligacji jest utrzymywana w jednym wspólnym miejscu.

**Efekt**  
Oba widoki są odbierane jako jeden produkt z dwoma trybami pracy, a nie dwa osobne narzędzia sklejone obok siebie.

## 3. Problem: sam wynik liczbowy nie wystarczał początkującemu użytkownikowi

**Problem**  
Osoba, która nie zna obligacji, nie potrzebuje tylko liczby. Potrzebuje prostego wyjaśnienia:

- która opcja jest najlepsza,
- dlaczego wygrywa,
- co oznacza brak działania,
- i gdzie kryje się realny koszt decyzji.

**Decyzja**  
Przepisaliśmy warstwę interpretacyjną prawej kolumny prostym językiem:

- rekomendacja pod wykresem tłumaczy najlepszą opcję,
- osobno pokazujemy koszt bezczynności,
- osobno wyjaśniamy, dlaczego lokata przegrywa,
- copy zostało napisane pod amatora, nie pod osobę znającą rynek.

**Efekt**  
Ekran nie tylko pokazuje wynik, ale też prowadzi do decyzji. To była zmiana z interfejsu "masz dane" na interfejs "rozumiesz, co z nich wynika".

## 4. Problem: wykres był zbyt obciążony dodatkowymi sygnałami

**Problem**  
Na wykresie pojawiało się coraz więcej oznaczeń, przez co zaczynał tracić czytelność. Dla początkującego odbiorcy ważniejsze było szybkie zrozumienie przebiegu serii niż pełny zestaw markerów naraz.

**Decyzja**  
Uznaliśmy, że czytelność ma pierwszeństwo:

- wykres trafił na samą górę prawej kolumny,
- uprościliśmy legendę i pomocnicze oznaczenia,
- markery wcześniejszego wyjścia zostały schowane z samego wykresu,
- ale informacja o nich została zachowana w tooltipie,
- ujednolicono też wizualną wagę linii i markerów.

**Efekt**  
Wykres stał się najmocniejszym i najczytelniejszym elementem ekranu. Nadal pokazuje ważne szczegóły, ale nie robi tego kosztem szybkiego zrozumienia wyniku.

## 5. Problem: liczba decyzji była abstrakcyjna i mało użyteczna

**Problem**  
Samo pokazanie "1 decyzja", "3 decyzje", "20 decyzji" nie tłumaczyło, dlaczego to w ogóle ma znaczenie.

**Decyzja**  
Zmieniliśmy perspektywę z liczby na realny wysiłek użytkownika. Zamiast mówić tylko o decyzjach, tłumaczymy, że taki moment oznacza zwykle:

- sprawdzenie różnych opcji,
- wybór odpowiedniej,
- i często przelew pieniędzy.

Dodatkowo pokazujemy, że im więcej takich momentów po drodze, tym łatwiej odłożyć temat na później i w praktyce zostać na słabszej opcji.

**Efekt**  
Sekcja zaczęła tłumaczyć nie tylko wynik finansowy, ale też koszt poznawczy i organizacyjny. To ważne zwłaszcza dla początkujących użytkowników, którzy często odpadają właśnie na etapie "trzeba będzie do tego wrócić".

## 6. Problem: produkt finansowy traci wiarygodność, jeśli używa nieaktualnych stawek

**Problem**  
Po zmianach w UI i UX nadal kluczowe było to, żeby wynik był aktualny i obroniony merytorycznie.

**Decyzja**  
Zaktualizowałem oba widoki do oferty obligacji z kwietnia 2026 i spiąłem je jednym źródłem prawdy dla:

- oprocentowania,
- marż,
- okresów promocyjnych,
- i założeń używanych w obliczeniach.

Przy okazji doprecyzowana została też logika benchmarków lokat i sposób uwzględniania podatku Belki.

**Efekt**  
Ta iteracja poprawiła nie tylko wygląd produktu, ale też jego wiarygodność. To ważne, bo w narzędziu finansowym dobra prezentacja bez poprawnej matematyki nie wystarcza.

## Końcowy efekt tej iteracji

Po tej sesji produkt stał się mocniejszy w trzech wymiarach:

- **UX** - łatwiej zrozumieć, gdzie podjąć decyzję i jak czytać wynik,
- **spójność produktu** - `/kalkulator` i `/porownaj` zaczęły działać jak jedna całość,
- **wiarygodność** - UI, copy i logika finansowa zostały domknięte razem, a nie osobno.

Najważniejsze jest to, że była to iteracja oparta nie na ozdabianiu ekranu, ale na redukcji tarcia i lepszym tłumaczeniu decyzji finansowej osobie, która dopiero wchodzi w temat obligacji.
