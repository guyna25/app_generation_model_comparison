import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    findAll(browserId: string): Promise<Todo[]>;
    findById(id: string, browserId: string): Promise<Todo | null>;
    create(todo: Todo): Promise<Todo>;
    update(id: string, browserId: string, updates: UpdateTodoInput): Promise<Todo | null>;
    delete(id: string, browserId: string): Promise<boolean>;
}
