import fs from 'fs/promises';
import path from 'path';

const todosFilePath = path.resolve(process.cwd(), 'todos.json');

export async function readTodos() {
  try {
    const data = await fs.readFile(todosFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, return an empty array
      return [];
    }
    throw error;
  }
}

export async function writeTodos(todos) {
  await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
}
