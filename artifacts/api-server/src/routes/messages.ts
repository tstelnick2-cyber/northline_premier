import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db";
import { eq, or, and, count } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";

const router = Router();

async function requireUser(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  return user ?? null;
}

function formatUser(u: typeof usersTable.$inferSelect | undefined) {
  if (!u) return undefined;
  return { id: u.id, clerkId: u.clerkId, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt.toISOString() };
}

function formatMessage(m: typeof messagesTable.$inferSelect, fromUser?: typeof usersTable.$inferSelect, toUser?: typeof usersTable.$inferSelect) {
  return {
    id: m.id,
    fromUserId: m.fromUserId,
    toUserId: m.toUserId,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
    read: m.read,
    fromUser: formatUser(fromUser),
    toUser: formatUser(toUser),
  };
}

router.get("/messages/unread-count", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [result] = await db.select({ count: count() }).from(messagesTable)
      .where(and(eq(messagesTable.toUserId, currentUser.id), eq(messagesTable.read, false)));
    res.json({ count: result?.count ?? 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to get unread count");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }

    const withUserId = req.query.withUserId ? parseInt(req.query.withUserId as string, 10) : undefined;

    let messages: (typeof messagesTable.$inferSelect)[];

    if (withUserId) {
      messages = await db.select().from(messagesTable).where(
        or(
          and(eq(messagesTable.fromUserId, currentUser.id), eq(messagesTable.toUserId, withUserId)),
          and(eq(messagesTable.fromUserId, withUserId), eq(messagesTable.toUserId, currentUser.id)),
        )
      );
    } else {
      messages = await db.select().from(messagesTable).where(
        or(eq(messagesTable.fromUserId, currentUser.id), eq(messagesTable.toUserId, currentUser.id))
      );
    }

    const allUsers = await db.select().from(usersTable);
    const userMap = new Map(allUsers.map(u => [u.id, u]));

    res.json(messages.map(m => formatMessage(m, userMap.get(m.fromUserId), userMap.get(m.toUserId))));
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const parsed = SendMessageBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
    const [message] = await db.insert(messagesTable).values({
      fromUserId: currentUser.id,
      toUserId: parsed.data.toUserId,
      body: parsed.data.body,
    }).returning();
    const allUsers = await db.select().from(usersTable);
    const userMap = new Map(allUsers.map(u => [u.id, u]));
    res.status(201).json(formatMessage(message, userMap.get(message.fromUserId), userMap.get(message.toUserId)));
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/messages/:messageId/read", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const currentUser = await requireUser(userId);
    if (!currentUser) { res.status(401).json({ error: "Unauthorized" }); return; }
    const msgId = parseInt(req.params.messageId, 10);
    const [updated] = await db.update(messagesTable).set({ read: true })
      .where(and(eq(messagesTable.id, msgId), eq(messagesTable.toUserId, currentUser.id)))
      .returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    const allUsers = await db.select().from(usersTable);
    const userMap = new Map(allUsers.map(u => [u.id, u]));
    res.json(formatMessage(updated, userMap.get(updated.fromUserId), userMap.get(updated.toUserId)));
  } catch (err) {
    req.log.error({ err }, "Failed to mark message read");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
