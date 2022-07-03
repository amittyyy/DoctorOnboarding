import { GeneralError } from './../errors/general-error';
import { LoginError } from './../errors/login-error';
import { AuthorizationError } from './../errors/authorization-error';
import { ServerError } from './../errors/server-error';
import { NotFoundError } from './../errors/not-found-error';


import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {

  constructor(public auth: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request)
    .pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response
          console.log(event);
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
            // Ideally a 401 means the token expired so it checks validity and sends user
            // back to relog
            // @todo perhaps show a modal instead?
          // if (err.status === 401) {
          //   console.log('401');
          //   if ( !this.auth.isTokenValid()) {
              
          //   }
          // }
          
          if ( error.status === 404) {
            throwError(new NotFoundError(error));
          }
           if ( error.status === 500) {
            throwError(new ServerError(error));
           }
           if ( error.status === 401) {
            throwError(new AuthorizationError(error));
           }  else if ( error.status === 400) {
            throwError(new LoginError(error));
          } else {
            throwError(new GeneralError(error));
           }
        }
      })
    );
  }
}
