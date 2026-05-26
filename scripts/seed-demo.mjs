/**
 * seed-demo.mjs
 * Reset semua data demo + insert dataset realistis untuk presentasi UAS.
 *
 * Run: node scripts/seed-demo.mjs
 *
 * Output:
 *  - 5 user akun siap login (password semua: 123456)
 *  - 2 event lengkap (DIY wedding + Full-service wedding)
 *  - Tamu mix status (Draft/Sent/Opened/Checked_In + Souvenir)
 *  - 1 ChangeLog entry biar audit trail kelihatan
 *
 * SAFE: hanya hapus row yang dibuat seed (filter by email/event name).
 *       User & event lain tidak tersentuh.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const p = new PrismaClient();
const PASSWORD = "123456";

// ── Fixed data biar demo selalu reproducible ───────────────────────────────
const ACCOUNTS = [
  {
    email: "admin@luminacard.app",
    name: "Super Admin",
    role: "SUPER_ADMIN",
    servicePlan: null,
    lockedTemplateId: null,
    purchasedTemplates: null,
  },
  {
    email: "usher@luminacard.app",
    name: "Usher Staff",
    role: "USHER_STAFF",
    servicePlan: null,
    lockedTemplateId: null,
    purchasedTemplates: null,
  },
  {
    email: "basic@luminacard.app",
    name: "Calon Pembeli",
    role: "BASIC_USER",
    servicePlan: null,
    lockedTemplateId: null,
    purchasedTemplates: null,
  },
  {
    email: "diy@luminacard.app",
    name: "Andi Pratama",
    role: "DIY_CLIENT",
    servicePlan: null,
    lockedTemplateId: "ethereal-garden",
    purchasedTemplates: JSON.stringify(["ethereal-garden"]),
  },
  {
    email: "fullservice@luminacard.app",
    name: "Bayu Wicaksono",
    role: "FULL_SERVICE_CLIENT",
    servicePlan: "professional",
    lockedTemplateId: "midnight-glam",
    purchasedTemplates: JSON.stringify(["midnight-glam"]),
  },
];

// Event 1: DIY wedding (template ethereal-garden) - milik diy@
const EVENT_DIY = {
  ownerEmail: "diy@luminacard.app",
  name: "Pernikahan Andi & Maya",
  date: new Date("2026-06-14T18:00:00+07:00"),
  location: "Plaza Senayan, Jakarta",
  template: "ethereal",
  templateId: "ethereal-garden",
  slugUrl: "andi-maya-2026",
  brideName: "Maya Larasati",
  groomName: "Andi Pratama",
  coupleNames: "Andi & Maya",
  story: "Bertemu di kampus UMN tahun 2019, jatuh cinta lewat tugas kelompok yang berakhir manis. Lima tahun kemudian, kami siap menyatukan mimpi.",
  venueAddress: "Plaza Senayan, Lantai 5, Jl. Asia Afrika No.8, Jakarta",
  gallery: JSON.stringify([
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200",
  ]),
  musicUrl: "https://youtu.be/RZvs6RYakNs",
  guests: [
    { name: "Budi Hartono",    whatsapp: "081234567001", status: "Draft" },
    { name: "Citra Lestari",   whatsapp: "081234567002", status: "Sent" },
    { name: "Dewi Anggraini",  whatsapp: "081234567003", status: "Opened" },
    { name: "Eko Saputra",     whatsapp: "081234567004", status: "Checked_In", attendance: { pickedUpSouvenir: false } },
    { name: "Farhan Maulana",  whatsapp: "081234567005", status: "Checked_In", attendance: { pickedUpSouvenir: true } },
  ],
};

// Event 2: Full-service (template midnight-glam) - milik fullservice@
const EVENT_FULL = {
  ownerEmail: "fullservice@luminacard.app",
  name: "Pernikahan Bayu & Nadira",
  date: new Date("2026-07-25T19:00:00+07:00"),
  location: "Hotel Mulia Senayan, Jakarta",
  template: "midnight",
  templateId: "midnight-glam",
  slugUrl: "bayu-nadira-2026",
  brideName: "Nadira Salsabila",
  groomName: "Bayu Wicaksono",
  coupleNames: "Bayu & Nadira",
  story: "Sebuah cerita yang dimulai dari pertemuan tak terduga di Kyoto, dan kini melangkah menuju babak terindah hidup kami berdua.",
  venueAddress: "Hotel Mulia Senayan, Grand Ballroom, Jl. Asia Afrika, Jakarta",
  gallery: JSON.stringify([
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1400",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400",
    "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1400",
  ]),
  musicUrl: "https://youtu.be/RZvs6RYakNs",
  guests: [
    { name: "Gilang Ramadhan",   whatsapp: "081234567010", status: "Draft" },
    { name: "Hanifah Putri",     whatsapp: "081234567011", status: "Sent" },
    { name: "Indra Kurniawan",   whatsapp: "081234567012", status: "Opened" },
    { name: "Joko Susilo",       whatsapp: "081234567013", status: "Opened" },
    { name: "Kartika Widyasari", whatsapp: "081234567014", status: "Checked_In", attendance: { pickedUpSouvenir: true } },
    { name: "Laksono Adi",       whatsapp: "081234567015", status: "Checked_In", attendance: { pickedUpSouvenir: true } },
    { name: "Maharani Dewi",     whatsapp: "081234567016", status: "Checked_In", attendance: { pickedUpSouvenir: false } },
    { name: "Nugraha Satria",    whatsapp: "081234567017", status: "Sent" },
  ],
};

const ALL_EVENTS = [EVENT_DIY, EVENT_FULL];
const SEED_EMAILS = ACCOUNTS.map((a) => a.email);
const SEED_SLUGS  = ALL_EVENTS.map((e) => e.slugUrl);

// ── Main ───────────────────────────────────────────────────────────────────
try {
  console.log("\n🌱 SEEDING DEMO DATA — Lumina Card UAS\n");
  console.log("──────────────────────────────────────────");

  const hash = await bcrypt.hash(PASSWORD, 10);

  // 1) Hapus event seed lama (cascade ke guests + attendance)
  const deletedEvents = await p.event.deleteMany({
    where: { slugUrl: { in: SEED_SLUGS } },
  });
  if (deletedEvents.count > 0) {
    console.log(`🗑️  Hapus ${deletedEvents.count} event lama (cascade)`);
  }

  // 2) Upsert akun
  console.log("\n👤 Seed akun:");
  const userMap = new Map();
  for (const acc of ACCOUNTS) {
    const u = await p.user.upsert({
      where: { email: acc.email },
      create: {
        email:              acc.email,
        password:           hash,
        name:               acc.name,
        role:               acc.role,
        servicePlan:        acc.servicePlan,
        lockedTemplateId:   acc.lockedTemplateId,
        purchasedTemplates: acc.purchasedTemplates,
      },
      update: {
        password:           hash,
        name:               acc.name,
        role:               acc.role,
        servicePlan:        acc.servicePlan,
        lockedTemplateId:   acc.lockedTemplateId,
        purchasedTemplates: acc.purchasedTemplates,
        deletedAt:          null,
        deletedBy:          null,
      },
    });
    userMap.set(acc.email, u);
    const planLabel = acc.servicePlan ? ` plan=${acc.servicePlan}` : "";
    const tplLabel  = acc.lockedTemplateId ? ` template=${acc.lockedTemplateId}` : "";
    console.log(`   ✅ ${acc.role.padEnd(20)} ${acc.email}${planLabel}${tplLabel}`);
  }

  // 3) Buat event + tamu + attendance
  console.log("\n📅 Seed event + tamu:");
  for (const ev of ALL_EVENTS) {
    const owner = userMap.get(ev.ownerEmail);
    if (!owner) throw new Error(`Owner ${ev.ownerEmail} tidak ditemukan`);

    const created = await p.event.create({
      data: {
        userId:       owner.id,
        name:         ev.name,
        date:         ev.date,
        location:     ev.location,
        template:     ev.template,
        templateId:   ev.templateId,
        slugUrl:      ev.slugUrl,
        brideName:    ev.brideName,
        groomName:    ev.groomName,
        coupleNames:  ev.coupleNames,
        story:        ev.story,
        venueAddress: ev.venueAddress,
        gallery:      ev.gallery,
        musicUrl:     ev.musicUrl,
      },
    });

    console.log(`   ✅ Event #${created.id}: ${ev.name}`);
    console.log(`      └─ /i/${ev.slugUrl}  template=${ev.templateId}`);

    for (const g of ev.guests) {
      const guest = await p.guest.create({
        data: {
          eventId:  created.id,
          name:     g.name,
          whatsapp: g.whatsapp,
          token:    uuidv4(),
          status:   g.status,
        },
      });

      if (g.attendance) {
        await p.attendance.create({
          data: {
            guestId:          guest.id,
            checkInTime:      new Date(),
            pickedUpSouvenir: g.attendance.pickedUpSouvenir,
            souvenirTime:     g.attendance.pickedUpSouvenir ? new Date() : null,
          },
        });
      }
    }
    console.log(`      └─ ${ev.guests.length} tamu (${ev.guests.filter(g => g.attendance).length} sudah check-in)`);
  }

  // 4) Insert sample audit log
  const adminUser = userMap.get("admin@luminacard.app");
  await p.changeLog.create({
    data: {
      actorId:     adminUser.id,
      category:    "system",
      description: "Demo seed run — semua data UAS direset.",
      after:       JSON.stringify({ accounts: ACCOUNTS.length, events: ALL_EVENTS.length }),
    },
  });

  // 5) Final summary
  console.log("\n──────────────────────────────────────────");
  console.log("✨ Seed selesai. Akun siap login (password: 123456)\n");

  const tableData = ACCOUNTS.map((a) => ({
    Role:         a.role,
    Email:        a.email,
    Plan:         a.servicePlan ?? "-",
    Template:     a.lockedTemplateId ?? "-",
  }));
  console.table(tableData);

  console.log("\n📌 Quick test URLs:");
  console.log(`   • Public DIY      : http://localhost:3001/i/${EVENT_DIY.slugUrl}`);
  console.log(`   • Public Full     : http://localhost:3001/i/${EVENT_FULL.slugUrl}`);
  console.log(`   • Admin login     : http://localhost:3001/admin/login`);
  console.log(`   • Catalog         : http://localhost:3001/catalog`);
  console.log(`   • Pricing         : http://localhost:3001/pricing`);
  console.log("\n🎬 Lihat DEMO_FLOW.md untuk skenario presentasi.\n");

} catch (e) {
  console.error("❌ Error:", e.message);
  console.error(e);
  process.exit(1);
} finally {
  await p.$disconnect();
}
