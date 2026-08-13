import type { ReactNode } from "react";
import Image from "next/image";
type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/auth/background.png')",
      }}
    >
<nav className="absolute left-0 top-0 w-full flex items-center justify-between p-6 z-10">
  <a href="/" className="flex items-center hover:scale-105 transition-all duration-300">
    {/* Example logo SVG */}
    {/* <span className="h-8 w-8 rounded-full bg-[#ff4f7b] flex items-center justify-center text-white font-bold text-lg">M</span> */}
   <div className="  flex items-center justify-center">
   <Image src="/favicons/favicon-512x512.png" alt="Logo" width={100} height={100} />
   </div>
    <span className=" text-xl font-bold text-[#082b55]">Baby <span className="text-pink-500">Konple</span></span>
  </a>
  {/* You can add links or actions here */}
</nav>

      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Left side intentionally left open for the background artwork */}
        <div className="hidden lg:block" />

        {/* Right side */}
        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="w-full max-w-[680px] rounded-[36px] border border-white/70 bg-white/90 px-7 py-9 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-md sm:px-10 sm:py-10 lg:px-12">
            {/* Top icon */}
            {/* <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-10 w-10 text-[#ff4f7b]"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 8h12l-1 12H7L6 8Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                <path d="M9.5 14.5c.8 1 1.6 1.5 2.5 1.5s1.7-.5 2.5-1.5" />
              </svg>
            </div> */}

            <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-[#082b55] sm:text-4xl">
              {title}
            </h1>

            {/* <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-7 text-slate-500 sm:text-base">
              {subtitle}
            </p> */}

            <div className="mt-9">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}