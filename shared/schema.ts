import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  icNumber: text("ic_number").notNull().unique(),
  location: text("location").notNull().default("Faculty"),
  dentist: text("dentist").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dentalCharts = pgTable("dental_charts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  toothStates: jsonb("tooth_states").notNull().$type<Record<string, { state: string; surfaces?: Record<string, string> }>>(),
  isCompleted: text("is_completed").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertDentalChartSchema = createInsertSchema(dentalCharts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertDentalChart = z.infer<typeof insertDentalChartSchema>;
export type DentalChart = typeof dentalCharts.$inferSelect;
