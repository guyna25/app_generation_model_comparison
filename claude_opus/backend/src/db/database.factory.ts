import { IDatabase } from './database.interface';
import { LocalDatabase } from './local.database';
import { MongoDatabase } from './mongo.database';

export type DatabaseType = 'local' | 'mongo';

let databaseInstance: IDatabase | null = null;

export function createDatabase(type: DatabaseType, mongoUri?: string): IDatabase {
    if (databaseInstance) {
        return databaseInstance;
    }

    switch (type) {
        case 'mongo':
            if (!mongoUri) {
                throw new Error('MongoDB URI is required for mongo database type');
            }
            databaseInstance = new MongoDatabase(mongoUri);
            break;
        case 'local':
        default:
            databaseInstance = new LocalDatabase();
            break;
    }

    return databaseInstance;
}

export function getDatabase(): IDatabase {
    if (!databaseInstance) {
        throw new Error('Database not initialized. Call createDatabase first.');
    }
    return databaseInstance;
}

export async function initializeDatabase(): Promise<IDatabase> {
    const dbType = (process.env.DB_TYPE || 'local') as DatabaseType;
    const mongoUri = process.env.MONGO_URI;

    const db = createDatabase(dbType, mongoUri);
    await db.connect();

    console.log(`Database initialized with type: ${dbType}`);
    return db;
}
