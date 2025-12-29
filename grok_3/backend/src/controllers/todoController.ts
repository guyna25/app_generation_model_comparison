import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Todo, ITodoDocument } from '../models/Todo';

export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, dueDate, completed } = req.body;

    const todo = new Todo({
      title,
      description,
      dueDate: new Date(dueDate),
      completed: completed || false
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, dueDate, completed } = req.body;

    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    todo.title = title || todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.dueDate = dueDate ? new Date(dueDate) : todo.dueDate;
    todo.completed = completed !== undefined ? completed : todo.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
