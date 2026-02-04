import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, garages } from "./core";

// Training schema tables
// This module contains training and certification entities

export const trainingCourses = pgTable("training_courses", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category"),
    level: text("level").default("beginner"),
    duration: integer("duration"),
    content: jsonb("content").default({}),
    prerequisites: jsonb("prerequisites").default([]),
    isActive: boolean("is_active").default(true),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => trainingCourses.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    status: text("status").notNull().default("enrolled"),
    progress: integer("progress").default(0),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    score: decimal("score", { precision: 5, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const certifications = pgTable("certifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    issuingOrganization: text("issuing_organization"),
    validityPeriod: integer("validity_period"),
    requirements: jsonb("requirements").default([]),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userCertifications = pgTable("user_certifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    certificationId: uuid("certification_id").references(() => certifications.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    certificateNumber: text("certificate_number").unique(),
    issuedAt: timestamp("issued_at").notNull(),
    expiresAt: timestamp("expires_at"),
    status: text("status").notNull().default("active"),
    verificationUrl: text("verification_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const trainingMaterials = pgTable("training_materials", {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => trainingCourses.id),
    title: text("title").notNull(),
    description: text("description"),
    materialType: text("material_type").notNull(),
    fileUrl: text("file_url"),
    content: text("content"),
    orderIndex: integer("order_index").default(0),
    isPublic: boolean("is_public").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizzes = pgTable("quizzes", {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => trainingCourses.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    passingScore: decimal("passing_score", { precision: 5, scale: 2 }).default("70"),
    timeLimit: integer("time_limit"),
    questions: jsonb("questions").default([]),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id").references(() => quizzes.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    answers: jsonb("answers").default([]),
    score: decimal("score", { precision: 5, scale: 2 }),
    passed: boolean("passed"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type TrainingCourse = typeof trainingCourses.$inferSelect;
export type InsertTrainingCourse = typeof trainingCourses.$inferInsert;

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

export type UserCertification = typeof userCertifications.$inferSelect;
export type InsertUserCertification = typeof userCertifications.$inferInsert;

export type TrainingMaterial = typeof trainingMaterials.$inferSelect;
export type InsertTrainingMaterial = typeof trainingMaterials.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

// Zod schemas
export const insertTrainingCourseSchema = createInsertSchema(trainingCourses);
export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);
export const insertCertificationSchema = createInsertSchema(certifications);
export const insertUserCertificationSchema = createInsertSchema(userCertifications);
export const insertTrainingMaterialSchema = createInsertSchema(trainingMaterials);
export const insertQuizSchema = createInsertSchema(quizzes);
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
