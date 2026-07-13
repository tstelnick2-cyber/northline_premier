import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { filesTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateFileBody } from "@workspace/api-zod";

const router = Router();

async function requireUser(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  return user ?? null;
}

function formatUser(u: typeof usersTable.$inferSelect | undefined) {
  if (!u) return undefined;
  return { id: u.id, clerkId: u.clerkId, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt.toISOString() };
}

function formatFile(f: typeof filesTable.$inferSelect, uploadedBy?: typeof usersTable.$inferSelect, assignedTo?: typeof usersTable.$inferSelect) {
  return {
    id: f.id,
    uploadedById: f.uploadedById,
    assignedToId: f.assignedToId,
    fileType: f.fileType,
    objectPath: f.objectPath,
    filename: f.filename,
    createdAt: f.createdAt.toISOString(),
    uploadedBy: formatUser(uploadedBy),
    assignedTo: formatUser(assignedTo),
  };
}

router.get("/files", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }

    let files: (typeof filesTable.$inferSelect)[];

    if (currentUser.role === "admin") {
      const userIdParam = req.query.userId ? parseInt(req.query.userId as string, 10) : undefined;
      if (userIdParam) {
        files = await db.select().from(filesTable).where(eq(filesTable.assignedToId, userIdParam));
      } else {
        files = await db.select().from(filesTable);
      }
    } else {
      files = await db.select().from(filesTable).where(eq(filesTable.assignedToId, currentUser.id));
    }

    const userIds = [...new Set([...files.map(f => f.uploadedById), ...files.map(f => f.assignedToId)])];
    const users = userIds.length > 0
      ? await db.select().from(usersTable).where(eq(usersTable.id, userIds[0])) // simplified
      : [];
    const allUsers = await db.select().from(usersTable);
    const userMap = new Map(allUsers.map(u => [u.id, u]));

    res.json(files.map(f => formatFile(f, userMap.get(f.uploadedById), userMap.get(f.assignedToId))));
  } catch (err) {
    req.log.error({ err }, "Failed to list files");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/files", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    if (currentUser.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }

    const parsed = CreateFileBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

    const [file] = await db.insert(filesTable).values({
      uploadedById: currentUser.id,
      assignedToId: parsed.data.assignedToId,
      fileType: parsed.data.fileType as "paystub" | "verification" | "document",
      objectPath: parsed.data.objectPath,
      filename: parsed.data.filename,
    }).returning();

    const allUsers = await db.select().from(usersTable);
    const userMap = new Map(allUsers.map(u => [u.id, u]));
    res.status(201).json(formatFile(file, userMap.get(file.uploadedById), userMap.get(file.assignedToId)));
  } catch (err) {
    req.log.error({ err }, "Failed to create file");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/files/:fileId", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser || currentUser.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
    const fileId = parseInt(req.params.fileId, 10);
    await db.delete(filesTable).where(eq(filesTable.id, fileId));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete file");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
