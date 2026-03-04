/**
 * Halaman undangan publik — diakses tamu via link /i/[slug]
 * Contoh: /inv/budi-siti-2026?token=abc123
 *
 * - Tidak perlu login
 * - Render template sesuai pilihan pemilik event
 * - themeConfig override diterapkan via CSS variables
 */

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
  params:      { slug: string };
  searchParams: { token?: string };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const { slug }  = params;
  const token     = searchParams.token ?? "";

  // Cari event by slugUrl
  const event = await prisma.event.findUnique({
    where: { slugUrl: slug },
  });
  if (!event) notFound();

  // Resolve nama tamu dari token (jika ada)
  let guestName = "Tamu Undangan";
  if (token && token !== "preview") {
    const guest = await prisma.guest.findUnique({
      where:  { token },
      select: { name: true, eventId: true },
    });
    // Token harus milik event ini
    if (!guest || guest.eventId !== event.id) notFound();
    guestName = guest.name;
  }

  const { props, tmpl } = buildTemplateData(event, guestName, token || "preview");

  // Tambahkan musicUrl dari event ke props
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

// Generate metadata dinamis untuk SEO / WhatsApp preview
export async function generateMetadata({ params }: Props) {
  const event = await prisma.event.findUnique({
    where:  { slugUrl: params.slug },
    select: { name: true, coupleNames: true, brideName: true, groomName: true, date: true },
  });
  if (!event) return {};

  const couple =
    event.coupleNames ??
    (event.groomName && event.brideName
      ? `${event.groomName} & ${event.brideName}`
      : null) ??
    event.name;

  return {
    title:       `Undangan ${couple}`,
    description: `Anda diundang ke ${event.name}`,
    openGraph: {
      title:       `Undangan ${couple}`,
      description: `Anda diundang ke ${event.name}`,
    },
  };
}
