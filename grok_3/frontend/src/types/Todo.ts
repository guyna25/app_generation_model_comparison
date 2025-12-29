export interface Todo {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}
