"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Cloud } from "lucide-react";

interface WeatherData {
  tempC: number;
  tempF: number;
}

export default function WeatherWidget() {
  const t = useTranslations("footer");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const displayTemp = () => {
    if (loading) return "—";
    if (error || !weather) return "—";
    return `${weather.tempC.toFixed(1)}°C | ${weather.tempF.toFixed(1)}°F`;
  };

  return (
    <div className="relative inline-block mt-1">
      {/* Cloud SVG shape as background */}
      <svg
        viewBox="0 0 200 120"
        className="w-56 h-auto drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M160 100H46c-18 0-32-14-32-32 0-16 12-29 27-31C43 20 57 8 74 8c14 0 26 8 31 20 4-2 9-4 15-4 18 0 32 14 32 32v1c14 2 24 14 24 27 0 9-5 16-16 16z"
          className="fill-white/[0.07]"
        />
        <path
          d="M160 100H46c-18 0-32-14-32-32 0-16 12-29 27-31C43 20 57 8 74 8c14 0 26 8 31 20 4-2 9-4 15-4 18 0 32 14 32 32v1c14 2 24 14 24 27 0 9-5 16-16 16z"
          className="stroke-white/10"
          strokeWidth="1.5"
        />
      </svg>
      {/* Temperature text centered inside the cloud */}
      <div className="absolute inset-0 flex items-center justify-center pt-4 pr-3">
        <p className="font-body text-lg text-main/70 whitespace-nowrap">
          {displayTemp()}
        </p>
      </div>
    </div>
  );
}
