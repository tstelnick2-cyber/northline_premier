import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const fileTypeEnum = pgEnum("file_type", ["paystub", "verification", "document"]);

export const filesTable = pgTable("files", {
  id: serial("id").primaryKey(),
  uploadedById: integer("uploaded_by_id").notNull().references(() => usersTable.id),
  assignedToId: integer("assigned_to_id").notNull().references(() => usersTable.id),
  fileType: fileTypeEnum("file_type").notNull(),
  objectPath: text("object_path").notNull(),
  filename: text("filename").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const filesRelations = relations(filesTable, ({ one }) => ({
  uploadedBy: one(usersTable, {
    fields: [filesTable.uploadedById],
    references: [usersTable.id],
    relationName: "uploadedBy",
  }),
  assignedTo: one(usersTable, {
    fields: [filesTable.assignedToId],
    references: [usersTable.id],
    relationName: "assignedTo",
  }),
}));

export const insertFileSchema = createInsertSchema(filesTable).omit({ id: true, createdAt: true });
export type InsertFile = z.infer<typeof insertFileSchema>;
export type PortalFile = typeof filesTable.$inferSelect;
