import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface Props {
  params: { token: string };
}

// Server Component — runs on server, safe untuk DB query
export default async function InvitationPage({ params }: Props) {
  const { token } = params;

  const guest = await prisma.guest.findUnique({
    where: { token },
    include: { event: true },
  });

  // Token tidak ditemukan → 404
  if (!guest) notFound();

  // Update status ke Opened jika belum Checked_In
  if (guest.status === "Draft" || guest.status === "Sent") {
    await prisma.guest.update({
      where: { token },
      data: { status: "Opened" },
    });
  }

  const { name, event } = guest;
  const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Ornament top */}
        <div className="text-primary text-5xl select-none">♡</div>

        {/* Event name */}
        <h1 className="text-3xl font-extrabold text-navy-900 dark:text-white leading-tight">
          {event.name}
        </h1>

        {/* Personal greeting */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-3 border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            Kepada Yth.
          </p>
          <p className="text-2xl font-bold text-navy-900 dark:text-white">{name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kami mengundang Anda untuk hadir di acara kami
          </p>
        </div>

        {/* Event details */}
        <div className="space-y-2 text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary">📅</span>
            <span className="font-medium">{eventDate}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary">📍</span>
            <span className="font-medium">{event.location}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Undangan Dibuka
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Undangan ini bersifat personal. Mohon tidak dibagikan.
        </p>
      </div>
    </main>
  );
}
