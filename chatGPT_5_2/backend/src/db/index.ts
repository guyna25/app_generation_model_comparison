import { LocalTodoStore } from './localStore';
import { MongoTodoStore } from './mongoStore';
import { config } from '../config';
import { TodoRepository } from '../services/todoService';

export const createRepository = async (): Promise<TodoRepository> => {
  if (config.dbType === 'mongo' && config.mongoUri) {
    const store = new MongoTodoStore(config.mongoUri);
    await store.connect();
    return store;
  }
  return new LocalTodoStore();
};

