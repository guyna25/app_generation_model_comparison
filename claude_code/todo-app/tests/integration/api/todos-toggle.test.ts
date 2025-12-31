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

const { PATCH } = require('@/app/api/todos/[id]/toggle/route');

describe('PATCH /api/todos/[id]/toggle', () => {
  it('toggles incomplete todo to complete', async () => {
    const todo = await Todo.create({
      title: 'Test Todo',
      completed: false,
    });

    const { req } = createMocks({
      method: 'PATCH',
    });

    const response = await PATCH(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.completed).toBe(true);
  });

  it('toggles complete todo to incomplete', async () => {
    const todo = await Todo.create({
      title: 'Test Todo',
      completed: true,
    });

    const { req } = createMocks({
      method: 'PATCH',
    });

    const response = await PATCH(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.completed).toBe(false);
  });

  it('returns 404 for non-existent todo', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const { req } = createMocks({
      method: 'PATCH',
    });

    const response = await PATCH(req, { params: Promise.resolve({ id: fakeId.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('NOT_FOUND');
  });

  it('returns 400 for invalid id format', async () => {
    const { req } = createMocks({
      method: 'PATCH',
    });

    const response = await PATCH(req, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('persists the toggled state', async () => {
    const todo = await Todo.create({
      title: 'Test Todo',
      completed: false,
    });

    const { req } = createMocks({
      method: 'PATCH',
    });

    await PATCH(req, { params: Promise.resolve({ id: todo._id.toString() }) });

    const updatedTodo = await Todo.findById(todo._id);
    expect(updatedTodo?.completed).toBe(true);
  });
});
