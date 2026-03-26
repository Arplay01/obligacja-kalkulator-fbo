const moneyFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("pl-PL");

const percentFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatInputNumber(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoney(value: number, options: { signed?: boolean } = {}) {
  const { signed = false } = options;
  const absValue = moneyFormatter.format(Math.abs(value));
  let prefix = "";

  if (signed) {
    prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  } else if (value < 0) {
    prefix = "-";
  }

  return `${prefix}${absValue} zł`;
}

export function formatMoneyRounded(
  value: number,
  options: { signed?: boolean } = {},
) {
  const { signed = false } = options;
  const absValue = integerFormatter.format(Math.round(Math.abs(value)));
  let prefix = "";

  if (signed) {
    prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  } else if (value < 0) {
    prefix = "-";
  }

  return `${prefix}${absValue} zł`;
}

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`;
}

export function formatInteger(value: number) {
  return integerFormatter.format(value);
}

export function formatGroupedInteger(value: number) {
  const [sign, digits] =
    value < 0
      ? ["-", Math.abs(Math.trunc(value)).toString()]
      : ["", Math.trunc(value).toString()];

  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
