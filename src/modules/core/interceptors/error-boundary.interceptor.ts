import { ErrorInfo } from "react";
import { injectable } from "inversify";

@injectable()
export class ErrorBoundaryInterceptor {
  handle(error: Error, errorInfo?: ErrorInfo): void | Promise<void> {
    console.error("Error capturado:", error.message, errorInfo);
  }
}
