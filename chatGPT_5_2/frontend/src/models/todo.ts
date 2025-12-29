export interface TodoItem {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  done: boolean;
}

export type TodoInput = {
  name: string;
  description: string;
  dueDate: string;
  done: boolean;
};

