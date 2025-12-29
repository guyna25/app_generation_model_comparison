
const API_URL = 'http://localhost:3001';

const getClientId = () => {
    let clientId = localStorage.getItem('todo_client_id');
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem('todo_client_id', clientId);
    }
    return clientId;
};

const headers = () => ({
    'Content-Type': 'application/json',
    'x-client-id': getClientId(),
});

export interface Todo {
    id?: string;
    title: string;
    description?: string;
    dueDate?: string;
    done: boolean;
}

export const api = {
    getAll: async (): Promise<Todo[]> => {
        const res = await fetch(`${API_URL}/todos`, { headers: headers() });
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
    },

    create: async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
        const res = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error('Failed to create todo');
        return res.json();
    },

    update: async (id: string, todo: Partial<Todo>): Promise<Todo> => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error('Failed to update todo');
        return res.json();
    },

    delete: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: headers(),
        });
        if (!res.ok) throw new Error('Failed to delete todo');
    },
};
