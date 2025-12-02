import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Coordinates {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  // Ciudad observable
  private citySubject = new BehaviorSubject<string>('');
  city$ = this.citySubject.asObservable();

  // Coordenadas observables (nueva parte)
  private coordsSubject = new BehaviorSubject<Coordinates | null>(null);
  coords$ = this.coordsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserCity(): Observable<string> {
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      map((res) => res.city || 'Ubicación desconocida'),
      tap((city) => this.citySubject.next(city)) // Actualiza el observable
    );
  }

  setCity(city: string) {
    this.citySubject.next(city); // 🔔 actualiza el observable global
  }

  setCoords(lat: number, lon: number) {
    this.coordsSubject.next({ lat, lon });
  }

  get currentCoords(): Coordinates | null {
    return this.coordsSubject.value;
  }


}
