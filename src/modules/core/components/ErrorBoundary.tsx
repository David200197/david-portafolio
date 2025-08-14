"use client";

import { Container } from "inversify";
import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorBoundaryInterceptor } from "../interceptors/error-boundary.interceptor";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  container: Container;
}

// State del ErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const container = this.props.container;
    const errorBoundaryException = container.get(
      ErrorBoundaryInterceptor
    );
    errorBoundaryException.handle(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something Went Wrong</h1>;
    }

    return this.props.children;
  }
}
