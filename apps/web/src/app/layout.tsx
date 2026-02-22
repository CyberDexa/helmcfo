import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChiefCFO — Autonomous Financial Intelligence",
  description:
    "AI-powered CFO that replaces the $5K–$15K/mo fractional CFO for companies with 5–200 employees.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
