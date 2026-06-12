"use client";

import { Calendar } from "lucide-react";
import { formatIsoDateAsDots } from "@/lib/dateFormat";

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

/**
 * Calendar-first date field: tap anywhere to open the native picker.
 * Displays selected dates as DD.MM.YYYY (no manual typing).
 */
export default function DateInput({
  id,
  value,
  onChange,
  min,
  className = "",
  required,
  placeholder = "DD.MM.YYYY",
}: Props) {
  const display = value ? formatIsoDateAsDots(value) : "";

  const handleChange = (iso: string) => {
    if (!iso) {
      onChange("");
      return;
    }
    if (min && iso < min) return;
    onChange(iso);
  };

  return (
    <div className="relative w-full cursor-pointer">
      <input
        type="text"
        readOnly
        value={display}
        placeholder={placeholder}
        tabIndex={-1}
        aria-hidden
        className={`${className} pr-8 cursor-pointer caret-transparent select-none`}
      />
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        required={required}
        onChange={(e) => handleChange(e.target.value)}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 [color-scheme:dark]"
        aria-label={placeholder}
      />
      <span
        className="pointer-events-none absolute right-0 top-1/2 z-0 -translate-y-1/2 p-1 text-main/45"
        aria-hidden
      >
        <Calendar className="h-4 w-4" />
      </span>
    </div>
  );
}
