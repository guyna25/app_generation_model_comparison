import axios from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

// Get or create browser ID for per-browser persistence
function getBrowserId(): string {
    let browserId = localStorage.getItem('todo-browser-id');
    if (!browserId) {
        browserId = crypto.randomUUID();
        localStorage.setItem('todo-browser-id', browserId);
    }
    return browserId;
}

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add browser ID to every request
api.interceptors.request.use((config) => {
    config.headers['x-browser-id'] = getBrowserId();
    return config;
});

export const todoApi = {
    async getAll(): Promise<Todo[]> {
        const response = await api.get<Todo[]>('/todos');
        return response.data;
    },

    async getById(id: string): Promise<Todo> {
        const response = await api.get<Todo>(`/todos/${id}`);
        return response.data;
    },

    async create(input: CreateTodoInput): Promise<Todo> {
        const response = await api.post<Todo>('/todos', input);
        return response.data;
    },

    async update(id: string, input: UpdateTodoInput): Promise<Todo> {
        const response = await api.put<Todo>(`/todos/${id}`, input);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/todos/${id}`);
    },
};

export default todoApi;
