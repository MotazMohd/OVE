import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./core";

// Call Center schema tables
// This module contains call center and customer support entities

export const callQueues = pgTable("call_queues", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    maxWaitTime: integer("max_wait_time").default(300),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const callSessions = pgTable("call_sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    queueId: uuid("queue_id").references(() => callQueues.id),
    customerId: uuid("customer_id").references(() => users.id),
    agentId: uuid("agent_id").references(() => users.id),
    phoneNumber: text("phone_number"),
    status: text("status").notNull().default("queued"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    duration: integer("duration"),
    waitTime: integer("wait_time"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const callNotes = pgTable("call_notes", {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id").references(() => callSessions.id).notNull(),
    agentId: uuid("agent_id").references(() => users.id).notNull(),
    note: text("note").notNull(),
    category: text("category"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportTickets = pgTable("support_tickets", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => users.id).notNull(),
    assignedTo: uuid("assigned_to").references(() => users.id),
    subject: text("subject").notNull(),
    description: text("description"),
    priority: text("priority").default("normal"),
    status: text("status").notNull().default("open"),
    category: text("category"),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type CallQueue = typeof callQueues.$inferSelect;
export type InsertCallQueue = typeof callQueues.$inferInsert;

export type CallSession = typeof callSessions.$inferSelect;
export type InsertCallSession = typeof callSessions.$inferInsert;

export type CallNote = typeof callNotes.$inferSelect;
export type InsertCallNote = typeof callNotes.$inferInsert;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// Zod schemas
export const insertCallQueueSchema = createInsertSchema(callQueues);
export const insertCallSessionSchema = createInsertSchema(callSessions);
export const insertCallNoteSchema = createInsertSchema(callNotes);
export const insertSupportTicketSchema = createInsertSchema(supportTickets);
