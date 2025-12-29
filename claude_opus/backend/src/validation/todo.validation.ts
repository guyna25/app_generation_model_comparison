import { Request, Response, NextFunction } from 'express';
import { CreateTodoInput, UpdateTodoInput } from '../types/todo';

export interface ValidationError {
    field: string;
    message: string;
}

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
    if (input.description !== undefined && input.description !== null) {
        if (typeof input.description !== 'string') {
            errors.push({ field: 'description', message: 'Description must be a string' });
        } else if (input.description.length > 500) {
            errors.push({ field: 'description', message: 'Description must be at most 500 characters' });
        }
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
        if (typeof input.name !== 'string') {
            errors.push({ field: 'name', message: 'Name must be a string' });
        } else {
            const name = input.name.trim();
            if (name.length < 4) {
                errors.push({ field: 'name', message: 'Name must be at least 4 characters' });
            }
            if (name.length > 100) {
                errors.push({ field: 'name', message: 'Name must be at most 100 characters' });
            }
        }
    }

    // Validate description if provided
    if (input.description !== undefined && input.description !== null) {
        if (typeof input.description !== 'string') {
            errors.push({ field: 'description', message: 'Description must be a string' });
        } else if (input.description.length > 500) {
            errors.push({ field: 'description', message: 'Description must be at most 500 characters' });
        }
    }

    // Validate dueDate if provided
    if (input.dueDate !== undefined) {
        const date = new Date(input.dueDate);
        if (isNaN(date.getTime())) {
            errors.push({ field: 'dueDate', message: 'Due date must be a valid date' });
        }
    }

    // Validate done if provided
    if (input.done !== undefined && typeof input.done !== 'boolean') {
        errors.push({ field: 'done', message: 'Done must be a boolean' });
    }

    return errors;
}

export function validateCreateTodo(req: Request, res: Response, next: NextFunction): void {
    const errors = validateTodoInput(req.body);

    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    next();
}

export function validateUpdateTodo(req: Request, res: Response, next: NextFunction): void {
    const errors = validateUpdateInput(req.body);

    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    next();
}
