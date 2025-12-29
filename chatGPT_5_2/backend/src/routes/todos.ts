import { Router } from 'express';
import {
  TodoRepository,
  validateTodoCreation,
  validateTodoUpdate
} from '../services/todoService';

export const todoRouter = (repository: TodoRepository): Router => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const todos = await repository.list();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      validateTodoCreation(req.body);
      const todo = await repository.create(req.body);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      validateTodoUpdate(req.body);
      const todo = await repository.update(req.params.id, req.body);
      if (!todo) {
        return res.sendStatus(404);
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const removed = await repository.remove(req.params.id);
      if (!removed) {
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

