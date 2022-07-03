import {AppError} from "./AppError";

export class AuthorizationError extends AppError {

 
  constructor(error) {
    super(error);

  }

}