import { ApiError } from "./api-error";

export class NetworkError extends ApiError {
  constructor(
    message: string = "Cannot connect to the server. Check your internet connection.",
    details?: any
  ) {
    super(message, 0, details); // Usamos 0 para errores de red
  }
}
