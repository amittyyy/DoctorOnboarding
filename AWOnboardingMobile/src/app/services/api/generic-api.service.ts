import { FileInput } from './../../models/FileInput';
import { LoginError } from './../../errors/login-error';
import { GeneralError } from './../../errors/general-error';
import { UserLogin } from './../../models/UserLogin';

import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { NotFoundError } from '../../errors/not-found-error';
import { ServerError } from '../../errors/server-error';
import { AuthorizationError } from '../../errors/authorization-error';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { map, catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenericApiService {

  constructor(private http: HttpClient) { }


  loginAPI(userLogin: UserLogin) {
    const body = 'client_id=' + environment.clientId +
      '&grant_type=' + 'password' +
      '&username=' + userLogin.username +
      '&password=' + userLogin.password +
      '&firmcode=' + environment.appName +
      '&name=' + userLogin.name;

    return this.http.post(environment.loginURL, body)
    .pipe(
      timeout(30000),
      catchError( err => throwError(this.handleError(err)))
    );

  }

  refreshLoginAPI(userLogin: UserLogin) {
    const body = 'client_id=' + environment.clientId +
      '&grant_type=' + 'refresh_token' +
      '&refresh_token=' + userLogin.refreshToken;

    return this.http.post(environment.loginURL, body)
    .pipe(
      timeout(30000),
      catchError( err => throwError(this.handleError(err)))
    );

  }

  get(endpoint: string, time  = 30000) {
    return this.http.get(environment.connectionURL + endpoint)
      .pipe(
        timeout(time),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }

  put(endpoint, resources) {
    return this.http.put(environment.connectionURL + endpoint, resources)
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((response: HttpResponse<any>) => response),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }

  update(endpoint, resources) {

    return this.http.put(environment.connectionURL + endpoint, resources)
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((response: HttpResponse<any>) => response),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }

  post(endpoint, resources) {
    return this.http.post(environment.connectionURL + endpoint, resources)
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((response: HttpResponse<any>) => response),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }

  deleteResource(endpoint) {
    return this.http.delete(environment.connectionURL + endpoint)
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((response: HttpResponse<any>) => response),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }

  downloadPDF(endpoint, resources) {
    return this.http.post(environment.connectionURL + endpoint, resources, { responseType: 'blob' })
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((res: Blob) =>  new Blob([res], { type: 'application/pdf' })),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }
  downloadDocuments(endpoint) {
    return this.http.get(environment.connectionURL + endpoint, { responseType: 'blob' })
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((res: Blob) =>  new Blob([res])),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }


  uploadFile(endpoint, file: FileInput) {
    return this.http.post(environment.connectionURL + endpoint, file)
      .pipe(
        timeout(30000),
        catchError( err => throwError(this.handleError(err)))
      );
    // .pipe(
    //   map((response: HttpResponse<any>) => response),
    //   catchError( err => throwError(this.handleError(err)))
    // );
  }

   handleError(error: HttpErrorResponse) {
    console.log(error);

    if ( error.status === 404) {
      return new NotFoundError(error);
    }
     if ( error.status === 500) {
      return new ServerError(error);
     }
     if ( error.status === 401) {
      return new AuthorizationError(error);
     }  else if ( error.status === 400) {
      return new LoginError(error);
    } else {
        return new GeneralError(error);
     }
  }

}
