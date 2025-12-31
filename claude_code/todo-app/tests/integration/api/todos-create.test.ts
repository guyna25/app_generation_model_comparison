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

const { POST } = require('@/app/api/todos/route');

describe('POST /api/todos', () => {
  it('creates a todo with valid data', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Todo',
        description: 'Test description',
        dueDate: '2025-01-15T00:00:00.000Z',
      },
    });

    // Mock the json method
    req.json = async () => ({
      title: 'Test Todo',
      description: 'Test description',
      dueDate: '2025-01-15T00:00:00.000Z',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.title).toBe('Test Todo');
    expect(data.data.description).toBe('Test description');
    expect(data.data.completed).toBe(false);
    expect(data.data._id).toBeDefined();
  });

  it('creates a todo with only required fields', async () => {
    const { req } = createMocks({
      method: 'POST',
    });

    req.json = async () => ({
      title: 'Minimal Todo',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.title).toBe('Minimal Todo');
    expect(data.data.description).toBe('');
    expect(data.data.dueDate).toBeNull();
    expect(data.data.completed).toBe(false);
  });

  it('returns 400 for missing title', async () => {
    const { req } = createMocks({
      method: 'POST',
    });

    req.json = async () => ({
      description: 'No title provided',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.details).toBeDefined();
  });

  it('returns 400 for title too short', async () => {
    const { req } = createMocks({
      method: 'POST',
    });

    req.json = async () => ({
      title: 'ab',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for title too long', async () => {
    const { req } = createMocks({
      method: 'POST',
    });

    req.json = async () => ({
      title: 'a'.repeat(101),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for description too long', async () => {
    const { req } = createMocks({
      method: 'POST',
    });

    req.json = async () => ({
      title: 'Valid Title',
      description: 'a'.repeat(501),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
  });

  it('trims whitespace from title', async () => {
    const { req } = createMocks({
      method: 'POST',
    });

    req.json = async () => ({
      title: '  Trimmed Title  ',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data.title).toBe('Trimmed Title');
  });
});
