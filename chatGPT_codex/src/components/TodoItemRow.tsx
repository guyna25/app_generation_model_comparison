"use client";

import { FormEvent, useState } from "react";
import { TodoItem, TodoUpdateInput } from "../lib/types/todo";

interface TodoItemRowProps {
  item: TodoItem;
  onToggle?: (id: string, done: boolean) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: TodoUpdateInput) => Promise<void>;
}

export const TodoItemRow = ({ item, onToggle, onDelete, onUpdate }: TodoItemRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setDueDate(item.dueDate ?? "");
    setError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const submitEdit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (title.trim().length < 4) {
      setError("Title must be at least 4 characters.");
      return;
    }

    await onUpdate?.(item.id, {
      title: title.trim(),
      description: description.trim() ? description.trim() : "",
      dueDate: dueDate || null
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      {isEditing ? (
        <form onSubmit={submitEdit} className="space-y-3">
          <div>
            <label className="text-xs font-medium">Title</label>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Due date</label>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-slate-900 px-3 py-2 text-xs font-medium text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={item.done}
              disabled={!onToggle}
              onChange={() => onToggle?.(item.id, !item.done)}
              className="mt-1 h-4 w-4"
            />
            <div>
              <h3 className={`text-base font-medium ${item.done ? "line-through text-slate-400" : ""}`}>
                {item.title}
              </h3>
              {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
              {item.dueDate ? (
                <p className="mt-1 text-xs text-slate-500">Due {item.dueDate}</p>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            {onUpdate ? (
              <button
                type="button"
                onClick={startEdit}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
