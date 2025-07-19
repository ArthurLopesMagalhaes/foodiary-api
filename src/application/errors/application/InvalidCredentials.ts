import { ErrorCode } from '../errorCode';
import { ApplicationError } from './ApplicationError';

export class InvalidCredentials extends ApplicationError {
  public override statusCode = 401;
  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'EmailAlreadyInUse';
    this.message = 'Invalid credentials';
    this.code = ErrorCode.INVALID_CREDENTIALS;
  }

}
