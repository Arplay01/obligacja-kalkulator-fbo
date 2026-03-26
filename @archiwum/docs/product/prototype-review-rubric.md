# Prototype Review Rubric

> Status note: ta rubryka służyła do oceny wcześniejszych kierunków prototypowych. Jest artefaktem procesu, a nie opisem aktualnego produktu.

## Jak używać

Każdy wygenerowany kierunek oceniamy w skali `1–5` dla każdego kryterium. Po ocenie dopisujemy jedno zdanie: „ten kierunek jest o X, a nie o Y”.

## Skala

- `1` - słabo lub nie spełnia celu,
- `3` - częściowo działa, ale wymaga istotnej korekty,
- `5` - mocny kierunek zgodny z celem PoC.

## Kryteria

| Kryterium                       | 1                                                        | 3                                                           | 5                                                              |
| ------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| **Jasność dla laika**           | użytkownik musi znać finanse, żeby zrozumieć ekran       | część ekranu jest jasna, ale wynik lub inputy nadal mylą    | użytkownik od razu rozumie, co porównuje i co widzi            |
| **Poczucie spokoju i zaufania** | UI budzi lęk, presję albo chaos                          | narzędzie jest neutralne, ale bez wyraźnej warstwy zaufania | narzędzie jest spokojne, uczciwe i wiarygodne                  |
| **Siła wyniku**                 | ekran pokazuje liczby, ale nie daje „aha momentu”        | wynik jest widoczny, ale wymaga dopowiedzenia               | wynik jest czytelny i od razu tłumaczy „co to znaczy dla mnie” |
| **Odrębność kierunku**          | wygląda jak wariacja innego prototypu                    | różni się trochę układem lub stylem                         | ma własną architekturę doświadczenia i własną tezę             |
| **Feasibility w core stacku**   | wymaga nierealistycznej ilości customowego UI lub logiki | da się dowieźć, ale kosztem dużej złożoności                | da się sensownie wdrożyć w zakładanym stacku PoC               |
| **Odporność na generyczność**   | to po prostu kolejny fintech calculator                  | część elementów jest świeża, ale ogólny vibe jest wtórny    | kierunek jest własny, ale nadal wiarygodny dla FBO             |

## Knockout criteria

Prototyp odpada niezależnie od punktów, jeśli:

- wygląda jak generyczny kalkulator z internetu,
- wymaga od użytkownika wiedzy finansowej na wejściu,
- chowa wynik za zbyt dużą liczbą kroków,
- zachowuje się jak perswazyjny landing sprzedażowy,
- jest zbyt daleko od wiarygodności i tonu FBO.

## Reguła wyboru

Do dalszego dopracowania przechodzi tylko kierunek, który:

- nie odpada na knockout criteria,
- ma wysoką ocenę za jasność dla laika,
- ma wysoką ocenę za zaufanie,
- naprawdę różni się od pozostałych architekturą doświadczenia, a nie tylko fontem i kolorem.
