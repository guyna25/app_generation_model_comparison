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

const { GET } = require('@/app/api/todos/[id]/route');

describe('GET /api/todos/[id]', () => {
  it('returns a single todo by id', async () => {
    const todo = await Todo.create({
      title: 'Test Todo',
      description: 'Test description',
    });

    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.title).toBe('Test Todo');
    expect(data.data.description).toBe('Test description');
  });

  it('returns 404 for non-existent todo', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req, { params: Promise.resolve({ id: fakeId.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('NOT_FOUND');
  });

  it('returns 400 for invalid id format', async () => {
    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(req, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('INVALID_ID');
  });
});
