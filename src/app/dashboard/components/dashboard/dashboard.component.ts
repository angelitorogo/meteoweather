// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../services/generales/location.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  isMenuOpen = false;
  
  constructor(private router: Router, private locationService: LocationService) {}


  ngOnInit() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          //console.log(latitude, longitude)
          this.locationService.setCoords(latitude, longitude);

        },
        (err) => {
          console.warn('Geolocalización denegada o fallida', err);

          // Fallback: IP
          this.geolocationIp();

        }
      );
    } else {

      // No hay geolocalización → IP directa
      this.geolocationIp();

    }
  }

  geolocationIp() {
    this.locationService.city$.subscribe(ciudad => {

      if(ciudad != '') {
        
      }
      
    });
  }

}
