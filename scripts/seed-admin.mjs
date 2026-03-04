import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const p = new PrismaClient();

// Simple SHA-256 hash — ganti dengan bcrypt jika sudah install
// Kita cek dulu apakah app pakai bcrypt atau custom hash
const password = "Admin@1234"; // Ganti sesuai keinginan
const hashed = createHash("sha256").update(password).digest("hex");

try {
  // Cek apakah app pakai hash seperti apa
  const existing = await p.user.findFirst();
  if (existing) {
    console.log("Password hash format di DB:", existing.password.substring(0, 20) + "...");
  }

  const admin = await p.user.upsert({
    where: { email: "admin@luminacard.app" },
    update: {},
    create: {
      email: "admin@luminacard.app",
      name: "Super Admin",
      password: hashed,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ SuperAdmin created:", admin.email, "| role:", admin.role);
  console.log("   Password (plain):", password);
  console.log("   Password (hash):", hashed.substring(0, 20) + "...");
} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await p.$disconnect();
}
