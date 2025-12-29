import { MongoClient, Db, Collection } from 'mongodb';
import { IDatabase } from './database.interface';
import { Todo, UpdateTodoInput } from '../types/todo';

export class MongoDatabase implements IDatabase {
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private collection: Collection<Todo> | null = null;

    constructor(private connectionString: string) { }

    async connect(): Promise<void> {
        this.client = new MongoClient(this.connectionString);
        await this.client.connect();
        this.db = this.client.db();
        this.collection = this.db.collection<Todo>('todos');

        // Create index for browserId for efficient queries
        await this.collection.createIndex({ browserId: 1 });
        await this.collection.createIndex({ id: 1, browserId: 1 }, { unique: true });
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            this.collection = null;
        }
    }

    private getCollection(): Collection<Todo> {
        if (!this.collection) {
            throw new Error('Database not connected');
        }
        return this.collection;
    }

    async findAll(browserId: string): Promise<Todo[]> {
        const collection = this.getCollection();
        return collection.find({ browserId }).toArray() as Promise<Todo[]>;
    }

    async findById(id: string, browserId: string): Promise<Todo | null> {
        const collection = this.getCollection();
        return collection.findOne({ id, browserId }) as Promise<Todo | null>;
    }

    async create(todo: Todo): Promise<Todo> {
        const collection = this.getCollection();
        await collection.insertOne(todo as any);
        return todo;
    }

    async update(id: string, browserId: string, updates: UpdateTodoInput): Promise<Todo | null> {
        const collection = this.getCollection();
        const result = await collection.findOneAndUpdate(
            { id, browserId },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
            },
            { returnDocument: 'after' }
        );
        return result as Todo | null;
    }

    async delete(id: string, browserId: string): Promise<boolean> {
        const collection = this.getCollection();
        const result = await collection.deleteOne({ id, browserId });
        return result.deletedCount > 0;
    }
}
