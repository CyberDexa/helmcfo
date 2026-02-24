import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HelmCFO", template: "%s · HelmCFO" },
  description: "AI-powered CFO for growing businesses. Cash flow forecasting, scenario planning, and board reporting — at a fraction of the cost.",
  metadataBase: new URL("https://helmcfo.com"),
  openGraph: {
    siteName: "HelmCFO",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
