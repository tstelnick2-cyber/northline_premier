import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull().references(() => usersTable.id),
  toUserId: integer("to_user_id").notNull().references(() => usersTable.id),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  fromUser: one(usersTable, {
    fields: [messagesTable.fromUserId],
    references: [usersTable.id],
    relationName: "fromUser",
  }),
  toUser: one(usersTable, {
    fields: [messagesTable.toUserId],
    references: [usersTable.id],
    relationName: "toUser",
  }),
}));

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true, read: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
