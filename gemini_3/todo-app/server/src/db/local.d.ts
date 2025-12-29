import type { TodoStore } from './interface.js';
import type { Todo, TodoWithId } from '../types.js';
export declare class LocalStore implements TodoStore {
    private data;
    init(): Promise<void>;
    private save;
    getAll(clientId: string): Promise<TodoWithId[]>;
    create(clientId: string, todo: Todo): Promise<TodoWithId>;
    update(clientId: string, id: string, todo: Partial<Todo>): Promise<TodoWithId | null>;
    delete(clientId: string, id: string): Promise<boolean>;
}
//# sourceMappingURL=local.d.ts.map