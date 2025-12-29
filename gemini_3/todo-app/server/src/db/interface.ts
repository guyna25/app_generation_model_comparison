
import type { Todo, TodoWithId } from '../types.js';

export interface TodoStore {
    init(): Promise<void>;
    getAll(clientId: string): Promise<TodoWithId[]>;
    create(clientId: string, todo: Todo): Promise<TodoWithId>;
    update(clientId: string, id: string, todo: Partial<Todo>): Promise<TodoWithId | null>;
    delete(clientId: string, id: string): Promise<boolean>;
}
