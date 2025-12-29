import fs from 'fs/promises';
import path from 'path';
// Using crypto for a simple UUID if available in Node (v14.17+ or v15.6+), or fallback.
// Actually, I'll essentially just use random strings for this demo to avoid extra dependency installation.
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const DB_FILE = path.join(process.cwd(), 'data', 'local_db.json');
export class LocalStore {
    data = {};
    async init() {
        try {
            await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
            const content = await fs.readFile(DB_FILE, 'utf-8');
            this.data = JSON.parse(content);
        }
        catch {
            this.data = {};
        }
    }
    async save() {
        await fs.writeFile(DB_FILE, JSON.stringify(this.data, null, 2));
    }
    async getAll(clientId) {
        return this.data[clientId] || [];
    }
    async create(clientId, todo) {
        if (!this.data[clientId]) {
            this.data[clientId] = [];
        }
        const newTodo = { ...todo, id: generateId() };
        this.data[clientId].push(newTodo);
        await this.save();
        return newTodo;
    }
    async update(clientId, id, todo) {
        const todos = this.data[clientId];
        if (!todos)
            return null;
        const index = todos.findIndex(t => t.id === id);
        if (index === -1)
            return null;
        const existing = todos[index];
        if (!existing)
            return null; // Should be impossible given index check, but satisfies TS
        todos[index] = { ...existing, ...todo, id: existing.id };
        await this.save();
        return todos[index];
    }
    async delete(clientId, id) {
        const todos = this.data[clientId];
        if (!todos)
            return false;
        const index = todos.findIndex(t => t.id === id);
        if (index === -1)
            return false;
        todos.splice(index, 1);
        await this.save();
        return true;
    }
}
//# sourceMappingURL=local.js.map