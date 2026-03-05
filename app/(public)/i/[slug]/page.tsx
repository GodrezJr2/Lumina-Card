import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  EtherealGardenTemplate,
  RoyalGoldTemplate,
  ModernCorporateTemplate,
  NeonNexusTemplate,
  SakuraDreamTemplate,
  GoldenHourTemplate,
} from "@/components/InvitationTemplates";
import { buildTemplateData } from "@/lib/template-render";

interface Props {
  params: { slug: string };
}

export default async function PublicInvitationPage({ params }: Props) {
  const { slug } = params;

  // Cari event berdasarkan slugUrl
  const event = await prisma.event.findUnique({
    where: { slugUrl: slug },
  });

  if (!event) notFound();

  // Build props — tanpa token individu (publik / siapa saja bisa buka)
  const { props, tmpl } = buildTemplateData(event, "Tamu Undangan", slug);

  const propsWithMusic = {
    ...props,
    musicUrl: (event as Record<string, unknown>).musicUrl as string | undefined ?? "",
  };

  return (
    <>
      {tmpl === "royal"     && <RoyalGoldTemplate       {...propsWithMusic} />}
      {tmpl === "corporate" && <ModernCorporateTemplate  {...propsWithMusic} />}
      {tmpl === "neon"      && <NeonNexusTemplate        {...propsWithMusic} />}
      {tmpl === "sakura"    && <SakuraDreamTemplate      {...propsWithMusic} />}
      {tmpl === "golden"    && <GoldenHourTemplate       {...propsWithMusic} />}
      {(tmpl === "ethereal" || tmpl === "default") && <EtherealGardenTemplate {...propsWithMusic} />}
    </>
  );
}
