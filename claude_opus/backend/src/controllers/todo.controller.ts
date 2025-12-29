import { Request, Response } from 'express';
import { todoService } from '../services/todo.service';

// Helper to get browser ID from request headers
function getBrowserId(req: Request): string {
    const browserId = req.headers['x-browser-id'] as string;
    if (!browserId) {
        throw new Error('Browser ID is required');
    }
    return browserId;
}

export const todoController = {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const browserId = getBrowserId(req);
            const todos = await todoService.getAllTodos(browserId);
            res.json(todos);
        } catch (error) {
            if ((error as Error).message === 'Browser ID is required') {
                res.status(400).json({ error: 'Browser ID is required' });
                return;
            }
            console.error('Error fetching todos:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const browserId = getBrowserId(req);
            const { id } = req.params;
            const todo = await todoService.getTodoById(id, browserId);

            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            res.json(todo);
        } catch (error) {
            if ((error as Error).message === 'Browser ID is required') {
                res.status(400).json({ error: 'Browser ID is required' });
                return;
            }
            console.error('Error fetching todo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async create(req: Request, res: Response): Promise<void> {
        try {
            const browserId = getBrowserId(req);
            const todo = await todoService.createTodo(req.body, browserId);
            res.status(201).json(todo);
        } catch (error) {
            if ((error as Error).message === 'Browser ID is required') {
                res.status(400).json({ error: 'Browser ID is required' });
                return;
            }
            console.error('Error creating todo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const browserId = getBrowserId(req);
            const { id } = req.params;
            const todo = await todoService.updateTodo(id, browserId, req.body);

            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            res.json(todo);
        } catch (error) {
            if ((error as Error).message === 'Browser ID is required') {
                res.status(400).json({ error: 'Browser ID is required' });
                return;
            }
            console.error('Error updating todo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const browserId = getBrowserId(req);
            const { id } = req.params;
            const deleted = await todoService.deleteTodo(id, browserId);

            if (!deleted) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            if ((error as Error).message === 'Browser ID is required') {
                res.status(400).json({ error: 'Browser ID is required' });
                return;
            }
            console.error('Error deleting todo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
