import { TodoCreateInput, TodoItem, TodoUpdateInput } from "../../lib/types/todo";
import { ValidationError, validateTodoCreate, validateTodoUpdate } from "../../lib/validation/todo";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./repository";

export type ServiceResult<T> = {
  data?: T;
  errors?: ValidationError[];
  notFound?: boolean;
};

export const listTodosService = async (): Promise<TodoItem[]> => {
  return listTodos();
};

export const createTodoService = async (input: TodoCreateInput): Promise<ServiceResult<TodoItem>> => {
  const validation = validateTodoCreate(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  const item = await createTodo(input);
  return { data: item };
};

export const updateTodoService = async (
  id: string,
  updates: TodoUpdateInput
): Promise<ServiceResult<TodoItem>> => {
  const validation = validateTodoUpdate(updates);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  const item = await updateTodo(id, updates);
  if (!item) {
    return { notFound: true };
  }
  return { data: item };
};

export const deleteTodoService = async (id: string): Promise<ServiceResult<boolean>> => {
  const deleted = await deleteTodo(id);
  if (!deleted) {
    return { notFound: true };
  }
  return { data: true };
};

export const toggleTodoService = async (id: string, done: boolean): Promise<ServiceResult<TodoItem>> => {
  return updateTodoService(id, { done });
};
