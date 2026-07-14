import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type WeatherIconKind =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type ClanWeather = {
  locationLabel: string;
  timezone: string;
  updatedAt: string;
  current: {
    time: string;
    temperatureC: number;
    humidity: number;
    windKmh: number;
    precipitationProbability: number | null;
    weatherCode: number;
    label: string;
    icon: WeatherIconKind;
  };
  hourly: Array<{
    time: string;
    temperatureC: number;
    precipitationMm: number;
    precipitationProbability: number;
    windKmh: number;
    weatherCode: number;
    icon: WeatherIconKind;
  }>;
  daily: Array<{
    date: string;
    temperatureMaxC: number;
    temperatureMinC: number;
    precipitationProbabilityMax: number;
    weatherCode: number;
    label: string;
    icon: WeatherIconKind;
  }>;
};

export const weather = {
  clan: () =>
    axiosClient
      .get<ClanWeather>(API_ROUTES.WEATHER_CLAN)
      .then((r) => r.data),
};
