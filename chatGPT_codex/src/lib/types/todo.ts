export type TodoId = string;

export interface TodoItem {
  id: TodoId;
  title: string;
  description?: string;
  dueDate?: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoCreateInput {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface TodoUpdateInput {
  title?: string;
  description?: string;
  dueDate?: string | null;
  done?: boolean;
}
