import { EXCEPTION } from "../../constants/exceptions.constants";

export class BadRequestException extends Error {
  constructor() {
    super();
    this.message = EXCEPTION.BAD_REQUEST;
  }

  public code: number = 400;
}
