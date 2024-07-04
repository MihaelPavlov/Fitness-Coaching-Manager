import { EXCEPTION } from "../../constants/exceptions.constants";

export class InternalServerException extends Error {
  constructor() {
    super();
    this.message = EXCEPTION.INTERNAL_SERVER;
  }

  public code: number = 500;
}
