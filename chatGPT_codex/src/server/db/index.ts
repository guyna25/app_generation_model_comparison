import { env } from "../../lib/env";
import { getMongoDb } from "./mongo";
import { runLocal } from "./local";

export type StorageMode = "mongo" | "local";

export const getStorageMode = (): StorageMode => {
  return env.mongoUri ? "mongo" : "local";
};

export const getMongoTodosCollection = async () => {
  const db = await getMongoDb();
  return db.collection("todos");
};

export const initLocalSchema = async (): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      done INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `;
  await runLocal(sql);
};
