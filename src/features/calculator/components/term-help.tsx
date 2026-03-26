type TermHelpProps = {
  label: string;
  tooltip: string;
  tooltipDataAttribute?: string;
};

export function TermHelp({
  label,
  tooltip,
  tooltipDataAttribute,
}: TermHelpProps) {
  return (
    <button className="term-help" type="button" aria-label={label}>
      <span aria-hidden="true">i</span>
      <span
        className="term-help__tooltip"
        role="tooltip"
        {...(tooltipDataAttribute ? { [tooltipDataAttribute]: true } : {})}
      >
        {tooltip}
      </span>
    </button>
  );
}

