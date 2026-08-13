import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "../components/layout/site-shell";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "DJADOR FAMILY STORE",
  description: "Your trusted online shopping destination",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
