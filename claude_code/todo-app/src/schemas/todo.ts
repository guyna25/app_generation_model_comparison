import { z } from 'zod';

// Create/Update input validation (for API)
export const todoInputSchema = z.object({
  title: z
    .string()
    .min(4, 'Title must be at least 4 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .transform((val) => val.trim())
    .refine((val) => val.length >= 4, 'Title cannot be only whitespace'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .default(''),
  dueDate: z
    .string()
    .datetime()
    .nullable()
    .optional(),
  completed: z.boolean().optional().default(false),
});

// Partial schema for updates (without defaults to preserve existing values)
export const todoUpdateSchema = z.object({
  title: z
    .string()
    .min(4, 'Title must be at least 4 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .transform((val) => val.trim())
    .refine((val) => val.length >= 4, 'Title cannot be only whitespace')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  dueDate: z
    .string()
    .datetime()
    .nullable()
    .optional(),
  completed: z.boolean().optional(),
});

// Response schema (includes _id and timestamps)
export const todoResponseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string().datetime().nullable(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Type exports
export type TodoInput = z.infer<typeof todoInputSchema>;
export type TodoUpdate = z.infer<typeof todoUpdateSchema>;
export type TodoResponse = z.infer<typeof todoResponseSchema>;
