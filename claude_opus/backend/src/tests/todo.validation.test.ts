import { validateTodoInput, validateUpdateInput } from '../validation/todo.validation';

describe('Todo Validation', () => {
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
            expect(errors).toContainEqual(
                expect.objectContaining({ field: 'name' })
            );
        });

        it('should fail if name is less than 4 characters', () => {
            const input = {
                name: 'abc',
                description: 'A test description',
                dueDate: '2024-12-31'
            };
            const errors = validateTodoInput(input);
            expect(errors).toContainEqual(
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at least 4 characters'
                })
            );
        });

        it('should fail if name is more than 100 characters', () => {
            const input = {
                name: 'a'.repeat(101),
                description: 'A test description',
                dueDate: '2024-12-31'
            };
            const errors = validateTodoInput(input);
            expect(errors).toContainEqual(
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at most 100 characters'
                })
            );
        });

        it('should fail if description is more than 500 characters', () => {
            const input = {
                name: 'Test Todo',
                description: 'a'.repeat(501),
                dueDate: '2024-12-31'
            };
            const errors = validateTodoInput(input);
            expect(errors).toContainEqual(
                expect.objectContaining({
                    field: 'description',
                    message: 'Description must be at most 500 characters'
                })
            );
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
            expect(errors).toContainEqual(
                expect.objectContaining({ field: 'dueDate' })
            );
        });

        it('should fail if dueDate is invalid', () => {
            const input = {
                name: 'Test Todo',
                description: 'A test description',
                dueDate: 'not-a-date'
            };
            const errors = validateTodoInput(input);
            expect(errors).toContainEqual(
                expect.objectContaining({
                    field: 'dueDate',
                    message: 'Due date must be a valid date'
                })
            );
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

        it('should pass with done field', () => {
            const input = {
                done: true
            };
            const errors = validateUpdateInput(input);
            expect(errors).toHaveLength(0);
        });

        it('should fail if done is not boolean', () => {
            const input = {
                done: 'yes' as any
            };
            const errors = validateUpdateInput(input);
            expect(errors).toContainEqual(
                expect.objectContaining({
                    field: 'done',
                    message: 'Done must be a boolean'
                })
            );
        });

        it('should validate name length on update', () => {
            const input = {
                name: 'ab'
            };
            const errors = validateUpdateInput(input);
            expect(errors).toContainEqual(
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at least 4 characters'
                })
            );
        });
    });
});
