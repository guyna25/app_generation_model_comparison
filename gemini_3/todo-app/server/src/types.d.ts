import { z } from 'zod';
export declare const TodoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    done: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type Todo = z.infer<typeof TodoSchema>;
export interface TodoWithId extends Todo {
    id: string;
}
//# sourceMappingURL=types.d.ts.map