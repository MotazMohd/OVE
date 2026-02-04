import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, garages } from "./core";
import { spareParts } from "./workshop";

// Marketplace schema tables
// This module contains marketplace and e-commerce entities

export const marketplaceListings = pgTable("marketplace_listings", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => users.id).notNull(),
    garageId: uuid("garage_id").references(() => garages.id),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    quantity: integer("quantity").default(1),
    condition: text("condition").default("new"),
    images: jsonb("images").default([]),
    specifications: jsonb("specifications").default({}),
    status: text("status").notNull().default("draft"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketplaceOrders = pgTable("marketplace_orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id").references(() => users.id).notNull(),
    sellerId: uuid("seller_id").references(() => users.id).notNull(),
    orderNumber: text("order_number").unique().notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("pending"),
    shippingAddress: jsonb("shipping_address"),
    trackingNumber: text("tracking_number"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketplaceOrderItems = pgTable("marketplace_order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => marketplaceOrders.id).notNull(),
    listingId: uuid("listing_id").references(() => marketplaceListings.id).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productReviews = pgTable("product_reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id").references(() => marketplaceListings.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    comment: text("comment"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    helpfulCount: integer("helpful_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wishlist = pgTable("wishlist", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    listingId: uuid("listing_id").references(() => marketplaceListings.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = typeof marketplaceListings.$inferInsert;

export type MarketplaceOrder = typeof marketplaceOrders.$inferSelect;
export type InsertMarketplaceOrder = typeof marketplaceOrders.$inferInsert;

export type MarketplaceOrderItem = typeof marketplaceOrderItems.$inferSelect;
export type InsertMarketplaceOrderItem = typeof marketplaceOrderItems.$inferInsert;

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;

// Zod schemas
export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings);
export const insertMarketplaceOrderSchema = createInsertSchema(marketplaceOrders);
export const insertMarketplaceOrderItemSchema = createInsertSchema(marketplaceOrderItems);
export const insertProductReviewSchema = createInsertSchema(productReviews);
export const insertWishlistSchema = createInsertSchema(wishlist);
