import { ApiError } from "./api-error";

export class UnauthorizedError extends ApiError {
  constructor(
    message: string = "Unauthorized. Please log in again.",
    details?: any
  ) {
    super(message, 401, details);
  }
}
