
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TodoSchema } from './types.js';
import type { TodoStore } from './db/interface.js';
import { LocalStore } from './db/local.js';
import { MongoStore } from './db/mongo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_TYPE = process.env.DB_TYPE || 'local';

app.use(cors());
app.use(express.json());

// Initialize DB
let store: TodoStore;
if (DB_TYPE === 'mongo') {
    store = new MongoStore();
} else {
    store = new LocalStore();
}

store.init().then(() => {
    console.log(`Database initialized: ${DB_TYPE}`);
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Middleware to get Client ID
const getClientId = (req: express.Request): string => {
    const clientId = req.headers['x-client-id'] as string;
    if (!clientId) {
        // In strict mode we might reject, but allowing flexible "public" list or returning error?
        // Requirement says "persisted locally for each browser".
        // If no client ID, we can't persist associated with browser.
        // For now, return a default 'public' or throw 400.
        // Let's throw 400 to force frontend to send it.
        throw new Error('Missing x-client-id header');
    }
    return clientId;
};

// Error Handler
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.get('/todos', asyncHandler(async (req: express.Request, res: express.Response) => {
    const clientId = getClientId(req);
    const todos = await store.getAll(clientId);
    res.json(todos);
}));

app.post('/todos', asyncHandler(async (req: express.Request, res: express.Response) => {
    const clientId = getClientId(req);
    const result = TodoSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }
    const todo = await store.create(clientId, result.data);
    res.status(201).json(todo);
}));

app.put('/todos/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
    const clientId = getClientId(req);
    const id = req.params.id as string;
    const result = TodoSchema.partial().safeParse(req.body); // Allow partial updates
    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }
    const updated = await store.update(clientId, id, result.data as any);
    if (!updated) {
        res.status(404).json({ error: 'Todo not found' });
        return;
    }
    res.json(updated);
}));

app.delete('/todos/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
    const clientId = getClientId(req);
    const id = req.params.id as string;
    const deleted = await store.delete(clientId, id);
    if (!deleted) {
        res.status(404).json({ error: 'Todo not found' });
        return;
    }
    res.json({ success: true });
}));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
