"use client";

import { useState } from "react";
import { useClanWeather } from "@/hooks/useClanWeather";
import { UI } from "@/lib/constants/ui-strings";
import {
  formatHourLabel,
  formatTempC,
  formatWeekdayShort,
} from "@/utils/weather-display";
import { WeatherGlyph } from "./WeatherGlyph";

type ChartTab = "temp" | "rain" | "wind";

export default function EventsWeatherCard() {
  const { data, loading, error, missingCoords } = useClanWeather();
  const [tab, setTab] = useState<ChartTab>("temp");

  return (
    <div className="overflow-hidden rounded-xl border border-[#d4c3c1] bg-white shadow-sm">
      <div className="border-b border-[#ece0df] bg-gradient-to-br from-[#fff8f4] via-white to-[#e8f0ff]/50 px-4 py-3">
        <h4 className="text-sm font-semibold text-[#321716]">
          {UI.EVENTS_WEATHER_TITLE}
        </h4>
        <p className="mt-0.5 truncate text-xs text-[#504443]">
          {loading
            ? UI.LOADING
            : data?.locationLabel || UI.EVENTS_WEATHER_LOCATION_FALLBACK}
        </p>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-xs text-[#504443]">{UI.EVENTS_WEATHER_LOADING}</p>
        ) : missingCoords ? (
          <p className="text-xs text-[#504443]">{UI.EVENTS_WEATHER_NO_COORDS}</p>
        ) : error || !data ? (
          <p className="text-xs text-[#504443]">{UI.EVENTS_WEATHER_ERROR}</p>
        ) : (
          <WeatherBody data={data} tab={tab} onTabChange={setTab} />
        )}
      </div>
    </div>
  );
}

function WeatherBody({
  data,
  tab,
  onTabChange,
}: {
  data: NonNullable<ReturnType<typeof useClanWeather>["data"]>;
  tab: ChartTab;
  onTabChange: (t: ChartTab) => void;
}) {
  const { current, hourly, daily } = data;
  const chartHours = hourly.slice(0, 12);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1e8] text-[#944a00]">
          <WeatherGlyph kind={current.icon} className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-semibold text-[#321716]">
              {formatTempC(current.temperatureC)}
            </span>
            <span className="truncate text-xs text-[#504443]">
              {current.label}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#6b5a59]">
            {[
              UI.EVENTS_WEATHER_HUMIDITY(Math.round(current.humidity)),
              UI.EVENTS_WEATHER_WIND(Math.round(current.windKmh)),
              current.precipitationProbability != null
                ? UI.EVENTS_WEATHER_RAIN_CHANCE(
                    Math.round(current.precipitationProbability),
                  )
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-[#f6f1ef] p-1">
        {(
          [
            ["temp", UI.EVENTS_WEATHER_TAB_TEMP],
            ["rain", UI.EVENTS_WEATHER_TAB_RAIN],
            ["wind", UI.EVENTS_WEATHER_TAB_WIND],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition ${
              tab === id
                ? "bg-white text-[#321716] shadow-sm"
                : "text-[#6b5a59] hover:text-[#321716]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <HourlyStrip hours={chartHours} tab={tab} />

      <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
        {daily.slice(0, 7).map((day) => (
          <div
            key={day.date}
            className="flex min-w-[3.25rem] flex-col items-center gap-1 rounded-lg px-1.5 py-1.5 text-center"
          >
            <span className="text-[10px] font-medium text-[#6b5a59]">
              {formatWeekdayShort(day.date)}
            </span>
            <span className="text-[#944a00]">
              <WeatherGlyph kind={day.icon} className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-semibold text-[#321716]">
              {formatTempC(day.temperatureMaxC)}
            </span>
            <span className="text-[10px] text-[#8a7775]">
              {formatTempC(day.temperatureMinC)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HourlyStrip({
  hours,
  tab,
}: {
  hours: NonNullable<ReturnType<typeof useClanWeather>["data"]>["hourly"];
  tab: ChartTab;
}) {
  if (hours.length === 0) return null;

  const values = hours.map((h) => {
    if (tab === "rain") return h.precipitationProbability;
    if (tab === "wind") return h.windKmh;
    return h.temperatureC;
  });
  const max = Math.max(...values, 1);

  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
      {hours.map((h, i) => {
        const value = values[i] ?? 0;
        const barH = Math.max(8, Math.round((value / max) * 40));
        const label =
          tab === "rain"
            ? `${Math.round(value)}%`
            : tab === "wind"
              ? `${Math.round(value)}`
              : formatTempC(value);

        return (
          <div
            key={h.time}
            className="flex min-w-[2.5rem] flex-col items-center gap-1"
          >
            <span className="text-[10px] font-medium text-[#321716]">
              {label}
            </span>
            <div className="flex h-10 items-end">
              <div
                className="w-2 rounded-full bg-[#fc8f34]/80"
                style={{ height: barH }}
              />
            </div>
            <span className="text-[10px] text-[#8a7775]">
              {formatHourLabel(h.time)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
