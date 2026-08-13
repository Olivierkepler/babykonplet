import { redirect } from "next/navigation";

import { auth } from "../../auth";
import AccountSidebar from "../../components/account/account-sidebar";
import { prisma } from "../../lib/prisma";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <div className="mx-auto grid w-full max-w-full items-start gap-5 px-4 py-5  lg:grid-cols-[270px_minmax(0,1fr)] ">
        <AccountSidebar
          user={{
            name: user.name || "Customer",
            email: user.email,
            image: user.image,
            memberSince,
          }}
        />

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}