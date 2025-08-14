import { ApiError } from "./api-error";

export class ServerError extends ApiError {
  constructor(
    message: string = "Server error. Please try again later.",
    details?: any
  ) {
    super(message, 500, details);
  }
}
