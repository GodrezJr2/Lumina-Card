/**
 * seed-passwords.mjs
 * Reset semua user password jadi "123456" untuk testing.
 * Tambah USHER_STAFF kalau belum ada (untuk test scanner role gate).
 *
 * Run: node scripts/seed-passwords.mjs
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();
const PASSWORD = "123456";

try {
  const hash = await bcrypt.hash(PASSWORD, 10);
  console.log(`\n🔐 Generated bcrypt hash for "${PASSWORD}"\n`);

  // ── Update all existing users ─────────────────────────────────────
  const existing = await p.user.findMany({
    select: { id: true, email: true, role: true },
    orderBy: { id: "asc" },
  });

  console.log(`📊 Resetting ${existing.length} user passwords...\n`);

  for (const u of existing) {
    await p.user.update({
      where: { id: u.id },
      data: { password: hash },
    });
    console.log(`  ✅ ${u.email.padEnd(30)} | ${u.role}`);
  }

  // ── Ensure 1 USHER_STAFF exists ───────────────────────────────────
  const usher = await p.user.findFirst({ where: { role: "USHER_STAFF" } });
  if (!usher) {
    const newUsher = await p.user.create({
      data: {
        email: "usher@luminacard.app",
        password: hash,
        name: "Usher Staff",
        role: "USHER_STAFF",
      },
    });
    console.log(`\n  🆕 Created USHER_STAFF: ${newUsher.email}`);
  } else {
    console.log(`\n  ✅ USHER_STAFF already exists: ${usher.email}`);
  }

  // ── Final summary ────────────────────────────────────────────────
  const all = await p.user.findMany({
    select: { id: true, email: true, name: true, role: true, servicePlan: true, lockedTemplateId: true },
    orderBy: { role: "asc" },
  });

  console.log(`\n\n═══════════════════════════════════════════════════════════`);
  console.log(`   ALL ACCOUNTS — login dengan password: "${PASSWORD}"`);
  console.log(`═══════════════════════════════════════════════════════════\n`);

  for (const u of all) {
    const label = `${u.role.padEnd(20)} → ${u.email}`;
    const extras = [];
    if (u.servicePlan) extras.push(`plan=${u.servicePlan}`);
    if (u.lockedTemplateId) extras.push(`template=${u.lockedTemplateId}`);
    console.log(`  ${label}${extras.length ? `  [${extras.join(", ")}]` : ""}`);
  }

  console.log(`\n✅ Done. Total: ${all.length} accounts.\n`);
} catch (e) {
  console.error("❌ Error:", e.message);
  process.exit(1);
} finally {
  await p.$disconnect();
}
