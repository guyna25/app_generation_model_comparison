import { createMocks } from 'node-mocks-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Todo from '@/models/Todo';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

// Import the handler after setting up the test environment
const { GET } = require('@/app/api/todos/route');

describe('GET /api/todos', () => {
  it('returns empty array when no todos exist', async () => {
    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
    expect(data.count).toBe(0);
  });

  it('returns all todos when todos exist', async () => {
    await Todo.create([
      { title: 'First Todo', description: 'First description' },
      { title: 'Second Todo', description: 'Second description' },
    ]);

    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
    expect(data.count).toBe(2);
  });

  it('returns todos with all required fields', async () => {
    await Todo.create({
      title: 'Test Todo',
      description: 'Test description',
      dueDate: new Date('2025-01-15'),
      completed: false,
    });

    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data[0]).toMatchObject({
      title: 'Test Todo',
      description: 'Test description',
      completed: false,
    });
    expect(data.data[0]._id).toBeDefined();
    expect(data.data[0].createdAt).toBeDefined();
    expect(data.data[0].updatedAt).toBeDefined();
    expect(data.data[0].dueDate).toBeDefined();
  });

  it('returns todos sorted by creation date (newest first)', async () => {
    const firstTodo = await Todo.create({ title: 'First Todo' });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const secondTodo = await Todo.create({ title: 'Second Todo' });

    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data[0].title).toBe('Second Todo');
    expect(data.data[1].title).toBe('First Todo');
  });
});
