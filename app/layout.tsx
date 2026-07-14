import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Proport Portal",
  description: "Proport Pricing & Inquiry Management Portal — Integrated Computer Systems",
  icons: {
    icon: "/favicon.ico",
  },
};

import AppLayout from "./AppLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
