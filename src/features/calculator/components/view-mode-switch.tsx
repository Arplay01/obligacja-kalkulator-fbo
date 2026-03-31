import Link from "next/link";

type ViewModeSwitchProps = {
  mode: "calculator" | "comparison";
};

export function ViewModeSwitch({ mode }: ViewModeSwitchProps) {
  return (
    <nav className="view-mode-switch" aria-label="Przełącznik widoku">
      <Link
        className={`view-mode-switch__link${mode === "calculator" ? " view-mode-switch__link--active" : ""}`}
        href="/kalkulator"
        aria-current={mode === "calculator" ? "page" : undefined}
      >
        Obliczam
      </Link>
      <Link
        className={`view-mode-switch__link${mode === "comparison" ? " view-mode-switch__link--active" : ""}`}
        href="/porownaj"
        aria-current={mode === "comparison" ? "page" : undefined}
      >
        Porównuję
      </Link>
    </nav>
  );
}
