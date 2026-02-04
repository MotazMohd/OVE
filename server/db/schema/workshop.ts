import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Workshop schema tables for garage operations
// This module contains workshop-specific entities like job cards, tasks, and service operations

export const jobCards = pgTable("job_cards", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id").notNull(),
    branchId: uuid("branch_id"),
    vehicleId: uuid("vehicle_id").notNull(),
    customerId: uuid("customer_id").notNull(),
    assignedTo: uuid("assigned_to"),
    status: text("status").notNull().default("pending"),
    priority: text("priority").default("normal"),
    description: text("description"),
    estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
    actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
    estimatedCompletionAt: timestamp("estimated_completion_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taskAssignments = pgTable("task_assignments", {
    id: uuid("id").primaryKey().defaultRandom(),
    jobCardId: uuid("job_card_id").notNull(),
    technicianId: uuid("technician_id").notNull(),
    taskName: text("task_name").notNull(),
    description: text("description"),
    status: text("status").notNull().default("pending"),
    estimatedDuration: integer("estimated_duration"),
    actualDuration: integer("actual_duration"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serviceTemplates = pgTable("service_templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id"),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category"),
    estimatedDuration: integer("estimated_duration"),
    estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
    tasks: jsonb("tasks").default([]),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tools = pgTable("tools", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id"),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category"),
    serialNumber: text("serial_number"),
    status: text("status").notNull().default("available"),
    purchaseDate: timestamp("purchase_date"),
    purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const spareParts = pgTable("spare_parts", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id"),
    name: text("name").notNull(),
    partNumber: text("part_number"),
    description: text("description"),
    category: text("category"),
    manufacturer: text("manufacturer"),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
    minStockLevel: integer("min_stock_level").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id").notNull(),
    branchId: uuid("branch_id"),
    customerId: uuid("customer_id").notNull(),
    vehicleId: uuid("vehicle_id"),
    serviceType: text("service_type"),
    scheduledAt: timestamp("scheduled_at").notNull(),
    duration: integer("duration").default(60),
    status: text("status").notNull().default("scheduled"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type JobCard = typeof jobCards.$inferSelect;
export type InsertJobCard = typeof jobCards.$inferInsert;

export type TaskAssignment = typeof taskAssignments.$inferSelect;
export type InsertTaskAssignment = typeof taskAssignments.$inferInsert;

export type ServiceTemplate = typeof serviceTemplates.$inferSelect;
export type InsertServiceTemplate = typeof serviceTemplates.$inferInsert;

export type Tool = typeof tools.$inferSelect;
export type InsertTool = typeof tools.$inferInsert;

export type SparePart = typeof spareParts.$inferSelect;
export type InsertSparePart = typeof spareParts.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// Zod schemas for validation
export const insertJobCardSchema = createInsertSchema(jobCards);
export const selectJobCardSchema = createSelectSchema(jobCards);

export const insertTaskAssignmentSchema = createInsertSchema(taskAssignments);
export const selectTaskAssignmentSchema = createSelectSchema(taskAssignments);

export const insertServiceTemplateSchema = createInsertSchema(serviceTemplates);
export const selectServiceTemplateSchema = createSelectSchema(serviceTemplates);

export const insertToolSchema = createInsertSchema(tools);
export const selectToolSchema = createSelectSchema(tools);

export const insertSparePartSchema = createInsertSchema(spareParts);
export const selectSparePartSchema = createSelectSchema(spareParts);

export const insertAppointmentSchema = createInsertSchema(appointments);
export const selectAppointmentSchema = createSelectSchema(appointments);
