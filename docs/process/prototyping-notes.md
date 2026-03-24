# Prototyping Notes

## Po co istnieje ten plik

To jest krótki zapis wniosków z wcześniejszego rapid prototypowania. Nie jest source-of-truth dla produktu.

## Wniosek główny

Pełne `PRD` nie nadaje się jako prompt do generowania prototypów. Gdy dokument miesza discovery, scope, narrację, logikę finansową i UX intent, modele produkują kilka podobnych, zbyt sztywnych i generycznych wariantów.

## Co działa lepiej

- krótki `prototype-brief`,
- jedna wyraźna teza na jeden prototyp,
- trzy różne architektury doświadczenia zamiast trzech wariacji tej samej koncepcji,
- ocena prototypów przez wspólną rubrykę, nie „na vibe”.

## Reguły pracy

- `brief` odpowiada na pytanie `dlaczego`.
- `PRD` odpowiada na pytanie `co`.
- `calculation-spec` odpowiada na pytanie `jak liczymy`.
- `prototype-brief` odpowiada na pytanie `co model ma zaprojektować teraz`.
- `prototype-review-rubric` odpowiada na pytanie `jak wybieramy kierunek`.

## Czego nie robić

- nie wrzucać pełnego discovery logu do promptu prototypującego,
- nie wpisywać gotowych rozwiązań interakcyjnych jako jedynej poprawnej ścieżki,
- nie prosić modelu o „zaskocz mnie”, jednocześnie zamykając go w zbyt wielu instrukcjach,
- nie traktować `kalkulatory-robocze/` jako kanonicznego inputu do nowej rundy pracy.
