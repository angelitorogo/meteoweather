import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentWeatherResponse, WeatherService } from '../../services/funcionales/weather.service';
import { Subscription } from 'rxjs';
import { Coordinates, LocationService } from '../../services/generales/location.service';

interface WeeklyDay {
  date: string;
  label: string;
  max: number;
  min: number;
  isToday: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy{

  city: string | null = null;
  weather: CurrentWeatherResponse | null = null;

  loading = false;
  error: string | null = null;

  private subs = new Subscription();


  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
  ) {}
  

  ngOnInit(): void {
    // 📌 Nos suscribimos a cambios de coordenadas
    const coordsSub = this.locationService.coords$
      .subscribe((coords) => {
        // Si recibimos coords, siempre priorizamos coords
        if (coords) {
          this.loadWeather(coords, this.city);
        }
      });

    // 📌 Nos suscribimos a cambios de ciudad
    const citySub = this.locationService.city$
      .subscribe((city) => {
        if (city && city !== this.city) {
          this.city = city;
          // Solo cargamos por ciudad si NO tenemos coords aún
          if (!this.locationService.currentCoords) {
            this.loadWeather(null, city);
          }
        }
      });

    this.subs.add(coordsSub);
    this.subs.add(citySub);
  }

  ngAfterViewInit(): void {


  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadWeather(
    coords: Coordinates | null,
    city: string | null,
  ): void {
    this.loading = true;
    this.error = null;
    this.weather = null;

    let request$;

    if (coords) {
      // ✔ Prioridad: coordenadas
      request$ = this.weatherService.getCurrentWeatherByCoords(
        coords.lat,
        coords.lon,
      );
    } else if (city) {
      // ✔ Fallback: ciudad
      request$ = this.weatherService.getCurrentWeather(city);
    } else {
      // ❌ No tenemos nada con lo que preguntar
      this.loading = false;
      this.error = 'No se ha podido determinar tu ubicación.';
      return;
    }

    const wSub = request$.subscribe({
      next: (data) => {
        console.log(data)
        this.weather = data;
        // en este punto habria que actualizar el observable city$ de location service de alguna manera
        
        this.locationService.setCity(this.weather.city);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando el tiempo', err);
        this.error = 'No se ha podido cargar el tiempo ahora mismo.';
        this.loading = false;
      },
    });

    this.subs.add(wSub);
  }

  // Helpers para mostrar iconos o textos
  getWeatherIcon(): string {
    if (!this.weather) return 'bi-cloud';
    const code = (this.weather.icon || '').toLowerCase();

    if (code.includes('sun') || code.includes('clear')) return 'bi-brightness-high';
    if (code.includes('cloud')) return 'bi-cloud';
    if (code.includes('rain')) return 'bi-cloud-rain';
    if (code.includes('storm')) return 'bi-cloud-lightning-rain';
    if (code.includes('snow')) return 'bi-snow';

    return 'bi-cloud';
  }

  getPrettyTime(iso?: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  /**
   * Pronóstico semanal a partir de:
   * - weather.dailyMax
   * - weather.dailyMin
   * - weather.raw.daily.time (fechas ISO)
   */
  get weeklyForecast(): WeeklyDay[] {
    if (
      !this.weather ||
      !this.weather.dailyMax?.length ||
      !this.weather.dailyMin?.length ||
      !this.weather.raw?.daily?.time
    ) {
      return [];
    }

    const times: string[] = this.weather.raw.daily.time;
    const today = new Date();

    const days: WeeklyDay[] = times.map((iso, idx) => {
      const d = new Date(iso);
      const isToday = d.toDateString() === today.toDateString();

      const label = isToday
        ? 'Hoy'
        : d.toLocaleDateString('es-ES', {
            weekday: 'short',
          });

      return {
        date: iso,
        label,
        max: this.weather!.dailyMax![idx],
        min: this.weather!.dailyMin![idx],
        isToday,
      };
    });

    // Por si el backend devuelve más de 7 días, nos quedamos con 7
    return days.slice(0, 7);
  }



  getUvBadgeClass(uv?: number): string {
    if (uv == null) return 'uv-badge--none';
    if (uv < 3) return 'uv-badge--low';
    if (uv < 6) return 'uv-badge--moderate';
    if (uv < 8) return 'uv-badge--high';
    if (uv < 11) return 'uv-badge--very-high';
    return 'uv-badge--extreme';
  }

  getUvLabel(): string {
    if (!this.weather?.uvIndexMax && this.weather?.uvIndexMax !== 0) return '-';
    const uv = this.weather.uvIndexMax;

    if (uv < 3) return 'Bajo';
    if (uv < 6) return 'Moderado';
    if (uv < 8) return 'Alto';
    if (uv < 11) return 'Muy alto';
    return 'Extremo';
  }

  getRainChanceLabel(): string {
    if (!this.weather?.precipitationProbabilityMax && this.weather?.precipitationProbabilityMax !== 0) return '-';
    const p = this.weather.precipitationProbabilityMax;

    if (p < 20) return 'Muy baja';
    if (p < 50) return 'Baja';
    if (p < 80) return 'Moderada';
    return 'Alta';
  }

  /** 🔵 Cobertura de sombra (0 = luna llena, 1 = luna nueva) */
  getMoonCover(): number {
    if (this.weather?.moonPhase == null) return 0;
    const phase = this.weather.moonPhase; // 0..1
    // Distancia normalizada al punto de luna llena (0.5)
    const distanceFromFull = Math.abs(0.5 - phase) / 0.5; // 0..1
    return distanceFromFull;
  }

  /** 🔵 Dirección de la sombra: creciente (izquierda) / menguante (derecha) */
  getMoonPhaseDirectionClass(): string {
    if (this.weather?.moonPhase == null) return 'moon--waxing';
    const phase = this.weather.moonPhase;
    if (phase < 0.5) return 'moon--waxing';  // creciente
    if (phase > 0.5) return 'moon--waning';  // menguante
    return 'moon--waxing'; // en llena da igual, pero dejamos una por defecto
  }

  /** % de iluminación aproximado a partir de moonPhase (0–1) */
  getMoonIllumination(): string {
    if (this.weather?.moonPhase == null) return '-';
    const phase = this.weather.moonPhase; // 0 = nueva, 0.5 = llena, 1 = nueva
    const illum =
      phase <= 0.5
        ? phase * 2 * 100
        : (1 - phase) * 2 * 100;

    return `${Math.round(illum)}%`;
  }



  /*

  // Método para realizar el logout
  logout() {
    this._authService.logout().subscribe({
      next: (response) => {
        //console.log(response.message); // Mensaje de logout exitoso
        // Redirigir al usuario a la página de login
        this._authService.setUser(null);
      },
      error: (err) => {
        console.error('Error en logout:', err);
      },
    });
  }

  comprobarUser() {

    this._authService.getUserInfo().subscribe({
      next: (response) => {
        this._authService.setUser(response.user); // Guarda el usuario en el servicio
        //console.log('Usuario autenticado:', response.user);
      },
      error: (err) => {
        //console.log('No hay usuario logado o token inválido.');
        this._authService.setUser(null);
      },
    });
    
  }

  */

  

}
