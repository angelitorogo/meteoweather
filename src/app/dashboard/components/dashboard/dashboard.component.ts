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
  currentYear = new Date().getFullYear();
  city: string = '...';

  constructor(private router: Router, private locationService: LocationService) {}

  ngOnInit() {
    this.locationService.getUserCity().subscribe((city) => {
      this.city = city;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onNavigate(): void {
    this.closeMenu();
  }

  onAccountClick(): void {
    this.closeMenu();
    // Aquí más adelante podrás comprobar si está logado o no.
    // De momento lo mandamos al login.
    this.router.navigate(['/auth/login']);
  }
}
