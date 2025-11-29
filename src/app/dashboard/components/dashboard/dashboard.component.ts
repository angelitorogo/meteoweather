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
    this.locationService.getUserCity().subscribe((city) => {
      this.locationService.setCity(city);
    });
  }

}
