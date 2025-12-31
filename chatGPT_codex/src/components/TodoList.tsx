"use client";

import { TodoItem } from "../lib/types/todo";
import { TodoItemRow } from "./TodoItemRow";

interface TodoListProps {
  items: TodoItem[];
  onToggle?: (id: string, done: boolean) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: import("../lib/types/todo").TodoUpdateInput) => Promise<void>;
}

export const TodoList = ({ items, onToggle, onDelete, onUpdate }: TodoListProps) => {
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => (
        <TodoItemRow
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
