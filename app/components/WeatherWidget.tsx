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
    <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Cloud className="w-4 h-4 text-water" />
        <p className="text-xs uppercase tracking-[0.2em] text-main/50 font-sans">
          {t("weather")}
        </p>
      </div>
      
      <p className="font-heading text-2xl text-main">
        {displayTemp()}
      </p>

      <p className="text-[9px] text-main/30 mt-3 leading-relaxed">
        {t("weatherAttribution")}
      </p>
    </div>
  );
}
