import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, vehicles } from "./core";

// Tires schema tables
// This module contains tire management and services entities

export const tireInventory = pgTable("tire_inventory", {
    id: uuid("id").primaryKey().defaultRandom(),
    brand: text("brand").notNull(),
    model: text("model").notNull(),
    size: text("size").notNull(),
    speedRating: text("speed_rating"),
    loadIndex: text("load_index"),
    season: text("season").default("all-season"),
    quantity: integer("quantity").default(0),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    supplier: text("supplier"),
    location: text("location"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tireServices = pgTable("tire_services", {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
    customerId: uuid("customer_id").references(() => users.id).notNull(),
    serviceType: text("service_type").notNull(),
    frontLeftTireId: uuid("front_left_tire_id").references(() => tireInventory.id),
    frontRightTireId: uuid("front_right_tire_id").references(() => tireInventory.id),
    rearLeftTireId: uuid("rear_left_tire_id").references(() => tireInventory.id),
    rearRightTireId: uuid("rear_right_tire_id").references(() => tireInventory.id),
    spareTireId: uuid("spare_tire_id").references(() => tireInventory.id),
    totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
    notes: text("notes"),
    performedBy: uuid("performed_by").references(() => users.id),
    performedAt: timestamp("performed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tireInspections = pgTable("tire_inspections", {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
    inspectorId: uuid("inspector_id").references(() => users.id),
    frontLeftDepth: decimal("front_left_depth", { precision: 4, scale: 2 }),
    frontRightDepth: decimal("front_right_depth", { precision: 4, scale: 2 }),
    rearLeftDepth: decimal("rear_left_depth", { precision: 4, scale: 2 }),
    rearRightDepth: decimal("rear_right_depth", { precision: 4, scale: 2 }),
    frontLeftPressure: decimal("front_left_pressure", { precision: 4, scale: 1 }),
    frontRightPressure: decimal("front_right_pressure", { precision: 4, scale: 1 }),
    rearLeftPressure: decimal("rear_left_pressure", { precision: 4, scale: 1 }),
    rearRightPressure: decimal("rear_right_pressure", { precision: 4, scale: 1 }),
    recommendations: text("recommendations"),
    inspectedAt: timestamp("inspected_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tireRotationHistory = pgTable("tire_rotation_history", {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
    rotationPattern: text("rotation_pattern").notNull(),
    mileage: integer("mileage"),
    notes: text("notes"),
    performedBy: uuid("performed_by").references(() => users.id),
    performedAt: timestamp("performed_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tireWarranties = pgTable("tire_warranties", {
    id: uuid("id").primaryKey().defaultRandom(),
    tireServiceId: uuid("tire_service_id").references(() => tireServices.id).notNull(),
    warrantyType: text("warranty_type").notNull(),
    coverageMiles: integer("coverage_miles"),
    coverageMonths: integer("coverage_months"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    status: text("status").notNull().default("active"),
    terms: text("terms"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type TireInventory = typeof tireInventory.$inferSelect;
export type InsertTireInventory = typeof tireInventory.$inferInsert;

export type TireService = typeof tireServices.$inferSelect;
export type InsertTireService = typeof tireServices.$inferInsert;

export type TireInspection = typeof tireInspections.$inferSelect;
export type InsertTireInspection = typeof tireInspections.$inferInsert;

export type TireRotationHistory = typeof tireRotationHistory.$inferSelect;
export type InsertTireRotationHistory = typeof tireRotationHistory.$inferInsert;

export type TireWarranty = typeof tireWarranties.$inferSelect;
export type InsertTireWarranty = typeof tireWarranties.$inferInsert;

// Zod schemas
export const insertTireInventorySchema = createInsertSchema(tireInventory);
export const insertTireServiceSchema = createInsertSchema(tireServices);
export const insertTireInspectionSchema = createInsertSchema(tireInspections);
export const insertTireRotationHistorySchema = createInsertSchema(tireRotationHistory);
export const insertTireWarrantySchema = createInsertSchema(tireWarranties);
