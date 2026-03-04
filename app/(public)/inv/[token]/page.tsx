import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { EtherealGardenTemplate, RoyalGoldTemplate, ModernCorporateTemplate } from "@/components/InvitationTemplates";

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

  const eventDate = new Date(guest.event.date);
  const dateStr = eventDate.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  // Parse gallery
  let gallery: string[] = [];
  if (guest.event.gallery) {
    try { gallery = JSON.parse(guest.event.gallery); } catch { gallery = []; }
  }

  const templateProps = {
    guestName: guest.name,
    token,
    eventName: guest.event.name,
    dateStr,
    timeStr,
    location: guest.event.location,
    coupleNames: guest.event.coupleNames ?? "",
    story: guest.event.story ?? "",
    venueAddress: guest.event.venueAddress ?? "",
    gallery,
  };

  const tmpl = guest.event.template ?? "default";

  if (tmpl === "royal") {
    return <RoyalGoldTemplate {...templateProps} />;
  }
  if (tmpl === "corporate") {
    return <ModernCorporateTemplate {...templateProps} />;
  }
  if (tmpl === "ethereal") {
    return <EtherealGardenTemplate {...templateProps} />;
  }

  // Default fallback (original simple card)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-white to-[#e8f9fd] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#13c8ec] mb-2">Undangan Pernikahan</p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#13c8ec]/30" />
            <div className="size-3 rotate-45 bg-[#13c8ec]/40 rounded-sm" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#13c8ec]/30" />
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-[#13c8ec] via-[#7dd3fc] to-[#13c8ec]" />
          <div className="p-8 text-center space-y-6">
            <div>
              <p className="text-sm text-slate-500">Kepada Yth.</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">{guest.name}</h1>
            </div>
            <div className="text-slate-400 text-lg">✦</div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{guest.event.coupleNames || guest.event.name}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8fbfc] rounded-2xl p-4">
                <span className="material-symbols-outlined text-[#13c8ec] text-2xl">calendar_month</span>
                <p className="text-xs font-semibold text-slate-500 mt-2">Tanggal</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{dateStr}</p>
              </div>
              <div className="bg-[#f8fbfc] rounded-2xl p-4">
                <span className="material-symbols-outlined text-[#13c8ec] text-2xl">schedule</span>
                <p className="text-xs font-semibold text-slate-500 mt-2">Waktu</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{timeStr} WIB</p>
              </div>
            </div>
            <div className="bg-[#f8fbfc] rounded-2xl p-4">
              <span className="material-symbols-outlined text-[#13c8ec] text-2xl">location_on</span>
              <p className="text-xs font-semibold text-slate-500 mt-2">Lokasi</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{guest.event.location}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href={`/inv/${token}/rsvp`}
                className="flex-1 bg-[#13c8ec] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#0fb3d4] transition text-center"
              >
                RSVP Sekarang
              </a>
              <a
                href={`/inv/${token}/qr`}
                className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl text-sm hover:bg-slate-200 transition text-center flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
                QR Tiket
              </a>
            </div>
          </div>
          <div className="h-3 bg-gradient-to-r from-[#13c8ec] via-[#7dd3fc] to-[#13c8ec]" />
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Dibuat dengan ❤️ menggunakan{" "}
          <a href="/" className="text-[#13c8ec] font-semibold hover:underline">ElegantInvites</a>
        </p>
      </div>
    </div>
  );
}