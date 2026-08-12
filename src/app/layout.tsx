import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
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
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}