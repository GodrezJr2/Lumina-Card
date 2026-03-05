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
  params: { token: string };
}

export default async function InvitationPage({ params }: Props) {
  const { token } = params;

  const guest = await prisma.guest.findUnique({
    where: { token },
    include: { event: true },
  });

  if (!guest) notFound();

  // Mark as Opened
  if (guest.status === "Draft" || guest.status === "Sent") {
    await prisma.guest.update({ where: { token }, data: { status: "Opened" } });
  }

  const { props, tmpl } = buildTemplateData(guest.event, guest.name, token);

  // Tambahkan musicUrl
  const propsWithMusic = {
    ...props,
    musicUrl: (guest.event as Record<string, unknown>).musicUrl as string | undefined ?? "",
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