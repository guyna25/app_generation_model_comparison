import mongoose from 'mongoose';
import { Todo, ITodoDocument } from './Todo';

describe('Todo Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  it('should create a todo successfully', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'This is a test todo',
      dueDate: new Date('2024-12-31'),
      completed: false,
    };

    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.title).toBe(todoData.title);
    expect(savedTodo.description).toBe(todoData.description);
    expect(savedTodo.completed).toBe(todoData.completed);
    expect(savedTodo.createdAt).toBeDefined();
    expect(savedTodo.updatedAt).toBeDefined();
  });

  it('should fail validation for title too short', async () => {
    const todoData = {
      title: 'Hi', // Less than 4 characters
      description: 'This is a test todo',
      dueDate: new Date('2024-12-31'),
      completed: false,
    };

    const todo = new Todo(todoData);

    await expect(todo.save()).rejects.toThrow();
  });

  it('should fail validation for title too long', async () => {
    const todoData = {
      title: 'a'.repeat(101), // More than 100 characters
      description: 'This is a test todo',
      dueDate: new Date('2024-12-31'),
      completed: false,
    };

    const todo = new Todo(todoData);

    await expect(todo.save()).rejects.toThrow();
  });

  it('should fail validation for description too long', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'a'.repeat(501), // More than 500 characters
      dueDate: new Date('2024-12-31'),
      completed: false,
    };

    const todo = new Todo(todoData);

    await expect(todo.save()).rejects.toThrow();
  });

  it('should default completed to false', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'This is a test todo',
      dueDate: new Date('2024-12-31'),
    };

    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo.completed).toBe(false);
  });

  it('should default description to empty string', async () => {
    const todoData = {
      title: 'Test Todo',
      dueDate: new Date('2024-12-31'),
    };

    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo.description).toBe('');
  });
});
