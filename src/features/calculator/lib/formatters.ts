const THOUSANDS_SEPARATOR = "\u00A0";

function getSignPrefix(value: number, signed: boolean) {
  if (signed) {
    return value > 0 ? "+" : value < 0 ? "-" : "";
  }

  return value < 0 ? "-" : "";
}

function groupThousands(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
}

function formatDecimalValue(
  value: number,
  options: {
    minimumFractionDigits: number;
    maximumFractionDigits: number;
  },
) {
  const { minimumFractionDigits, maximumFractionDigits } = options;
  const rounded = Math.abs(value).toFixed(maximumFractionDigits);
  const [integerPart, fractionPart = ""] = rounded.split(".");
  let trimmedFraction = fractionPart;

  while (
    trimmedFraction.length > minimumFractionDigits &&
    trimmedFraction.endsWith("0")
  ) {
    trimmedFraction = trimmedFraction.slice(0, -1);
  }

  const groupedIntegerPart = groupThousands(integerPart);

  if (!trimmedFraction) {
    return groupedIntegerPart;
  }

  return `${groupedIntegerPart},${trimmedFraction}`;
}

export function formatInputNumber(value: number) {
  return formatDecimalValue(value, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  });
}

export function formatMoney(value: number, options: { signed?: boolean } = {}) {
  const { signed = false } = options;
  const absValue = formatDecimalValue(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = getSignPrefix(value, signed);

  return `${prefix}${absValue} zł`;
}

export function formatMoneyRounded(
  value: number,
  options: { signed?: boolean } = {},
) {
  const { signed = false } = options;
  const absValue = groupThousands(Math.round(Math.abs(value)).toString());
  const prefix = getSignPrefix(value, signed);

  return `${prefix}${absValue} zł`;
}

export function formatPercent(value: number) {
  return `${formatDecimalValue(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export function formatInteger(value: number) {
  const absoluteInteger = Math.abs(Math.trunc(value)).toString();
  const prefix = value < 0 ? "-" : "";

  return `${prefix}${groupThousands(absoluteInteger)}`;
}

export function formatGroupedInteger(value: number) {
  return formatInteger(value);
}
