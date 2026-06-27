"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

interface WeatherData {
  tempC: number;
  tempF: number;
}

interface WeatherWidgetProps {
  className?: string;
  label?: string;
}

export default function WeatherWidget({ className, label }: WeatherWidgetProps) {
  const locale = useLocale();
  const isMn = locale === "mn";
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Weather fetch error:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, []);

  const weatherLabel =
    label ?? (isMn ? "Цаг агаарын мэдээ" : "Weather Conditions");
  const temperatureText =
    loading || error || !weather
      ? "—°C | —°F"
      : `${Math.round(weather.tempC)}°C | ${weather.tempF.toFixed(1)}°F`;

  return (
    <section
      className={["w-fit text-left", className].filter(Boolean).join(" ")}
      aria-label={isMn ? "Хатгалын цаг агаар" : "Khatgal weather conditions"}
    >
      <p className="font-cta text-[10px] font-medium uppercase leading-none tracking-[0.24em] text-main/55 md:text-[11px]">
        {weatherLabel}
      </p>
      <p
        className={[
          "mt-2 whitespace-nowrap leading-none text-main/90",
          isMn ? "font-serif-mn" : "font-serif-en",
          "text-[2rem] md:text-[2.1rem] lg:text-[2.6rem]",
        ].join(" ")}
        aria-live="polite"
      >
        {temperatureText}
      </p>
    </section>
  );
}
