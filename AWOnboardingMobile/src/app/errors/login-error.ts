import {AppError} from './AppError';

export class LoginError extends AppError {


  public description: string;

  constructor(error) {
    super(error);
    
  }

}
