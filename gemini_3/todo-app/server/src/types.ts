
import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for read
  title: z.string().min(4).max(100),
  description: z.string().max(500).optional(),
  dueDate: z.string().optional(), // ISO Date string
  done: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema>;

export interface TodoWithId extends Todo {
  id: string;
}
