import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//Autenticacion del proyecto por rutas
@Injectable({
  providedIn: 'root'
})

export class AuthGuardAdmin implements CanActivate {
  constructor(private authService:AuthService,
    private router: Router){}
    canActivate(): boolean {
      if(this.authService.isAuth()){
        return true;
      }else{
        this.router.navigateByUrl('/login');
        return false;
      }
    }
}
