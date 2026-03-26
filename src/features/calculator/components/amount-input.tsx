"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  useMemo,
  useState,
} from "react";
import { normaliseAmount } from "@/features/calculator/lib/calculator";
import { formatGroupedInteger } from "@/features/calculator/lib/formatters";

type AmountInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number;
  onValueChange: (value: number) => void;
};

function parseDigits(value: string) {
  const digitsOnly = value.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return null;
  }

  return Number.parseInt(digitsOnly, 10);
}

function getAmountFontSize(displayValue: string) {
  const length = displayValue.length;

  if (length <= 7) {
    return "clamp(2rem, 4vw, 2.65rem)";
  }

  if (length === 8) {
    return "clamp(1.8rem, 3.6vw, 2.35rem)";
  }

  if (length === 9) {
    return "clamp(1.6rem, 3.2vw, 2.05rem)";
  }

  if (length === 10) {
    return "clamp(1.4rem, 2.8vw, 1.8rem)";
  }

  return "clamp(1.2rem, 2.4vw, 1.55rem)";
}

export function AmountInput({
  value,
  onValueChange,
  onBlur,
  onFocus,
  style,
  ...inputProps
}: AmountInputProps) {
  const [draftValue, setDraftValue] = useState(() => formatGroupedInteger(value));
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = isFocused ? draftValue : formatGroupedInteger(value);
  const mergedStyle = useMemo(
    () =>
      ({
        ...(style ?? {}),
        "--amount-input-font-size": getAmountFontSize(displayValue),
      }) as CSSProperties & { "--amount-input-font-size": string },
    [displayValue, style],
  );

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    setDraftValue(formatGroupedInteger(value));
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(false);

    const parsedValue = parseDigits(draftValue);

    if (parsedValue !== null) {
      const normalisedValue = normaliseAmount(parsedValue);
      onValueChange(normalisedValue);
      setDraftValue(formatGroupedInteger(normalisedValue));
    } else {
      setDraftValue(formatGroupedInteger(value));
    }

    onBlur?.(event);
  }

  return (
    <input
      {...inputProps}
      type="text"
      value={displayValue}
      style={mergedStyle}
      onChange={(event) => {
        const parsedValue = parseDigits(event.currentTarget.value);

        if (parsedValue === null) {
          setDraftValue("");
          return;
        }

        setDraftValue(formatGroupedInteger(parsedValue));
        onValueChange(parsedValue);
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
