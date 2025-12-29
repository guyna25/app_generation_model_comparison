import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { todoRouter } from './routes/todos';
import { createRepository } from './db';
import { config } from './config';
import { ValidationError } from './services/todoService';

const app = express();

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};

const start = async () => {
  const repository = await createRepository();
  app.use(cors());
  app.use(express.json());

  app.use('/api/todos', todoRouter(repository));
  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Todo API listening on http://localhost:${config.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

