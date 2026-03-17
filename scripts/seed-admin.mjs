import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const p = new PrismaClient();

const users = [
  {
    email: "admin@luminacard.app",
    name: "Super Admin",
    password: "superadmin123",
    role: "SUPER_ADMIN",
  },
  {
    email: "dummy1@luminacard.app",
    name: "Dummy User 1",
    password: "dummy",
    role: "DIY_CLIENT",
  },
  {
    email: "dummy2@luminacard.app",
    name: "Dummy User 2",
    password: "dummy",
    role: "FULL_SERVICE_CLIENT",
  },
];

try {
  console.log("🌱 Seeding users...\n");

  for (const user of users) {
    // Hash password dengan bcryptjs
    const hashedPassword = await bcryptjs.hash(user.password, 10);

    const createdUser = await p.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
    });

    console.log(`✅ User created:`, createdUser.email);
    console.log(`   Name: ${createdUser.name}`);
    console.log(`   Role: ${createdUser.role}`);
    console.log(`   Password (plain): ${user.password}`);
    console.log(`   Password (hash): ${hashedPassword.substring(0, 40)}...\n`);
  }

  console.log("✨ All users seeded successfully!");
} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await p.$disconnect();
}
