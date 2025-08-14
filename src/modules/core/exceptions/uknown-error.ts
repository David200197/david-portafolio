import { ApiError } from "./api-error";

export class UnknownError extends ApiError {
  constructor(
    message: string = "An unexpected error occurred.",
    details?: any
  ) {
    super(message, -1, details); // Usamos -1 para errores desconocidos
  }
}
