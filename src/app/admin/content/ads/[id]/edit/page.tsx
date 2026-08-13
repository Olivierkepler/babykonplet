import { notFound } from "next/navigation";
import { prisma } from "../../../../../../lib/prisma";
import AdSlotForm from "../../../../../../components/admin/ad-slot-form";

export default async function EditAdSlotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ad = await prisma.adSlot.findUnique({ where: { id } });

  if (!ad) {
    notFound();
  }

  return (
    <AdSlotForm
      adId={ad.id}
      initial={{
        imageUrl: ad.imageUrl,
        href: ad.href,
        alt: ad.alt,
        label: ad.label ?? "",
        isActive: ad.isActive,
      }}
    />
  );
}