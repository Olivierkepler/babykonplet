import { notFound } from "next/navigation";
import { prisma } from "../../../../../../lib/prisma";
import PromoBannerForm from "../../../../../../components/admin/promo-banner-form";

export default async function EditPromoBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const banner = await prisma.promoBanner.findUnique({
    where: { id },
  });

  if (!banner) {
    notFound();
  }

  return (
    <PromoBannerForm
      bannerId={banner.id}
      initial={{
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        href: banner.href,
        isActive: banner.isActive,
      }}
    />
  );
}