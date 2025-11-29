import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../services/generales/location.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, public locationService: LocationService) {}

  isMenuOpen = false;

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
