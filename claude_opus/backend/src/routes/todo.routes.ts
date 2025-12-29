import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { validateCreateTodo, validateUpdateTodo } from '../validation/todo.validation';

const router = Router();

// GET /api/todos - Get all todos for browser
router.get('/', todoController.getAll);

// GET /api/todos/:id - Get single todo
router.get('/:id', todoController.getById);

// POST /api/todos - Create new todo
router.post('/', validateCreateTodo, todoController.create);

// PUT /api/todos/:id - Update todo
router.put('/:id', validateUpdateTodo, todoController.update);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', todoController.delete);

export default router;
