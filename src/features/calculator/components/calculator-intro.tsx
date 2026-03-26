export function CalculatorIntro() {
  return (
    <header className="intro" aria-label="Wprowadzenie">
      <div className="intro__main">
        <h1 className="intro__title">
          Sprawdź, ile mogą dać
          <span className="gradient-text"> obligacje skarbowe</span>
        </h1>
        <p className="intro__note">
          I porównaj wynik z lokatą albo kontem oszczędnościowym.
        </p>
      </div>
      <p className="intro__trust">
        <strong>Spokojny pierwszy krok.</strong>
        <span className="intro__trust-copy">
          Obligacje skarbowe są gwarantowane przez Skarb Państwa.
        </span>
      </p>
    </header>
  );
}
