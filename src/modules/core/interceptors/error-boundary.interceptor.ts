import { ErrorInfo } from 'react'

export class ErrorBoundaryInterceptor {
  handle(error: Error, errorInfo?: ErrorInfo): void | Promise<void> {
    console.error('Error capturado:', error.message, errorInfo)
  }
}
