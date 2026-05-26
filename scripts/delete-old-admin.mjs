import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

try {
  console.log("🗑️  Deleting old super admin (id=1)...\n");

  const deleted = await p.user.delete({
    where: { id: 1 },
  });

  console.log("✅ Deleted:", deleted.email, "| role:", deleted.role);
} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await p.$disconnect();
}
