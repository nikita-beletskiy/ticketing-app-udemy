import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we're extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  arrangeErrors() {
    return this.errors.map(err => ({ message: err.msg, field: err.param }));
  }
}
