import { ErrorCode } from '../errorCode';

export abstract class ApplicationError extends Error {
  public statusCode?: number;
  public abstract code: ErrorCode;
}
