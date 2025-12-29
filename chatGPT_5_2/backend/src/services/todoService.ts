import { Todo, TodoCreation } from '../models/todo';

export interface TodoRepository {
  list(): Promise<Todo[]>;
  find(id: string): Promise<Todo | null>;
  create(item: TodoCreation): Promise<Todo>;
  update(id: string, item: Partial<TodoCreation>): Promise<Todo | null>;
  remove(id: string): Promise<boolean>;
}

export class ValidationError extends Error {
  status = 400;
}

const NAME_MIN = 4;
const NAME_MAX = 100;
const DESC_MAX = 500;

const assertDate = (value: string): void => {
  if (Number.isNaN(Date.parse(value))) {
    throw new ValidationError('dueDate must be a valid date string');
  }
};

const ensureDescription = (description: string | undefined): string => {
  if (description === undefined) return '';
  if (description.length > DESC_MAX) {
    throw new ValidationError(`description must be ${DESC_MAX} characters or less`);
  }
  return description;
};

const ensureName = (name: string): void => {
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    throw new ValidationError(`name must be between ${NAME_MIN} and ${NAME_MAX} characters`);
  }
};

export const validateTodoCreation = (payload: TodoCreation): void => {
  if (!payload.name) {
    throw new ValidationError('name is required');
  }
  if (!payload.dueDate) {
    throw new ValidationError('dueDate is required');
  }
  ensureName(payload.name);
  assertDate(payload.dueDate);
  ensureDescription(payload.description);
};

export const validateTodoUpdate = (payload: Partial<TodoCreation>): void => {
  if (payload.name !== undefined) {
    ensureName(payload.name);
  }
  if (payload.description !== undefined) {
    ensureDescription(payload.description);
  }
  if (payload.dueDate !== undefined) {
    assertDate(payload.dueDate);
  }
};

