import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { AuthenticationService } from './../services/authentication/authentication.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {

  private token: string;
 
  constructor(public auth: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request);
    
    if ( request.url === environment.loginURL ) {
        request = request.clone({
            setHeaders: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            }
          });
          
          return next.handle(request);
    } else {
    
          return this.auth.getToken().pipe(
          switchMap(token => {
               const reqClone = request.clone({
                setHeaders: {
                          Authorization: `Bearer ` + token,
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                        } 
                });

              return next.handle(reqClone);
         }));
    }
    
    
  }
}
