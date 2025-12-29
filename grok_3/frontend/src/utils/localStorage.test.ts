import { localStorageUtil } from './localStorage';
import { Todo } from '../types/Todo';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('localStorageUtil', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getTodos', () => {
    it('should return empty array when no todos are stored', () => {
      const todos = localStorageUtil.getTodos();
      expect(todos).toEqual([]);
    });

    it('should return stored todos', () => {
      const mockTodos: Todo[] = [
        {
          _id: '1',
          title: 'Test Todo',
          description: 'Test description',
          dueDate: '2024-12-31',
          completed: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      localStorageMock.setItem('todos', JSON.stringify(mockTodos));
      const todos = localStorageUtil.getTodos();
      expect(todos).toEqual(mockTodos);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorageMock.setItem('todos', 'invalid json');
      const todos = localStorageUtil.getTodos();
      expect(todos).toEqual([]);
    });
  });

  describe('saveTodos', () => {
    it('should save todos to localStorage', () => {
      const mockTodos: Todo[] = [
        {
          _id: '1',
          title: 'Test Todo',
          description: 'Test description',
          dueDate: '2024-12-31',
          completed: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      localStorageUtil.saveTodos(mockTodos);
      const stored = localStorageMock.getItem('todos');
      expect(JSON.parse(stored!)).toEqual(mockTodos);
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Storage quota exceeded');
      localStorageMock.setItem = jest.fn().mockImplementation(() => {
        throw mockError;
      });

      const mockTodos: Todo[] = [{ _id: '1', title: 'Test' } as Todo];
      localStorageUtil.saveTodos(mockTodos);

      expect(consoleSpy).toHaveBeenCalledWith('Error saving to localStorage:', mockError);
      consoleSpy.mockRestore();
    });
  });

  describe('addTodo', () => {
    it('should add a todo to existing todos', () => {
      const existingTodos: Todo[] = [
        { _id: '1', title: 'Existing Todo' } as Todo,
      ];
      localStorageUtil.saveTodos(existingTodos);

      const newTodo: Todo = { _id: '2', title: 'New Todo' } as Todo;
      localStorageUtil.addTodo(newTodo);

      const todos = localStorageUtil.getTodos();
      expect(todos).toHaveLength(2);
      expect(todos[1]).toEqual(newTodo);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', () => {
      const todos: Todo[] = [
        { _id: '1', title: 'Original Title', completed: false } as Todo,
      ];
      localStorageUtil.saveTodos(todos);

      localStorageUtil.updateTodo({ _id: '1', title: 'Updated Title', completed: true } as Todo);

      const updatedTodos = localStorageUtil.getTodos();
      expect(updatedTodos[0].title).toBe('Updated Title');
      expect(updatedTodos[0].completed).toBe(true);
    });

    it('should not update if todo not found', () => {
      const todos: Todo[] = [
        { _id: '1', title: 'Original Title' } as Todo,
      ];
      localStorageUtil.saveTodos(todos);

      localStorageUtil.updateTodo({ _id: '2', title: 'Updated Title' } as Todo);

      const updatedTodos = localStorageUtil.getTodos();
      expect(updatedTodos[0].title).toBe('Original Title');
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const todos: Todo[] = [
        { _id: '1', title: 'Todo 1' } as Todo,
        { _id: '2', title: 'Todo 2' } as Todo,
      ];
      localStorageUtil.saveTodos(todos);

      localStorageUtil.deleteTodo('1');

      const remainingTodos = localStorageUtil.getTodos();
      expect(remainingTodos).toHaveLength(1);
      expect(remainingTodos[0]._id).toBe('2');
    });
  });

  describe('clearTodos', () => {
    it('should clear all todos', () => {
      const todos: Todo[] = [
        { _id: '1', title: 'Todo 1' } as Todo,
      ];
      localStorageUtil.saveTodos(todos);

      localStorageUtil.clearTodos();

      const remainingTodos = localStorageUtil.getTodos();
      expect(remainingTodos).toEqual([]);
    });
  });
});
