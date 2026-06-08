"use client";

import { useEffect, useState } from "react";
import {
  formatIsoDateAsDots,
  maskDotsDateInput,
  parseDotsDateToIso,
} from "@/lib/dateFormat";

type Props = {
  id?: string;
  /** ISO `YYYY-MM-DD` */
  value: string;
  onChange: (iso: string) => void;
  /** ISO `YYYY-MM-DD` — dates before this are rejected */
  min?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
};

export default function DateInput({
  id,
  value,
  onChange,
  min,
  className,
  required,
  placeholder = "DD.MM.YYYY",
}: Props) {
  const [display, setDisplay] = useState(() => formatIsoDateAsDots(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplay(formatIsoDateAsDots(value));
    }
  }, [value, focused]);

  const handleChange = (raw: string) => {
    const masked = maskDotsDateInput(raw);
    setDisplay(masked);

    if (masked === "") {
      onChange("");
      return;
    }

    const iso = parseDotsDateToIso(masked);
    if (!iso) return;
    if (min && iso < min) return;
    onChange(iso);
  };

  const handleBlur = () => {
    setFocused(false);
    const iso = parseDotsDateToIso(display);
    if (iso) {
      setDisplay(formatIsoDateAsDots(iso));
      if (!min || iso >= min) onChange(iso);
      return;
    }
    setDisplay(formatIsoDateAsDots(value));
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      placeholder={placeholder}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      required={required}
      className={className}
      aria-label={placeholder}
    />
  );
}
