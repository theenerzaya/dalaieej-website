"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  tempC: number;
  tempF: number;
}

export default function WeatherWidget() {
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
    if (loading) return "Loading...";
    if (error || !weather) return "-5.0°C | 23.0°F";
    return `${weather.tempC.toFixed(1)}°C | ${weather.tempF.toFixed(1)}°F`;
  };

  return (
    <div className="text-center md:text-left py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-main/50 mb-2 font-sans">
        Weather Conditions
      </p>
      
      <p className="font-heading text-2xl md:text-3xl text-main">
        {displayTemp()}
      </p>

      <div className="mt-3">
        <a
          href="#"
          className="text-xs font-bold uppercase tracking-widest border-b border-main/40 pb-1 hover:border-main transition-colors text-main/70 hover:text-main"
        >
          Webcam
        </a>
      </div>

      <p className="text-[9px] text-main/30 mt-3 leading-relaxed">
        Weather data provided by OpenWeatherMap.<br />
        © OpenWeather Ltd, Open License.
      </p>
    </div>
  );
}
