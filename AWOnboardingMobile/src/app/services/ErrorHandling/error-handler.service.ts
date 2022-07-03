import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {

  handleError(error: Error | HttpErrorResponse) {


    console.log( 'HERE' +   error);
 }
}
