import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, garages } from "./core";
import { invoices } from "./documents";

// Finance schema tables
// This module contains financial management entities

export const taxConfigurations = pgTable("tax_configurations", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id").references(() => garages.id),
    taxName: text("tax_name").notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
    taxType: text("tax_type").default("percentage"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const discounts = pgTable("discounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    garageId: uuid("garage_id").references(() => garages.id),
    code: text("code").unique().notNull(),
    description: text("description"),
    discountType: text("discount_type").notNull(),
    discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
    minPurchaseAmount: decimal("min_purchase_amount", { precision: 10, scale: 2 }),
    maxDiscountAmount: decimal("max_discount_amount", { precision: 10, scale: 2 }),
    validFrom: timestamp("valid_from"),
    validUntil: timestamp("valid_until"),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentPlans = pgTable("payment_plans", {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id").references(() => invoices.id).notNull(),
    customerId: uuid("customer_id").references(() => users.id).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    downPayment: decimal("down_payment", { precision: 10, scale: 2 }),
    numberOfInstallments: integer("number_of_installments").notNull(),
    installmentAmount: decimal("installment_amount", { precision: 10, scale: 2 }).notNull(),
    interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).default("0"),
    status: text("status").notNull().default("active"),
    startDate: timestamp("start_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const installments = pgTable("installments", {
    id: uuid("id").primaryKey().defaultRandom(),
    paymentPlanId: uuid("payment_plan_id").references(() => paymentPlans.id).notNull(),
    installmentNumber: integer("installment_number").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    dueDate: timestamp("due_date").notNull(),
    paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
    paidAt: timestamp("paid_at"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const refunds = pgTable("refunds", {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id").references(() => invoices.id),
    customerId: uuid("customer_id").references(() => users.id).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    reason: text("reason"),
    status: text("status").notNull().default("pending"),
    processedBy: uuid("processed_by").references(() => users.id),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type TaxConfiguration = typeof taxConfigurations.$inferSelect;
export type InsertTaxConfiguration = typeof taxConfigurations.$inferInsert;

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = typeof discounts.$inferInsert;

export type PaymentPlan = typeof paymentPlans.$inferSelect;
export type InsertPaymentPlan = typeof paymentPlans.$inferInsert;

export type Installment = typeof installments.$inferSelect;
export type InsertInstallment = typeof installments.$inferInsert;

export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;

// Zod schemas
export const insertTaxConfigurationSchema = createInsertSchema(taxConfigurations);
export const insertDiscountSchema = createInsertSchema(discounts);
export const insertPaymentPlanSchema = createInsertSchema(paymentPlans);
export const insertInstallmentSchema = createInsertSchema(installments);
export const insertRefundSchema = createInsertSchema(refunds);
