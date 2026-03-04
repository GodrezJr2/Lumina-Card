import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import {
  EtherealGardenTemplate,
  RoyalGoldTemplate,
  ModernCorporateTemplate,
  NeonNexusTemplate,
} from "@/components/InvitationTemplates";
import { buildTemplateData } from "@/lib/template-render";

interface Props {
  params: { id: string };
}

export default async function TemplatePreviewPage({ params }: Props) {
  // Ownership check — hanya pemilik event atau superAdmin yang bisa preview
  const cookieStore = cookies();
  const rawUserId   = cookieStore.get("user_id")?.value;
  if (!rawUserId) notFound();

  const userId = Number(rawUserId);
  const user   = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user) notFound();

  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
  });
  if (!event) notFound();

  // Cegah user lain akses event yang bukan miliknya
  if (user.role !== "SUPER_ADMIN" && event.userId !== userId) notFound();

  const { props, tmpl } = buildTemplateData(event, "Nama Tamu (Preview)", "preview");

  return (
    <div className="relative">
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-[999] bg-amber-400 text-amber-900 text-xs font-bold text-center py-2 flex items-center justify-center gap-3">
        <span className="material-symbols-outlined text-base leading-none">visibility</span>
        MODE PREVIEW — Ini tampilan yang akan dilihat tamu
        <a href={`/admin/events/${params.id}/template`} className="underline hover:no-underline ml-2">
          Kembali Edit
        </a>
      </div>
      <div className="pt-8">
        {tmpl === "royal"     && <RoyalGoldTemplate       {...props} />}
        {tmpl === "corporate" && <ModernCorporateTemplate  {...props} />}
        {tmpl === "neon"      && <NeonNexusTemplate        {...props} />}
        {(tmpl === "ethereal" || tmpl === "default") && <EtherealGardenTemplate {...props} />}
      </div>
    </div>
  );
}
