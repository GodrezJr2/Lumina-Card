import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const p = new PrismaClient();

const password = "Admin@1234"; // Ganti sesuai keinginan

try {
  // Hash password dengan bcryptjs
  const hashedPassword = await bcryptjs.hash(password, 10);

  const admin = await p.user.upsert({
    where: { email: "admin@luminacard.app" },
    update: {},
    create: {
      email: "admin@luminacard.app",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ SuperAdmin created:", admin.email, "| role:", admin.role);
  console.log("   Password (plain):", password);
  console.log("   Password (hash bcrypt):", hashedPassword.substring(0, 40) + "...");
} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await p.$disconnect();
}
