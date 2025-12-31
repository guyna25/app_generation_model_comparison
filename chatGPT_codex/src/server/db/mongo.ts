import { MongoClient, Db } from "mongodb";
import { getMongoUri } from "../../lib/env";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export const getMongoClient = async (): Promise<MongoClient> => {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = getMongoUri();
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
};

export const getMongoDb = async (dbName = "todo_app"): Promise<Db> => {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await getMongoClient();
  cachedDb = client.db(dbName);
  return cachedDb;
};
