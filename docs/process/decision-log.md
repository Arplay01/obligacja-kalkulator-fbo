# Decision log

Krótki log najważniejszych decyzji produktowych, UX i UI. Kolejność ma znaczenie, bo pokazuje, jak zmieniał się sam produkt.

## 1. Rozdzielenie dokumentacji produktu od promptów do prototypowania

**Decyzja:** `PRD` przestało być promptem do generowania prototypów.  
**Dlaczego:** pełny dokument mieszał zbyt wiele warstw naraz i prowadził do zbyt sztywnych, generycznych odpowiedzi.  
**Wartość dla użytkownika:** łatwiej było eksplorować różne kierunki doświadczenia bez wklejania zbyt dużej liczby założeń do jednego promptu.

## 2. Głównym odbiorcą zostaje początkujący użytkownik

**Decyzja:** produkt skupia się na osobie, która chce zrozumieć pierwszy krok.  
**Dlaczego:** to właśnie tu widać największy problem z lękiem, niepewnością i finansowym przeciążeniem.  
**Wartość dla użytkownika:** interfejs może być prostszy, spokojniejszy i bardziej ludzki.

## 3. Excel zostaje dla zaawansowanych

**Decyzja:** webowy PoC nie próbuje zastąpić arkusza Marcina 1:1.  
**Dlaczego:** próba zrobienia jednego narzędzia dla wszystkich szybko rozwadniała produkt.  
**Wartość dla użytkownika:** początkujący dostaje prostszy ekran, a zaawansowany nadal ma swoją warstwę głębi.

## 4. Zamiast jednej ścieżki od razu eksplorujemy kilka kierunków

**Decyzja:** najpierw powstało kilka różnych prototypów i shelli.  
**Dlaczego:** szybciej było porównać architektury doświadczenia niż debatować o nich w próżni.  
**Wartość dla użytkownika:** finalny kierunek nie jest przypadkowy. Jest wybrany po sprawdzeniu realnych alternatyw.

## 5. Wybrany zostaje FBO-led shell

**Decyzja:** dalsze iteracje idą w kierunku bardziej FBO-led niż portfolio-led.  
**Dlaczego:** ten wariant lepiej wspierał redakcyjny charakter treści i mniej pachniał "narzędziem z case study".  
**Wartość dla użytkownika:** ekran jest bliżej języka i klimatu, którego użytkownik może oczekiwać od FBO.

## 6. Pivot od szerokiego porównywacza do answer-first flow

**Decyzja:** centrum produktu przestało być szerokie porównywanie, a stał się nim pojedynczy, natychmiastowy wynik.  
**Dlaczego:** szerokie porównania i analityczne widoki podnosiły próg wejścia.  
**Wartość dla użytkownika:** użytkownik szybciej rozumie, po co tu jest i co może zrobić dalej.

## 7. Upraszczanie przez redukcję ramek i copy

**Decyzja:** interfejs był regularnie odchudzany z boxów, etykiet i zbyt technicznych komunikatów.  
**Dlaczego:** dużo elementów mówiło podobną rzecz kilka razy albo odbierało uwagę najważniejszym liczbom.  
**Wartość dla użytkownika:** mniej szumu, lepsza hierarchia i spokojniejszy odbiór.

## 8. Progressive disclosure dla trudniejszych warstw

**Decyzja:** szczegóły kalkulacji, edukacja i porównania zostały schowane do disclosure.  
**Dlaczego:** laik nie potrzebuje całej mechaniki, żeby zrozumieć sens wyniku.  
**Wartość dla użytkownika:** ekran nie przytłacza na starcie, ale nadal daje głębię na żądanie.

## 9. Koszt bezruchu stał się jednym z głównych value props

**Decyzja:** blok `Co się stanie, jeśli nic nie zrobisz?` trafił wysoko, tuż pod hero.  
**Dlaczego:** sam zysk to za mało. Użytkownik lepiej rozumie sens działania, gdy widzi koszt bezruchu.  
**Wartość dla użytkownika:** produkt nie tylko liczy, ale pomaga emocjonalnie zrozumieć, po co w ogóle działać.

## 10. CTA zakupowe dostało własne miejsce

**Decyzja:** po wyniku pojawiło się wyraźne `Jak kupić?`.  
**Dlaczego:** kalkulator bez kolejnego kroku kończył się za wcześnie.  
**Wartość dla użytkownika:** jeśli użytkownik jest gotowy, dostaje prostą ścieżkę działania zamiast końca ekranu.

## 11. Produkt został przygotowany pod osadzenie w portfolio

**Decyzja:** karta `Wróć do portfolio` i cały flow zostały zaprojektowane pod działanie wewnątrz case study.  
**Dlaczego:** kalkulator ma wzmacniać historię produktu, a nie żyć jako osobny byt.  
**Wartość dla użytkownika:** przejścia między narzędziem a case study są naturalne i nie rozwalają kontekstu.

## 12. Rewrite do Next.js nie zmienia produktu

**Decyzja:** implementacja produkcyjna została potraktowana jako rewrite 1:1, a nie nowa iteracja UX/UI.  
**Dlaczego:** etap decyzji produktowych i dopracowania doświadczenia był już zamknięty na poziomie prototypu referencyjnego.  
**Wartość dla użytkownika:** finalna aplikacja zachowuje ten sam spokojny, czytelny flow zamiast tracić jakość przez niepotrzebne reinterpretacje podczas wdrożenia.
