import { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from './todoController';

// Mock the Todo model
jest.mock('../models/Todo');

const mockTodo = Todo as jest.Mocked<typeof Todo>;

describe('Todo Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      const mockTodos = [
        { _id: '1', title: 'Test Todo 1', completed: false },
        { _id: '2', title: 'Test Todo 2', completed: true },
      ];

      mockTodo.find.mockResolvedValue(mockTodos);

      await getAllTodos(mockRequest as Request, mockResponse as Response);

      expect(mockTodo.find).toHaveBeenCalledWith();
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodos);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockTodo.find.mockRejectedValue(error);

      await getAllTodos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Server error',
        error,
      });
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      const mockTodoData = { _id: '1', title: 'Test Todo', completed: false };
      mockRequest.params = { id: '1' };
      mockTodo.findById.mockResolvedValue(mockTodoData);

      await getTodoById(mockRequest as Request, mockResponse as Response);

      expect(mockTodo.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodoData);
    });

    it('should return 404 if todo not found', async () => {
      mockRequest.params = { id: '1' };
      mockTodo.findById.mockResolvedValue(null);

      await getTodoById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'Description',
        dueDate: '2024-12-31T00:00:00.000Z',
        completed: false,
      };

      const mockCreatedTodo = { _id: '1', ...todoData };
      mockRequest.body = todoData;

      // Mock the constructor and save method
      const mockTodoInstance = {
        save: jest.fn().mockResolvedValue(mockCreatedTodo),
      };
      mockTodo.mockImplementation(() => mockTodoInstance as any);

      await createTodo(mockRequest as Request, mockResponse as Response);

      expect(mockTodo).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'Description',
        dueDate: new Date('2024-12-31T00:00:00.000Z'),
        completed: false,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedTodo);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const updateData = { title: 'Updated Todo', completed: true };
      const mockTodoData = { _id: '1', title: 'Updated Todo', completed: true, save: jest.fn() };
      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;

      mockTodo.findById.mockResolvedValue(mockTodoData);
      mockTodoData.save.mockResolvedValue(mockTodoData);

      await updateTodo(mockRequest as Request, mockResponse as Response);

      expect(mockTodo.findById).toHaveBeenCalledWith('1');
      expect(mockTodoData.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodoData);
    });

    it('should return 404 if todo not found', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Todo' };
      mockTodo.findById.mockResolvedValue(null);

      await updateTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const mockTodoData = { _id: '1', title: 'Test Todo' };
      mockRequest.params = { id: '1' };

      mockTodo.findById.mockResolvedValue(mockTodoData);
      mockTodo.findByIdAndDelete.mockResolvedValue(mockTodoData);

      await deleteTodo(mockRequest as Request, mockResponse as Response);

      expect(mockTodo.findById).toHaveBeenCalledWith('1');
      expect(mockTodo.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo deleted successfully' });
    });

    it('should return 404 if todo not found', async () => {
      mockRequest.params = { id: '1' };
      mockTodo.findById.mockResolvedValue(null);

      await deleteTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });
  });
});
