import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Todo, TodoCreation } from '../models/todo';
import { TodoRepository } from '../services/todoService';

const DEFAULT_PATH = path.resolve(__dirname, '..', '..', 'data', 'todos.json');

export class LocalTodoStore implements TodoRepository {
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath ?? DEFAULT_PATH;
  }

  private async readData(): Promise<Todo[]> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(raw) as Todo[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.writeData([]);
        return [];
      }
      throw error;
    }
  }

  private async writeData(items: Todo[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2));
  }

  async list(): Promise<Todo[]> {
    return this.readData();
  }

  async find(id: string): Promise<Todo | null> {
    const items = await this.readData();
    return items.find((item) => item.id === id) ?? null;
  }

  async create(payload: TodoCreation): Promise<Todo> {
    const items = await this.readData();
    const todo: Todo = {
      id: randomUUID(),
      name: payload.name,
      description: payload.description ?? '',
      dueDate: payload.dueDate,
      done: payload.done ?? false
    };
    items.push(todo);
    await this.writeData(items);
    return todo;
  }

  async update(id: string, payload: Partial<TodoCreation>): Promise<Todo | null> {
    const items = await this.readData();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    const current = items[index];
    const updated: Todo = {
      id: current.id,
      name: payload.name ?? current.name,
      description: payload.description ?? current.description,
      dueDate: payload.dueDate ?? current.dueDate,
      done: payload.done ?? current.done
    };
    items[index] = updated;
    await this.writeData(items);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const items = await this.readData();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) {
      return false;
    }
    await this.writeData(filtered);
    return true;
  }
}

