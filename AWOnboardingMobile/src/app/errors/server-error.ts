import {AppError} from "./AppError";

export class ServerError extends AppError {


  constructor(error) {
    super(error);

  }

}