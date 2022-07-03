import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import {  Router, RouterStateSnapshot, CanActivate, ActivatedRouteSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const isValid = await this.authService.isTokenValid().toPromise();

    if (isValid) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
