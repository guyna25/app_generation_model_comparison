"use client";

import { useEffect, useState } from "react";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { EmptyState } from "../components/EmptyState";
import { createTodo, deleteTodo, listTodos, updateTodo } from "../lib/api/todos";
import { TodoItem } from "../lib/types/todo";

export default function HomePage() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    try {
      setError(null);
      const data = await listTodos();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (input: Parameters<typeof createTodo>[0]) => {
    setIsSubmitting(true);
    try {
      const created = await createTodo(input);
      setItems((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, updates: Parameters<typeof updateTodo>[1]) => {
    try {
      const updated = await updateTodo(id, updates);
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo.");
    }
  };

  const handleToggle = async (id: string, done: boolean) => {
    try {
      const updated = await updateTodo(id, { done });
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo.");
    }
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-3xl font-semibold">Todo List</h1>
        <p className="mt-2 text-slate-600">Organize tasks and stay on track.</p>
      </header>

      <TodoForm onCreate={handleCreate} isSubmitting={isSubmitting} />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading tasks...</p>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <TodoList items={items} onUpdate={handleUpdate} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </main>
  );
}
