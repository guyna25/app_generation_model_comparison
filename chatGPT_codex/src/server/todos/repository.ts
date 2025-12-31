import { randomUUID } from "crypto";
import { TodoCreateInput, TodoItem, TodoUpdateInput } from "../../lib/types/todo";
import { getMongoTodosCollection, getStorageMode, initLocalSchema } from "../db";
import { allLocal, getLocal, runLocal, runLocalWithChanges } from "../db/local";

const mapLocalRow = (row: Record<string, unknown>): TodoItem => {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description ? String(row.description) : "",
    dueDate: row.dueDate ? String(row.dueDate) : null,
    done: Number(row.done) === 1,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt)
  };
};

export const listTodos = async (): Promise<TodoItem[]> => {
  const mode = getStorageMode();
  if (mode === "mongo") {
    const collection = await getMongoTodosCollection();
    const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return items.map((item) => ({
      id: String(item.id),
      title: String(item.title),
      description: item.description ? String(item.description) : "",
      dueDate: item.dueDate ? String(item.dueDate) : null,
      done: Boolean(item.done),
      createdAt: String(item.createdAt),
      updatedAt: String(item.updatedAt)
    }));
  }

  await initLocalSchema();
  const rows = await allLocal<Record<string, unknown>>(
    "SELECT * FROM todos ORDER BY createdAt DESC"
  );
  return rows.map(mapLocalRow);
};

export const createTodo = async (input: TodoCreateInput): Promise<TodoItem> => {
  const now = new Date().toISOString();
  const item: TodoItem = {
    id: randomUUID(),
    title: input.title,
    description: input.description ?? "",
    dueDate: input.dueDate ?? null,
    done: false,
    createdAt: now,
    updatedAt: now
  };

  const mode = getStorageMode();
  if (mode === "mongo") {
    const collection = await getMongoTodosCollection();
    await collection.insertOne(item);
    return item;
  }

  await initLocalSchema();
  await runLocal(
    "INSERT INTO todos (id, title, description, dueDate, done, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [item.id, item.title, item.description, item.dueDate, item.done ? 1 : 0, item.createdAt, item.updatedAt]
  );
  return item;
};

export const updateTodo = async (id: string, updates: TodoUpdateInput): Promise<TodoItem | null> => {
  const now = new Date().toISOString();

  const mode = getStorageMode();
  if (mode === "mongo") {
    const collection = await getMongoTodosCollection();
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: now } },
      { returnDocument: "after" }
    );
    const item = result.value;
    if (!item) return null;
    return {
      id: String(item.id),
      title: String(item.title),
      description: item.description ? String(item.description) : "",
      dueDate: item.dueDate ? String(item.dueDate) : null,
      done: Boolean(item.done),
      createdAt: String(item.createdAt),
      updatedAt: String(item.updatedAt)
    };
  }

  await initLocalSchema();
  const fields: string[] = [];
  const params: unknown[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    params.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    params.push(updates.description);
  }
  if (updates.dueDate !== undefined) {
    fields.push("dueDate = ?");
    params.push(updates.dueDate);
  }
  if (updates.done !== undefined) {
    fields.push("done = ?");
    params.push(updates.done ? 1 : 0);
  }

  fields.push("updatedAt = ?");
  params.push(now);
  params.push(id);

  const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;
  const changes = await runLocalWithChanges(sql, params);
  if (changes === 0) {
    return null;
  }
  const row = await getLocal<Record<string, unknown>>("SELECT * FROM todos WHERE id = ?", [id]);
  return row ? mapLocalRow(row) : null;
};

export const deleteTodo = async (id: string): Promise<boolean> => {
  const mode = getStorageMode();
  if (mode === "mongo") {
    const collection = await getMongoTodosCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount === 1;
  }

  await initLocalSchema();
  const changes = await runLocalWithChanges("DELETE FROM todos WHERE id = ?", [id]);
  return changes > 0;
};
