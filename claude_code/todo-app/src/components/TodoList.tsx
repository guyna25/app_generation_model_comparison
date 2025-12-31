'use client';

import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';

export default function TodoList() {
  const { data, isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">Error loading todos. Please try again.</div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div data-testid="todo-list" className="space-y-3">
      {data.data.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
}
