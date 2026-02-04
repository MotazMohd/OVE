import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, garages } from "./core";

// Marketing schema tables
// This module contains marketing and campaign management entities

export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  garageId: uuid("garage_id").references(() => garages.id),
  name: text("name").notNull(),
  description: text("description"),
  campaignType: text("campaign_type").notNull(),
  channel: text("channel").notNull(),
  targetAudience: jsonb("target_audience").default({}),
  status: text("status").notNull().default("draft"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaignRecipients = pgTable("campaign_recipients", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").references(() => marketingCampaigns.id).notNull(),
  customerId: uuid("customer_id").references(() => users.id).notNull(),
  status: text("status").default("pending"),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loyaltyPrograms = pgTable("loyalty_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  garageId: uuid("garage_id").references(() => garages.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  pointsPerDollar: decimal("points_per_dollar", { precision: 5, scale: 2 }).default("1"),
  redemptionRate: decimal("redemption_rate", { precision: 5, scale: 2 }).default("0.01"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loyaltyAccounts = pgTable("loyalty_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").references(() => loyaltyPrograms.id).notNull(),
  customerId: uuid("customer_id").references(() => users.id).notNull(),
  currentPoints: integer("current_points").default(0),
  lifetimePoints: integer("lifetime_points").default(0),
  tier: text("tier").default("bronze"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => loyaltyAccounts.id).notNull(),
  transactionType: text("transaction_type").notNull(),
  points: integer("points").notNull(),
  description: text("description"),
  relatedEntityType: text("related_entity_type"),
  relatedEntityId: uuid("related_entity_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = typeof marketingCampaigns.$inferInsert;

export type CampaignRecipient = typeof campaignRecipients.$inferSelect;
export type InsertCampaignRecipient = typeof campaignRecipients.$inferInsert;

export type LoyaltyProgram = typeof loyaltyPrograms.$inferSelect;
export type InsertLoyaltyProgram = typeof loyaltyPrograms.$inferInsert;

export type LoyaltyAccount = typeof loyaltyAccounts.$inferSelect;
export type InsertLoyaltyAccount = typeof loyaltyAccounts.$inferInsert;

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

// Zod schemas
export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns);
export const insertCampaignRecipientSchema = createInsertSchema(campaignRecipients);
export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyPrograms);
export const insertLoyaltyAccountSchema = createInsertSchema(loyaltyAccounts);
export const insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactions);
