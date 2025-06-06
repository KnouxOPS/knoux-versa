import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const transformations = pgTable("transformations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  originalImageUrl: text("original_image_url").notNull(),
  transformedImageUrl: text("transformed_image_url").notNull(),
  prompt: text("prompt").notNull(),
  service: text("service").notNull(), // 'magic-morph', 'remove-replace', etc.
  selectionData: text("selection_data"), // JSON string of selection coordinates
  quality: text("quality").notNull().default("standard"), // 'standard', 'high', 'ultra'
  isVIP: boolean("is_vip").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vipSessions = pgTable("vip_sessions", {
  id: serial("id").primaryKey(),
  sessionKey: text("session_key").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTransformationSchema = createInsertSchema(transformations).omit({
  id: true,
  createdAt: true,
});

export const insertVipSessionSchema = createInsertSchema(vipSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransformation = z.infer<typeof insertTransformationSchema>;
export type Transformation = typeof transformations.$inferSelect;
export type InsertVipSession = z.infer<typeof insertVipSessionSchema>;
export type VipSession = typeof vipSessions.$inferSelect;
