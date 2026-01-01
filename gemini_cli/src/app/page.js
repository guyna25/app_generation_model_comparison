'use client';

import { useState, useEffect } from 'react';
import AddTodoForm from '@/app/components/AddTodoForm';
import TodoList from '@/app/components/TodoList';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('/api/todos');
        if (!res.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await res.json();
        setTodos(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);


  const handleAddTask = (newTask) => {
    // Optimistically update the UI
    setTodos((prevTodos) => [newTask, ...prevTodos]);
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  };

  const handleDeleteTodo = (deletedTodoId) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo._id !== deletedTodoId)
    );
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading tasks...</p>;
    }
    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }
    return <TodoList todos={todos} onUpdate={handleUpdateTodo} onDelete={handleDeleteTodo} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-12 md:p-24 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12">Todo App</h1>
        
        <div className="flex justify-center mb-8">
          <AddTodoForm onAddTask={handleAddTask} />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
