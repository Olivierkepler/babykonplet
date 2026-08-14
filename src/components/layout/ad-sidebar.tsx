import Link from "next/link";
import Image from "next/image";

type AdSlot = {
  id: string;
  imageUrl: string;
  href: string;
  alt: string;
  label?: string | null;
};

type AdSidebarProps = {
  ads: AdSlot[];
  title?: string;
};

export default function AdSidebar({
  ads,
  title = "Sponsored",
}: AdSidebarProps) {
  if (ads.length === 0) {
    return null;
  }

  return (
    <aside
      aria-labelledby="ad-sidebar-heading"
      className="sticky top-[92px] hidden h-fit w-64 shrink-0 flex-col gap-4 xl:flex"
    >
      <h2
        id="ad-sidebar-heading"
        className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"
      >
        {title}
      </h2>

      <div className="flex flex-col gap-4">
        {ads.map((ad) => (
          <Link
            key={ad.id}
            href={ad.href}
            className="group relative block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-15px_rgba(10,37,64,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(10,37,64,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4f7b] focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden ">
              <Image
                src={ad.imageUrl}
                alt={ad.alt}
                fill
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                sizes="256px"
              />

              {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2540]/40 via-transparent to-transparent" /> */}

              <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 backdrop-blur">
                Ad
              </span>
            </div>

            {ad.label && (
              <p className="px-3.5 py-3 text-[13px] font-semibold leading-snug text-[#0a2540]">
                {ad.label}
              </p>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}