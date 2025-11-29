import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getUserCity(): Observable<string> {
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      map((res) => res.city || 'Ubicación desconocida')
    );
  }
}
