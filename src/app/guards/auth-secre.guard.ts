import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSecreGuard implements CanActivate {
  constructor(private authService:AuthService,
    private router: Router){}
    canActivate(): boolean {
      if(this.authService.isAuthSecre()){
        return true;
      }else{
        this.router.navigateByUrl('/login');
        return false;
      }
    }
}
