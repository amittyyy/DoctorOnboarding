import { HttpErrorResponse } from '@angular/common/http';
export class AppError extends HttpErrorResponse  {

  public description: string;

  constructor(error) {
    super(error);
    if ( (this.description = error.error['error_description']) === undefined) {
      this.description = JSON.stringify(error);
    }
   
  }
  }
  
