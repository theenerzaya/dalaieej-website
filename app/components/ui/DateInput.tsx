"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
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
  const nativeRef = useRef<HTMLInputElement>(null);
  const [display, setDisplay] = useState(() => formatIsoDateAsDots(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplay(formatIsoDateAsDots(value));
    }
  }, [value, focused]);

  const commitIso = (iso: string) => {
    if (min && iso < min) return;
    onChange(iso);
    setDisplay(formatIsoDateAsDots(iso));
  };

  const handleChange = (raw: string) => {
    const masked = maskDotsDateInput(raw);
    setDisplay(masked);

    if (masked === "") {
      onChange("");
      return;
    }

    const iso = parseDotsDateToIso(masked);
    if (!iso) return;
    commitIso(iso);
  };

  const handleBlur = () => {
    setFocused(false);
    const iso = parseDotsDateToIso(display);
    if (iso) {
      commitIso(iso);
      return;
    }
    setDisplay(formatIsoDateAsDots(value));
  };

  const openCalendar = () => {
    const el = nativeRef.current;
    if (!el) return;
    try {
      el.showPicker?.();
    } catch {
      el.focus();
      el.click();
    }
  };

  const handleNativeChange = (iso: string) => {
    if (!iso) {
      onChange("");
      setDisplay("");
      return;
    }
    commitIso(iso);
  };

  return (
    <div className="relative w-full">
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
        className={className ? `${className} pr-8` : "pr-8"}
        aria-label={placeholder}
      />
      <button
        type="button"
        onClick={openCalendar}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-main/45 hover:text-main transition-colors"
        aria-label="Open calendar"
      >
        <Calendar className="w-4 h-4" aria-hidden />
      </button>
      <input
        ref={nativeRef}
        type="date"
        value={value}
        min={min}
        tabIndex={-1}
        aria-hidden
        onChange={(e) => handleNativeChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}
