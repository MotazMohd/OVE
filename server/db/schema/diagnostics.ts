import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { vehicles } from "./core";

// Diagnostics schema tables
// This module contains vehicle diagnostics and OBD data

export const diagnosticReports = pgTable("diagnostic_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  technicianId: uuid("technician_id"),
  reportType: text("report_type").notNull(),
  summary: text("summary"),
  findings: jsonb("findings").default([]),
  recommendations: jsonb("recommendations").default([]),
  severity: text("severity").default("info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const obdReadings = pgTable("obd_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  diagnosticReportId: uuid("diagnostic_report_id").references(() => diagnosticReports.id),
  dtcCode: text("dtc_code"),
  description: text("description"),
  status: text("status").default("active"),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicleInspections = pgTable("vehicle_inspections", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  inspectorId: uuid("inspector_id"),
  inspectionType: text("inspection_type").notNull(),
  status: text("status").notNull().default("pending"),
  results: jsonb("results").default({}),
  passed: boolean("passed"),
  notes: text("notes"),
  inspectedAt: timestamp("inspected_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  serviceType: text("service_type").notNull(),
  intervalMiles: integer("interval_miles"),
  intervalMonths: integer("interval_months"),
  lastServiceMileage: integer("last_service_mileage"),
  lastServiceDate: timestamp("last_service_date"),
  nextServiceMileage: integer("next_service_mileage"),
  nextServiceDate: timestamp("next_service_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type DiagnosticReport = typeof diagnosticReports.$inferSelect;
export type InsertDiagnosticReport = typeof diagnosticReports.$inferInsert;

export type ObdReading = typeof obdReadings.$inferSelect;
export type InsertObdReading = typeof obdReadings.$inferInsert;

export type VehicleInspection = typeof vehicleInspections.$inferSelect;
export type InsertVehicleInspection = typeof vehicleInspections.$inferInsert;

export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertMaintenanceSchedule = typeof maintenanceSchedules.$inferInsert;

// Zod schemas
export const insertDiagnosticReportSchema = createInsertSchema(diagnosticReports);
export const insertObdReadingSchema = createInsertSchema(obdReadings);
export const insertVehicleInspectionSchema = createInsertSchema(vehicleInspections);
export const insertMaintenanceScheduleSchema = createInsertSchema(maintenanceSchedules);
