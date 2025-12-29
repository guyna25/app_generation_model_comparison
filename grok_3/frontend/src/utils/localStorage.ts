import { Todo } from '../types/Todo';

const STORAGE_KEY = 'todos';

export const localStorageUtil = {
  // Get todos from localStorage
  getTodos: (): Todo[] => {
    try {
      const todos = localStorage.getItem(STORAGE_KEY);
      return todos ? JSON.parse(todos) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save todos to localStorage
  saveTodos: (todos: Todo[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Add a single todo
  addTodo: (todo: Todo): void => {
    const todos = localStorageUtil.getTodos();
    todos.push(todo);
    localStorageUtil.saveTodos(todos);
  },

  // Update a todo
  updateTodo: (updatedTodo: Todo): void => {
    const todos = localStorageUtil.getTodos();
    const index = todos.findIndex(todo => todo._id === updatedTodo._id);
    if (index !== -1) {
      todos[index] = updatedTodo;
      localStorageUtil.saveTodos(todos);
    }
  },

  // Delete a todo
  deleteTodo: (id: string): void => {
    const todos = localStorageUtil.getTodos();
    const filteredTodos = todos.filter(todo => todo._id !== id);
    localStorageUtil.saveTodos(filteredTodos);
  },

  // Clear all todos
  clearTodos: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
