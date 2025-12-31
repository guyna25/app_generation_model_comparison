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

const { DELETE } = require('@/app/api/todos/[id]/route');

describe('DELETE /api/todos/[id]', () => {
  it('deletes an existing todo', async () => {
    const todo = await Todo.create({
      title: 'Todo to delete',
    });

    const { req } = createMocks({
      method: 'DELETE',
    });

    const response = await DELETE(req, { params: Promise.resolve({ id: todo._id.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Todo deleted successfully');

    // Verify it's actually deleted
    const deletedTodo = await Todo.findById(todo._id);
    expect(deletedTodo).toBeNull();
  });

  it('returns 404 for non-existent todo', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const { req } = createMocks({
      method: 'DELETE',
    });

    const response = await DELETE(req, { params: Promise.resolve({ id: fakeId.toString() }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('NOT_FOUND');
  });

  it('returns 400 for invalid id format', async () => {
    const { req } = createMocks({
      method: 'DELETE',
    });

    const response = await DELETE(req, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('INVALID_ID');
  });
});
