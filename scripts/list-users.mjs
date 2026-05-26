import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

try {
  const users = await p.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      servicePlan: true,
      lockedTemplateId: true,
      deletedAt: true,
    },
    orderBy: { id: "asc" },
  });

  console.log(`\n📊 Total users: ${users.length}\n`);
  console.table(users);
} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await p.$disconnect();
}
