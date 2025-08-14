"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const client = new QueryClient();

type Props = { children: ReactNode };
export const QueryClientCustomProvider = ({ children }: Props) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
