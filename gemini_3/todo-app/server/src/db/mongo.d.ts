import type { TodoStore } from './interface.js';
import type { Todo, TodoWithId } from '../types.js';
export declare class MongoStore implements TodoStore {
    init(): Promise<void>;
    private map;
    getAll(clientId: string): Promise<TodoWithId[]>;
    create(clientId: string, todo: Todo): Promise<TodoWithId>;
    update(clientId: string, id: string, todo: Partial<Todo>): Promise<TodoWithId | null>;
    delete(clientId: string, id: string): Promise<boolean>;
}
//# sourceMappingURL=mongo.d.ts.map