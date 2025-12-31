import sqlite3 from "sqlite3";
import { env } from "../../lib/env";

let cachedDb: sqlite3.Database | null = null;

export const getLocalDb = (): sqlite3.Database => {
  if (cachedDb) {
    return cachedDb;
  }
  if (!env.localDbPath) {
    throw new Error("LOCAL_DB_PATH is required for local database usage.");
  }
  cachedDb = new sqlite3.Database(env.localDbPath);
  return cachedDb;
};

export const runLocal = (sql: string, params: unknown[] = []): Promise<void> => {
  const db = getLocalDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const runLocalWithChanges = (sql: string, params: unknown[] = []): Promise<number> => {
  const db = getLocalDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err) {
      if (err) reject(err);
      else resolve(this.changes ?? 0);
    });
  });
};

export const allLocal = <T>(sql: string, params: unknown[] = []): Promise<T[]> => {
  const db = getLocalDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

export const getLocal = <T>(sql: string, params: unknown[] = []): Promise<T | undefined> => {
  const db = getLocalDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
};
