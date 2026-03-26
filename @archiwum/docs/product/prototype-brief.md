# Prototype Brief - Runda 1 eksploracji

> Status note: to jest historyczny brief do pierwszej rundy eksploracji. Nie opisuje obecnego produktu i nie powinien być używany jako source of truth przy rewrite do Next.js.

## Cel

Wygenerować trzy wyraźnie różne kierunki PoC kalkulatora obligacji skarbowych bez karmienia modelu pełnym PRD.

Ten dokument jest jedynym właściwym wejściem do rapid prototypowania. `PRD` nie powinno być używane jako prompt generatora.

## Dla kogo jest ekran

Dla osoby początkującej, która:

- ma oszczędności na koncie lub lokacie,
- słyszała o obligacjach skarbowych,
- nie zna ich mechaniki,
- chce zrozumieć, co stanie się z jej pieniędzmi bez żargonu i bez presji.

## Jeden główny problem do rozwiązania

Pokazać w prosty, wiarygodny i spokojny sposób, co stanie się z pieniędzmi użytkownika przy różnych bezpiecznych opcjach oszczędzania.

## Must-have elementy

- jeden ekran,
- kwota wejściowa,
- horyzont,
- preset inflacji,
- porównanie konto oszczędnościowe vs TOS vs EDO,
- wyraźny wynik lub wykres,
- jawny wpływ inflacji,
- jawna warstwa zaufania: disclaimer + uproszczenia,
- sekcja „co dalej”.

## Czego model nie może robić

- nie może robić ciężkiego wieloetapowego wizarda,
- nie może zakładać wiedzy finansowej na wejściu,
- nie może robić generycznego dashboardu fintech,
- nie może sugerować, że obligacje są zawsze najlepsze,
- nie może przeciążyć ekranu inputami i tabelami,
- nie może kopiować FBO 1:1.

## Kierunek wizualny

- FBO-adjacent,
- wiarygodny, spokojny, czysty,
- desktop-first, full mobile support,
- bez „startup fintech slopu”,
- bez zimnego korporacyjnego tonu,
- bez przesadnie ozdobnych efektów wow.

## Osie eksploracji

W pierwszej rundzie chcemy trzy różne architektury doświadczenia, nie trzy wariacje kolorystyczne.

### 1. `Single-screen comparator`

Jeden ekran, natychmiastowe porównanie, minimum wejścia, nacisk na wykres i karty wyników.

### 2. `Guided decision flow`

Lekko prowadzony flow dla laika, ale bez pełnego wieloetapowego wizarda i bez chowania całego wyniku na końcu.

### 3. `Editorial explainer`

Kalkulator połączony z krótkim kontekstem edukacyjnym i interpretacją wyniku, mocniej oparty o zaufanie i spokojne zrozumienie.

## Wspólne constraints

- Segment A only.
- Prosty kalkulator webowy, nie webowy odpowiednik Excela.
- Core stack z ogłoszenia jako domyślność.
- Dane obligacji aktualizowane ręcznie.
- Ton edukacyjny, uczciwy, nieperswazyjny.

## Oczekiwany format odpowiedzi od modelu

- jeden kierunek na jeden prototyp,
- jednozdaniowa teza kierunku,
- jasne wskazanie, czym ten kierunek różni się od pozostałych,
- działający layout lub komponentowy PoC,
- bez dokładania kolejnych funkcji spoza briefu.
