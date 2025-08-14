import { ApiError } from "./api-error";

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found.", details?: any) {
    super(message, 404, details);
  }
}
