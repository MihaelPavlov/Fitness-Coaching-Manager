import { EXCEPTION } from "../../constants/exceptions.constants";

export class NotFoundException extends Error {
  constructor() {
    super();
    this.message = EXCEPTION.NOT_FOUND;
  }

  public code: number = 404;
}
