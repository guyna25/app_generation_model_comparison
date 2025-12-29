import * as fs from 'fs';
import * as path from 'path';
import { IDatabase } from './database.interface';
import { Todo, UpdateTodoInput } from '../types/todo';

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

export class LocalDatabase implements IDatabase {
    private data: Map<string, Todo[]> = new Map();

    async connect(): Promise<void> {
        // Ensure data directory exists
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        // Load existing data if available
        if (fs.existsSync(DATA_FILE)) {
            try {
                const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
                const parsed = JSON.parse(fileContent);
                this.data = new Map(Object.entries(parsed));
            } catch (error) {
                console.error('Error loading data file, starting fresh:', error);
                this.data = new Map();
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.saveToFile();
    }

    private async saveToFile(): Promise<void> {
        const obj: Record<string, Todo[]> = {};
        this.data.forEach((value, key) => {
            obj[key] = value;
        });
        fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
    }

    async findAll(browserId: string): Promise<Todo[]> {
        return this.data.get(browserId) || [];
    }

    async findById(id: string, browserId: string): Promise<Todo | null> {
        const todos = this.data.get(browserId) || [];
        return todos.find(todo => todo.id === id) || null;
    }

    async create(todo: Todo): Promise<Todo> {
        const todos = this.data.get(todo.browserId) || [];
        todos.push(todo);
        this.data.set(todo.browserId, todos);
        await this.saveToFile();
        return todo;
    }

    async update(id: string, browserId: string, updates: UpdateTodoInput): Promise<Todo | null> {
        const todos = this.data.get(browserId) || [];
        const index = todos.findIndex(todo => todo.id === id);

        if (index === -1) {
            return null;
        }

        const updatedTodo: Todo = {
            ...todos[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        todos[index] = updatedTodo;
        this.data.set(browserId, todos);
        await this.saveToFile();
        return updatedTodo;
    }

    async delete(id: string, browserId: string): Promise<boolean> {
        const todos = this.data.get(browserId) || [];
        const index = todos.findIndex(todo => todo.id === id);

        if (index === -1) {
            return false;
        }

        todos.splice(index, 1);
        this.data.set(browserId, todos);
        await this.saveToFile();
        return true;
    }
}
