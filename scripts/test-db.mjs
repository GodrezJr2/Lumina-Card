import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  const count = await p.user.count();
  console.log("✅ TiDB Cloud connected! Users in DB:", count);
} catch (e) {
  console.error("❌ Error:", e.message);
} finally {
  await p.$disconnect();
}
