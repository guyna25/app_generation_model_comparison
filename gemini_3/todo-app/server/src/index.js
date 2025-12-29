import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TodoSchema } from './types.js';
import { LocalStore } from './db/local.js';
import { MongoStore } from './db/mongo.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const DB_TYPE = process.env.DB_TYPE || 'local';
app.use(cors());
app.use(express.json());
// Initialize DB
let store;
if (DB_TYPE === 'mongo') {
    store = new MongoStore();
}
else {
    store = new LocalStore();
}
store.init().then(() => {
    console.log(`Database initialized: ${DB_TYPE}`);
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
// Middleware to get Client ID
const getClientId = (req) => {
    const clientId = req.headers['x-client-id'];
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
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Routes
app.get('/todos', asyncHandler(async (req, res) => {
    const clientId = getClientId(req);
    const todos = await store.getAll(clientId);
    res.json(todos);
}));
app.post('/todos', asyncHandler(async (req, res) => {
    const clientId = getClientId(req);
    const result = TodoSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }
    const todo = await store.create(clientId, result.data);
    res.status(201).json(todo);
}));
app.put('/todos/:id', asyncHandler(async (req, res) => {
    const clientId = getClientId(req);
    const id = req.params.id;
    const result = TodoSchema.partial().safeParse(req.body); // Allow partial updates
    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }
    const updated = await store.update(clientId, id, result.data);
    if (!updated) {
        res.status(404).json({ error: 'Todo not found' });
        return;
    }
    res.json(updated);
}));
app.delete('/todos/:id', asyncHandler(async (req, res) => {
    const clientId = getClientId(req);
    const id = req.params.id;
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
//# sourceMappingURL=index.js.map