"use client";

import { useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const display = value ? formatIsoDateAsDots(value) : "";

  const handleChange = (iso: string) => {
    if (!iso) {
      onChange("");
      return;
    }
    if (min && iso < min) return;
    onChange(iso);
  };

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    input.focus({ preventScroll: true });
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // Fall back to a normal click below when the browser refuses showPicker.
      }
    }
    input.click();
  };

  return (
    <div className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={openPicker}
        className={`${className} flex items-center justify-between gap-2 pr-8 text-left cursor-pointer`}
        aria-label={display || placeholder}
      >
        <span className={display ? "text-current" : "text-main/30"}>{display || placeholder}</span>
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        required={required}
        onChange={(e) => handleChange(e.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 [color-scheme:dark]"
        aria-label={placeholder}
        tabIndex={-1}
      />
      <span
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 p-1 text-main/45"
        aria-hidden
      >
        <Calendar className="h-4 w-4" />
      </span>
    </div>
  );
}
