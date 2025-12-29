import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

export class TodoService {
    async getAllTodos(browserId: string): Promise<Todo[]> {
        const db = getDatabase();
        return db.findAll(browserId);
    }

    async getTodoById(id: string, browserId: string): Promise<Todo | null> {
        const db = getDatabase();
        return db.findById(id, browserId);
    }

    async createTodo(input: CreateTodoInput, browserId: string): Promise<Todo> {
        const db = getDatabase();
        const now = new Date().toISOString();

        const todo: Todo = {
            id: uuidv4(),
            name: input.name.trim(),
            description: input.description?.trim() || '',
            dueDate: input.dueDate,
            done: false,
            browserId,
            createdAt: now,
            updatedAt: now
        };

        return db.create(todo);
    }

    async updateTodo(id: string, browserId: string, input: UpdateTodoInput): Promise<Todo | null> {
        const db = getDatabase();

        // Trim strings if provided
        const updates: UpdateTodoInput = { ...input };
        if (updates.name !== undefined) {
            updates.name = updates.name.trim();
        }
        if (updates.description !== undefined) {
            updates.description = updates.description.trim();
        }

        return db.update(id, browserId, updates);
    }

    async deleteTodo(id: string, browserId: string): Promise<boolean> {
        const db = getDatabase();
        return db.delete(id, browserId);
    }
}

export const todoService = new TodoService();
