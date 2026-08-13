"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should NOT inherit the main Navbar and Footer
  const hideChrome =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-otp") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // Render these pages without the global Navbar/Footer
  if (hideChrome) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  // Normal storefront layout
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}