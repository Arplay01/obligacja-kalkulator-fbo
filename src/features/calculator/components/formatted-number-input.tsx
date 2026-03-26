"use client";

import {
  type FocusEvent,
  type InputHTMLAttributes,
  useState,
} from "react";

type FormattedNumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number;
  format: (value: number) => string;
  parse: (value: string, fallback: number) => number;
  onValueChange: (value: number) => void;
};

export function FormattedNumberInput({
  value,
  format,
  parse,
  onValueChange,
  onBlur,
  onFocus,
  ...inputProps
}: FormattedNumberInputProps) {
  const [draftValue, setDraftValue] = useState(() => format(value));
  const [isFocused, setIsFocused] = useState(false);

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    setDraftValue(format(value));
    onBlur?.(event);
  }

  return (
    <input
      {...inputProps}
      type="text"
      value={isFocused ? draftValue : format(value)}
      onChange={(event) => {
        const nextDraftValue = event.currentTarget.value;
        setDraftValue(nextDraftValue);
        onValueChange(parse(nextDraftValue, value));
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
