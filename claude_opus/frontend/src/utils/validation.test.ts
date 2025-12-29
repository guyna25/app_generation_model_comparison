import { describe, it, expect } from 'vitest';
import { validateTodoInput, validateUpdateInput, getFieldError } from './validation';

describe('validateTodoInput', () => {
    it('should pass with valid input', () => {
        const input = {
            name: 'Test Todo',
            description: 'A test description',
            dueDate: '2024-12-31'
        };
        const errors = validateTodoInput(input);
        expect(errors).toHaveLength(0);
    });

    it('should fail if name is missing', () => {
        const input = {
            name: '',
            description: 'A test description',
            dueDate: '2024-12-31'
        };
        const errors = validateTodoInput(input);
        expect(errors.some(e => e.field === 'name')).toBe(true);
    });

    it('should fail if name is less than 4 characters', () => {
        const input = {
            name: 'abc',
            description: 'A test description',
            dueDate: '2024-12-31'
        };
        const errors = validateTodoInput(input);
        expect(errors).toContainEqual({
            field: 'name',
            message: 'Name must be at least 4 characters'
        });
    });

    it('should fail if name is more than 100 characters', () => {
        const input = {
            name: 'a'.repeat(101),
            description: 'A test description',
            dueDate: '2024-12-31'
        };
        const errors = validateTodoInput(input);
        expect(errors).toContainEqual({
            field: 'name',
            message: 'Name must be at most 100 characters'
        });
    });

    it('should fail if description is more than 500 characters', () => {
        const input = {
            name: 'Test Todo',
            description: 'a'.repeat(501),
            dueDate: '2024-12-31'
        };
        const errors = validateTodoInput(input);
        expect(errors).toContainEqual({
            field: 'description',
            message: 'Description must be at most 500 characters'
        });
    });

    it('should pass if description is empty', () => {
        const input = {
            name: 'Test Todo',
            description: '',
            dueDate: '2024-12-31'
        };
        const errors = validateTodoInput(input);
        expect(errors).toHaveLength(0);
    });

    it('should fail if dueDate is missing', () => {
        const input = {
            name: 'Test Todo',
            description: 'A test description',
            dueDate: ''
        };
        const errors = validateTodoInput(input);
        expect(errors.some(e => e.field === 'dueDate')).toBe(true);
    });
});

describe('validateUpdateInput', () => {
    it('should pass with valid partial update', () => {
        const input = {
            name: 'Updated Name'
        };
        const errors = validateUpdateInput(input);
        expect(errors).toHaveLength(0);
    });

    it('should fail if name is less than 4 characters on update', () => {
        const input = {
            name: 'ab'
        };
        const errors = validateUpdateInput(input);
        expect(errors).toContainEqual({
            field: 'name',
            message: 'Name must be at least 4 characters'
        });
    });

    it('should pass with empty input (no updates)', () => {
        const input = {};
        const errors = validateUpdateInput(input);
        expect(errors).toHaveLength(0);
    });
});

describe('getFieldError', () => {
    it('should return error message for specified field', () => {
        const errors = [
            { field: 'name', message: 'Name is required' }
        ];
        expect(getFieldError(errors, 'name')).toBe('Name is required');
    });

    it('should return undefined if field has no error', () => {
        const errors = [
            { field: 'name', message: 'Name is required' }
        ];
        expect(getFieldError(errors, 'description')).toBeUndefined();
    });
});
