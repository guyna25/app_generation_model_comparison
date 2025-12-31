import { TodoCreateInput, TodoUpdateInput } from "../types/todo";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const isValidDate = (value: string): boolean => {
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
};

const validateTitle = (title: string | undefined, errors: ValidationError[]) => {
  if (typeof title !== "string") {
    errors.push({ field: "title", message: "Title is required." });
    return;
  }
  if (title.length < 4 || title.length > 100) {
    errors.push({ field: "title", message: "Title must be 4 to 100 characters." });
  }
};

const validateDescription = (description: string | undefined, errors: ValidationError[]) => {
  if (description && description.length > 500) {
    errors.push({ field: "description", message: "Description must be 0 to 500 characters." });
  }
};

const validateDueDate = (dueDate: string | null | undefined, errors: ValidationError[]) => {
  if (dueDate && !isValidDate(dueDate)) {
    errors.push({ field: "dueDate", message: "Due date must be a valid date." });
  }
};

export const validateTodoCreate = (input: TodoCreateInput): ValidationResult => {
  const errors: ValidationError[] = [];

  validateTitle(input.title, errors);
  validateDescription(input.description, errors);
  validateDueDate(input.dueDate, errors);

  return { valid: errors.length === 0, errors };
};

export const validateTodoUpdate = (input: TodoUpdateInput): ValidationResult => {
  const errors: ValidationError[] = [];

  if (input.title !== undefined) {
    validateTitle(input.title, errors);
  }
  if (input.description !== undefined) {
    validateDescription(input.description, errors);
  }
  if (input.dueDate !== undefined) {
    validateDueDate(input.dueDate, errors);
  }

  return { valid: errors.length === 0, errors };
};
