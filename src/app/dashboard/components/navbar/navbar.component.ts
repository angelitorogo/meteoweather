import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../services/generales/location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  city$!: Observable<string>;

  constructor(private router: Router, public locationService: LocationService) {}

  

  ngOnInit(): void {
    // Asignamos directamente el observable del servicio
    this.city$ = this.locationService.city$;

    // Opcional: cargar ciudad desde la API al iniciar
    this.locationService.getUserCity().subscribe();
  }


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
