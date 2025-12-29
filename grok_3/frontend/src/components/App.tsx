import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { Todo, TodoFormData } from '../types/Todo';
import { todoApi } from '../utils/api';
import { localStorageUtil } from '../utils/localStorage';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const loadTodos = () => {
      try {
        const localTodos = localStorageUtil.getTodos();
        setTodos(localTodos);
      } catch (err) {
        console.error('Error loading todos from localStorage:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync with server when online
  useEffect(() => {
    if (isOnline) {
      syncWithServer();
    }
  }, [isOnline]);

  const syncWithServer = async () => {
    try {
      const serverTodos = await todoApi.getAllTodos();
      setTodos(serverTodos);
      localStorageUtil.saveTodos(serverTodos);
      setError(null);
    } catch (err) {
      console.error('Error syncing with server:', err);
      setError('Failed to sync with server. Using local data.');
    }
  };

  const handleAddTodo = async (todoData: TodoFormData) => {
    try {
      setError(null);

      if (isOnline) {
        // Try to save to server first
        const newTodo = await todoApi.createTodo(todoData);
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        localStorageUtil.saveTodos(updatedTodos);
      } else {
        // Save locally only
        const localTodo: Todo = {
          ...todoData,
          _id: Date.now().toString(), // Temporary ID for local storage
          dueDate: new Date(todoData.dueDate).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTodos = [...todos, localTodo];
        setTodos(updatedTodos);
        localStorageUtil.saveTodos(updatedTodos);
      }
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      setError(null);

      if (isOnline) {
        // Try to update on server
        const updatedTodo = await todoApi.updateTodo(id, updates);
        const updatedTodos = todos.map(todo =>
          todo._id === id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
        localStorageUtil.saveTodos(updatedTodos);
      } else {
        // Update locally only
        const updatedTodos = todos.map(todo =>
          todo._id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo
        );
        setTodos(updatedTodos);
        localStorageUtil.saveTodos(updatedTodos);
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);

      if (isOnline) {
        // Try to delete from server
        await todoApi.deleteTodo(id);
      }

      // Remove from local state and storage
      const updatedTodos = todos.filter(todo => todo._id !== id);
      setTodos(updatedTodos);
      localStorageUtil.saveTodos(updatedTodos);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <div className="flex items-center justify-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isOnline
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? 'bg-green-500' : 'bg-yellow-500'
              }`}></span>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <span className="text-gray-600">
              {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
            </span>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Todo Form */}
          <div>
            <TodoForm onSubmit={handleAddTodo} />
          </div>

          {/* Todo List */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Todos</h2>

              {todos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No todos yet. Add one above to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo._id}
                      todo={todo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
