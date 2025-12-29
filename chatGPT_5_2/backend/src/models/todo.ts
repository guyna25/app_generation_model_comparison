export interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  done: boolean;
}

export interface TodoCreation {
  name: string;
  description?: string;
  dueDate: string;
  done?: boolean;
}

