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
      { url: "/images/logo/favicon.ico" },
      { url: "/images/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo/favicon-16x16.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/images/logo/favicon.ico",
    shortcut: "/images/logo/favicon.ico",
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