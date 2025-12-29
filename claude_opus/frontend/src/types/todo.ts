export interface Todo {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    done: boolean;
    browserId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTodoInput {
    name: string;
    description: string;
    dueDate: string;
}

export interface UpdateTodoInput {
    name?: string;
    description?: string;
    dueDate?: string;
    done?: boolean;
}

export interface ValidationError {
    field: string;
    message: string;
}
