import { AfterViewInit, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit{


  constructor() {

  }


  ngOnInit(): void {
   

  }

  ngAfterViewInit(): void {


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
