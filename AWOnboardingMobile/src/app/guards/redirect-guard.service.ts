
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router, RouterStateSnapshot, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardService implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isValid = await this.authService.isTokenValid().toPromise();
    if (isValid) {

      if (this.router.url === '/' || this.router.url === '/login') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigateByUrl(this.router.url);
      }
      return true;

    } else {
      return true;
    }

  }

}
