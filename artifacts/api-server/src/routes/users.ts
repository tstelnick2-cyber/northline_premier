import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateUserRoleBody } from "@workspace/api-zod";

const router = Router();

async function getOrCreateUser(clerkId: string, email: string, name?: string) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (existing.length > 0) {
    if (name && !existing[0].name) {
      await db.update(usersTable).set({ name }).where(eq(usersTable.clerkId, clerkId));
      return { ...existing[0], name };
    }
    return existing[0];
  }
  const [user] = await db.insert(usersTable).values({ clerkId, email, name: name ?? null }).returning();
  return user;
}

router.get("/users/me", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const email = (req as any).auth?.sessionClaims?.email as string ?? "";
    const name = (req as any).auth?.sessionClaims?.name as string | undefined;
    const user = await getOrCreateUser(userId, email, name);
    res.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const currentUser = await db.select().from(usersTable).where(eq(usersTable.clerkId, userId)).limit(1);
    if (currentUser.length === 0 || currentUser[0].role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const users = await db.select().from(usersTable);
    res.json(users.map(u => ({
      id: u.id,
      clerkId: u.clerkId,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:userId/role", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const currentUser = await db.select().from(usersTable).where(eq(usersTable.clerkId, userId)).limit(1);
    if (currentUser.length === 0 || currentUser[0].role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const parsed = UpdateUserRoleBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const targetId = parseInt(req.params.userId, 10);
    const [updated] = await db.update(usersTable).set({ role: parsed.data.role }).where(eq(usersTable.id, targetId)).returning();
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: updated.id,
      clerkId: updated.clerkId,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update role");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
