import { TodoCreateInput, TodoItem, TodoUpdateInput } from "../types/todo";

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }
  return data as T;
};

export const listTodos = async (): Promise<TodoItem[]> => {
  const response = await fetch("/api/todos", { cache: "no-store" });
  return handleResponse<TodoItem[]>(response);
};

export const createTodo = async (input: TodoCreateInput): Promise<TodoItem> => {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return handleResponse<TodoItem>(response);
};

export const updateTodo = async (id: string, input: TodoUpdateInput): Promise<TodoItem> => {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return handleResponse<TodoItem>(response);
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "Delete failed");
  }
};
