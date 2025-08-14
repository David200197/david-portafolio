import { composeProviders } from "@/modules/core/utils/compose-providers";
import "./globals.css";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundaryProvider } from "@/modules/core/providers/ErrorBoundaryProvider";
import { DiProvider } from "@/modules/core/contexts/DiContext";
import { QueryClientCustomProvider } from "@/modules/core/providers/QueryClientCustomProvider";
import { Toaster } from "react-hot-toast";

const Provider = composeProviders([
  ErrorBoundaryProvider,
  DiProvider,
  QueryClientCustomProvider,
]);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "The Portfolio of a Fullstack Engineer",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <Toaster position="top-right" />
          {children}
        </Provider>
      </body>
    </html>
  );
}
