/**
 * ChangeLog helper — catat setiap perubahan penting di sistem.
 * Dipanggil dari API routes manapun yang melakukan perubahan data.
 */

import prisma from "@/lib/prisma";

export type ChangeCategory =
  | "user_create"
  | "user_role_change"
  | "user_delete"
  | "user_restore"
  | "system";

interface LogChangeOptions {
  /** userId yang melakukan aksi (superAdmin) */
  actorId?: number;
  /** Kategori perubahan */
  category: ChangeCategory;
  /** Deskripsi human-readable */
  description: string;
  /** userId yang terdampak */
  targetId?: number;
  /** State sebelum perubahan (object/string) */
  before?: unknown;
  /** State sesudah perubahan (object/string) */
  after?: unknown;
}

export async function logChange(opts: LogChangeOptions) {
  try {
    await prisma.changeLog.create({
      data: {
        actorId:     opts.actorId ?? null,
        category:    opts.category,
        description: opts.description,
        targetId:    opts.targetId ?? null,
        before:      opts.before != null ? JSON.stringify(opts.before) : null,
        after:       opts.after  != null ? JSON.stringify(opts.after)  : null,
      },
    });
  } catch (err) {
    // Jangan crash request utama hanya karena log gagal
    console.error("[ChangeLog] Failed to write log:", err);
  }
}
