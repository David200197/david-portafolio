import { ApiError } from "./api-error";

export class ForbiddenError extends ApiError {
  constructor(
    message: string = "Access denied. You do not have permission.",
    details?: any
  ) {
    super(message, 403, details);
  }
}
