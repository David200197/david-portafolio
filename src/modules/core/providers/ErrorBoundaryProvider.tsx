"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import container from "../di/container";

type Props = { children: ReactNode };

export const ErrorBoundaryProvider = ({ children }: Props) => (
  <ErrorBoundary container={container}>{children}</ErrorBoundary>
);
