export class KnexValidationException extends Error {
  constructor(message = "Database Validation Error") {
    super(message);
    this.message = message;
  }

  public code: number = 422;
}
