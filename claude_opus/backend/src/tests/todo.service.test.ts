import { TodoService } from '../services/todo.service';
import { IDatabase } from '../db/database.interface';
import { Todo } from '../types/todo';

// Mock the database module
jest.mock('../db', () => ({
    getDatabase: jest.fn()
}));

import { getDatabase } from '../db';

describe('TodoService', () => {
    let todoService: TodoService;
    let mockDatabase: jest.Mocked<IDatabase>;

    const mockTodo: Todo = {
        id: 'test-id-123',
        name: 'Test Todo',
        description: 'Test description',
        dueDate: '2024-12-31',
        done: false,
        browserId: 'browser-123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    };

    beforeEach(() => {
        mockDatabase = {
            connect: jest.fn(),
            disconnect: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        (getDatabase as jest.Mock).mockReturnValue(mockDatabase);
        todoService = new TodoService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTodos', () => {
        it('should return all todos for a browser', async () => {
            mockDatabase.findAll.mockResolvedValue([mockTodo]);

            const result = await todoService.getAllTodos('browser-123');

            expect(mockDatabase.findAll).toHaveBeenCalledWith('browser-123');
            expect(result).toEqual([mockTodo]);
        });

        it('should return empty array when no todos exist', async () => {
            mockDatabase.findAll.mockResolvedValue([]);

            const result = await todoService.getAllTodos('browser-123');

            expect(result).toEqual([]);
        });
    });

    describe('getTodoById', () => {
        it('should return a todo by id', async () => {
            mockDatabase.findById.mockResolvedValue(mockTodo);

            const result = await todoService.getTodoById('test-id-123', 'browser-123');

            expect(mockDatabase.findById).toHaveBeenCalledWith('test-id-123', 'browser-123');
            expect(result).toEqual(mockTodo);
        });

        it('should return null when todo not found', async () => {
            mockDatabase.findById.mockResolvedValue(null);

            const result = await todoService.getTodoById('non-existent', 'browser-123');

            expect(result).toBeNull();
        });
    });

    describe('createTodo', () => {
        it('should create a new todo', async () => {
            const input = {
                name: 'New Todo',
                description: 'New description',
                dueDate: '2024-12-31'
            };

            mockDatabase.create.mockImplementation(async (todo) => todo);

            const result = await todoService.createTodo(input, 'browser-123');

            expect(result.name).toBe('New Todo');
            expect(result.description).toBe('New description');
            expect(result.dueDate).toBe('2024-12-31');
            expect(result.done).toBe(false);
            expect(result.browserId).toBe('browser-123');
            expect(result.id).toBeDefined();
            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();
        });

        it('should trim name and description', async () => {
            const input = {
                name: '  Trimmed Name  ',
                description: '  Trimmed description  ',
                dueDate: '2024-12-31'
            };

            mockDatabase.create.mockImplementation(async (todo) => todo);

            const result = await todoService.createTodo(input, 'browser-123');

            expect(result.name).toBe('Trimmed Name');
            expect(result.description).toBe('Trimmed description');
        });
    });

    describe('updateTodo', () => {
        it('should update an existing todo', async () => {
            const updates = { name: 'Updated Name', done: true };
            const updatedTodo = { ...mockTodo, ...updates };

            mockDatabase.update.mockResolvedValue(updatedTodo);

            const result = await todoService.updateTodo('test-id-123', 'browser-123', updates);

            expect(mockDatabase.update).toHaveBeenCalledWith('test-id-123', 'browser-123', updates);
            expect(result?.name).toBe('Updated Name');
            expect(result?.done).toBe(true);
        });

        it('should return null when todo not found', async () => {
            mockDatabase.update.mockResolvedValue(null);

            const result = await todoService.updateTodo('non-existent', 'browser-123', { name: 'Test' });

            expect(result).toBeNull();
        });
    });

    describe('deleteTodo', () => {
        it('should delete a todo', async () => {
            mockDatabase.delete.mockResolvedValue(true);

            const result = await todoService.deleteTodo('test-id-123', 'browser-123');

            expect(mockDatabase.delete).toHaveBeenCalledWith('test-id-123', 'browser-123');
            expect(result).toBe(true);
        });

        it('should return false when todo not found', async () => {
            mockDatabase.delete.mockResolvedValue(false);

            const result = await todoService.deleteTodo('non-existent', 'browser-123');

            expect(result).toBe(false);
        });
    });
});
