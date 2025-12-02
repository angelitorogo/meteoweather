import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CurrentWeatherResponse {
  city: string;
  realCity?: string;
  country?: string;
  countryCode?: string;
  description: string;
  icon?: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  elevation?: number;
  cloudCover?: number;
  sunrise?: string;
  sunset?: string;
  timestamp: string;
  dailyMax?: number[];
  dailyMin?: number[];
  uvIndexMax?: number;
  precipitationSum?: number;
  precipitationProbabilityMax?: number;
  daylightDurationSeconds?: number;
  daylightDurationLabel?: string;
  sunshineDurationSeconds?: number;
  sunshineDurationLabel?: string;
  moonPhase?: number;       // 0–1
  moonPhaseIndex?: number;  // 0–7
  moonPhaseLabel?: string;
  raw: any;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // Puedes cambiar esto si prefieres otra forma de construir la URL
  private readonly baseUrl = `${environment.API_URL}/weather`;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<CurrentWeatherResponse> {

    const params = new HttpParams()
      .set('city', city);

    return this.http.get<CurrentWeatherResponse>(
      `${this.baseUrl}/current`,
      { params }
    );
  }

  getCurrentWeatherByCoords(
    lat: number,
    lon: number,
  ): Observable<CurrentWeatherResponse> {


    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())

    return this.http.get<CurrentWeatherResponse>(
      `${this.baseUrl}/current-by-coords`,
      { params }
    );
  }


}
