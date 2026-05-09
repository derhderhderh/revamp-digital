import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal("")),
  message: z.string().min(10).max(2000)
});

export const quoteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  businessType: z.string().min(2),
  currentWebsite: z.string().url().optional().or(z.literal("")),
  pagesNeeded: z.string().min(1),
  features: z.string().min(2),
  brandingGoals: z.string().min(2),
  timeline: z.string().min(2),
  maintenanceNeeds: z.string().min(2)
});

export const analyzeSchema = z.object({
  url: z.string().url(),
  businessType: z.string().optional().default("small business")
});

export const chatSchema = z.object({
  message: z.string().min(1).max(1200),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional().default([])
});

export const suggestionsSchema = z.object({
  businessType: z.string().min(2),
  goal: z.string().min(2),
  audience: z.string().min(2),
  website: z.string().url().optional().or(z.literal(""))
});
