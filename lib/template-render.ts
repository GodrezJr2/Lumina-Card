/**
 * Helper: bangun templateProps dari data Event DB
 * Dipakai di /inv/preview/[id] dan /inv/[slug]
 */

import type { InvitationProps } from "@/components/InvitationTemplates";
import { normalizeGallery } from "@/lib/image-utils";

interface EventData {
  name:         string;
  date:         Date;
  location:     string;
  template:     string;
  brideName?:   string | null;
  groomName?:   string | null;
  coupleNames?: string | null;
  story?:       string | null;
  venueAddress?: string | null;
  gallery?:     string | null;
  themeConfig?: string | null;
}

export interface TemplateRenderData {
  props:   InvitationProps;
  tmpl:    string;
  theme:   Record<string, string>;
}

export function buildTemplateData(
  event: EventData,
  guestName = "Nama Tamu",
  token     = "preview"
): TemplateRenderData {
  const eventDate = new Date(event.date);
  const dateStr   = eventDate.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  });

  let gallery: string[] = [];
  if (event.gallery) {
    try { gallery = normalizeGallery(JSON.parse(event.gallery)); } catch { gallery = []; }
  }

  // Nama pasangan: brideName & groomName lebih spesifik dari coupleNames lama
  const coupleNames =
    event.coupleNames ??
    (event.groomName && event.brideName
      ? `${event.groomName} & ${event.brideName}`
      : event.groomName ?? event.brideName ?? "");

  // Parse themeConfig (override warna/font dari editor)
  let theme: Record<string, string> = {};
  if (event.themeConfig) {
    try { theme = JSON.parse(event.themeConfig); } catch { theme = {}; }
  }

  const props: InvitationProps = {
    guestName,
    token,
    eventName:   event.name,
    dateStr,
    timeStr,
    location:    event.location,
    coupleNames,
    story:       event.story       ?? "",
    venueAddress: event.venueAddress ?? "",
    gallery,
  };

  return { props, tmpl: event.template ?? "default", theme };
}
