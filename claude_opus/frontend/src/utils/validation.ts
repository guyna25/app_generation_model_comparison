import { CreateTodoInput, UpdateTodoInput, ValidationError } from '../types/todo';

export function validateTodoInput(input: CreateTodoInput): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate name
    if (!input.name || typeof input.name !== 'string') {
        errors.push({ field: 'name', message: 'Name is required' });
    } else {
        const name = input.name.trim();
        if (name.length < 4) {
            errors.push({ field: 'name', message: 'Name must be at least 4 characters' });
        }
        if (name.length > 100) {
            errors.push({ field: 'name', message: 'Name must be at most 100 characters' });
        }
    }

    // Validate description
    if (input.description && input.description.length > 500) {
        errors.push({ field: 'description', message: 'Description must be at most 500 characters' });
    }

    // Validate dueDate
    if (!input.dueDate) {
        errors.push({ field: 'dueDate', message: 'Due date is required' });
    } else {
        const date = new Date(input.dueDate);
        if (isNaN(date.getTime())) {
            errors.push({ field: 'dueDate', message: 'Due date must be a valid date' });
        }
    }

    return errors;
}

export function validateUpdateInput(input: UpdateTodoInput): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate name if provided
    if (input.name !== undefined) {
        const name = input.name.trim();
        if (name.length < 4) {
            errors.push({ field: 'name', message: 'Name must be at least 4 characters' });
        }
        if (name.length > 100) {
            errors.push({ field: 'name', message: 'Name must be at most 100 characters' });
        }
    }

    // Validate description if provided
    if (input.description !== undefined && input.description.length > 500) {
        errors.push({ field: 'description', message: 'Description must be at most 500 characters' });
    }

    // Validate dueDate if provided
    if (input.dueDate !== undefined) {
        const date = new Date(input.dueDate);
        if (isNaN(date.getTime())) {
            errors.push({ field: 'dueDate', message: 'Due date must be a valid date' });
        }
    }

    return errors;
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
    return errors.find(e => e.field === field)?.message;
}
