
import mongoose, { Schema, Document } from 'mongoose';
import type { TodoStore } from './interface.js';
import type { Todo, TodoWithId } from '../types.js';

interface MongoTodo extends Document {
    clientId: string;
    title: string;
    description?: string;
    dueDate?: string;
    done: boolean;
}

const TodoSchema = new Schema<MongoTodo>({
    clientId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    done: { type: Boolean, default: false },
});

// Avoid recompiling model if hot-reloading
const TodoModel = mongoose.models.Todo || mongoose.model<MongoTodo>('Todo', TodoSchema);

export class MongoStore implements TodoStore {
    async init(): Promise<void> {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
            console.log('Connected to MongoDB at', uri);
        }
    }

    private map(doc: MongoTodo): TodoWithId {
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            dueDate: doc.dueDate,
            done: doc.done,
        };
    }

    async getAll(clientId: string): Promise<TodoWithId[]> {
        const docs = await TodoModel.find({ clientId });
        return docs.map(this.map);
    }

    async create(clientId: string, todo: Todo): Promise<TodoWithId> {
        const doc = await TodoModel.create({ ...todo, clientId });
        return this.map(doc);
    }

    async update(clientId: string, id: string, todo: Partial<Todo>): Promise<TodoWithId | null> {
        const doc = await TodoModel.findOneAndUpdate(
            { _id: id, clientId },
            { $set: todo },
            { new: true }
        );
        return doc ? this.map(doc) : null;
    }

    async delete(clientId: string, id: string): Promise<boolean> {
        const result = await TodoModel.deleteOne({ _id: id, clientId });
        return result.deletedCount === 1;
    }
}
