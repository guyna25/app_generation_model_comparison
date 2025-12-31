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

const { PUT } = require('@/app/api/todos/[id]/route');

describe('PUT /api/todos/[id]', () => {
  it('updates a todo with valid data', async () => {
    const todo = await Todo.create({
      title: 'Original Title',
      description: 'Original description',
    });

    const { req } = createMocks({
      method: 'PUT',
    });

    req.json = async () => ({
      title: 'Updated Title',
      description: 'Updated description',
    });

    const response = await PUT(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.title).toBe('Updated Title');
    expect(data.data.description).toBe('Updated description');
  });

  it('returns 404 for non-existent todo', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const { req } = createMocks({
      method: 'PUT',
    });

    req.json = async () => ({
      title: 'Updated Title',
    });

    const response = await PUT(req, { params: Promise.resolve({ id: fakeId.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('NOT_FOUND');
  });

  it('returns 400 for validation errors', async () => {
    const todo = await Todo.create({
      title: 'Original Title',
    });

    const { req } = createMocks({
      method: 'PUT',
    });

    req.json = async () => ({
      title: 'ab', // Too short
    });

    const response = await PUT(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
  });

  it('preserves unchanged fields', async () => {
    const todo = await Todo.create({
      title: 'Original Title',
      description: 'Original description',
      completed: true,
    });

    const { req } = createMocks({
      method: 'PUT',
    });

    req.json = async () => ({
      title: 'Updated Title',
    });

    const response = await PUT(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.title).toBe('Updated Title');
    expect(data.data.completed).toBe(true);
  });
});
