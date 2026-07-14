import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { OrganizationService } from '../organization/organization.service.js';
import {
  weatherCodeIcon,
  weatherCodeLabel,
  type WeatherIconKind,
} from './weather-codes.js';

const CACHE_TTL_MS = 45 * 60 * 1000;

export type ClanWeatherDto = {
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

type CacheEntry = { expiresAt: number; payload: ClanWeatherDto };

type OpenMeteoResponse = {
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    precipitation_probability?: number;
    weather_code?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    precipitation?: number[];
    precipitation_probability?: number[];
    wind_speed_10m?: number[];
    weather_code?: number[];
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
  };
};

@Injectable()
export class WeatherService {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly organizationService: OrganizationService) {}

  async getClanForecast(
    user: User | null | undefined,
    orgAccessToken?: string,
  ): Promise<ClanWeatherDto> {
    const loc = await this.organizationService.resolveClanWeatherLocation(
      user,
      orgAccessToken,
    );
    if (loc.lat == null || loc.lng == null) {
      throw new NotFoundException(
        'Chưa có tọa độ từ đường. Cập nhật địa chỉ dòng họ rồi thử lại.',
      );
    }

    const cacheKey = `clan:${loc.orgId}:${roundCoord(loc.lat)}:${roundCoord(loc.lng)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.payload;
    }

    const payload = await this.fetchOpenMeteo(
      loc.lat,
      loc.lng,
      loc.clanAddress?.trim() || loc.name,
    );
    this.cache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload,
    });
    return payload;
  }

  private async fetchOpenMeteo(
    lat: number,
    lng: number,
    locationLabel: string,
  ): Promise<ClanWeatherDto> {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lng));
    url.searchParams.set('timezone', 'Asia/Ho_Chi_Minh');
    url.searchParams.set('forecast_days', '8');
    url.searchParams.set(
      'current',
      [
        'temperature_2m',
        'relative_humidity_2m',
        'wind_speed_10m',
        'weather_code',
      ].join(','),
    );
    url.searchParams.set(
      'hourly',
      [
        'temperature_2m',
        'precipitation',
        'precipitation_probability',
        'wind_speed_10m',
        'weather_code',
      ].join(','),
    );
    url.searchParams.set(
      'daily',
      [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
      ].join(','),
    );
    url.searchParams.set('wind_speed_unit', 'kmh');

    let data: OpenMeteoResponse;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Open-Meteo HTTP ${res.status}`);
      }
      data = (await res.json()) as OpenMeteoResponse;
    } catch {
      throw new ServiceUnavailableException(
        'Không lấy được dự báo thời tiết. Thử lại sau.',
      );
    }

    return mapOpenMeteo(data, locationLabel);
  }
}

function roundCoord(value: number): string {
  return value.toFixed(3);
}

function mapOpenMeteo(
  data: OpenMeteoResponse,
  locationLabel: string,
): ClanWeatherDto {
  const cur = data.current ?? {};
  const code = Number(cur.weather_code ?? 0);
  const hourlyTimes = data.hourly?.time ?? [];
  const now = cur.time ? Date.parse(cur.time) : Date.now();

  const hourly: ClanWeatherDto['hourly'] = [];
  for (let i = 0; i < hourlyTimes.length; i += 1) {
    const t = Date.parse(hourlyTimes[i] ?? '');
    if (!Number.isFinite(t) || t < now - 60 * 60 * 1000) continue;
    if (hourly.length >= 24) break;
    const hc = Number(data.hourly?.weather_code?.[i] ?? 0);
    hourly.push({
      time: hourlyTimes[i]!,
      temperatureC: Number(data.hourly?.temperature_2m?.[i] ?? 0),
      precipitationMm: Number(data.hourly?.precipitation?.[i] ?? 0),
      precipitationProbability: Number(
        data.hourly?.precipitation_probability?.[i] ?? 0,
      ),
      windKmh: Number(data.hourly?.wind_speed_10m?.[i] ?? 0),
      weatherCode: hc,
      icon: weatherCodeIcon(hc),
    });
  }

  const dailyTimes = data.daily?.time ?? [];
  const daily: ClanWeatherDto['daily'] = dailyTimes.map((date, i) => {
    const dc = Number(data.daily?.weather_code?.[i] ?? 0);
    return {
      date,
      temperatureMaxC: Number(data.daily?.temperature_2m_max?.[i] ?? 0),
      temperatureMinC: Number(data.daily?.temperature_2m_min?.[i] ?? 0),
      precipitationProbabilityMax: Number(
        data.daily?.precipitation_probability_max?.[i] ?? 0,
      ),
      weatherCode: dc,
      label: weatherCodeLabel(dc),
      icon: weatherCodeIcon(dc),
    };
  });

  return {
    locationLabel,
    timezone: data.timezone ?? 'Asia/Ho_Chi_Minh',
    updatedAt: new Date().toISOString(),
    current: {
      time: cur.time ?? new Date().toISOString(),
      temperatureC: Number(cur.temperature_2m ?? 0),
      humidity: Number(cur.relative_humidity_2m ?? 0),
      windKmh: Number(cur.wind_speed_10m ?? 0),
      precipitationProbability:
        hourly[0]?.precipitationProbability ??
        (cur.precipitation_probability == null
          ? null
          : Number(cur.precipitation_probability)),
      weatherCode: code,
      label: weatherCodeLabel(code),
      icon: weatherCodeIcon(code),
    },
    hourly,
    daily,
  };
}
