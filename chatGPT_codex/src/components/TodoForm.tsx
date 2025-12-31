"use client";

import { FormEvent, useState } from "react";
import { TodoCreateInput } from "../lib/types/todo";

interface TodoFormProps {
  onCreate: (input: TodoCreateInput) => Promise<void>;
  isSubmitting: boolean;
}

export const TodoForm = ({ onCreate, isSubmitting }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (title.trim().length < 4) {
      setError("Title must be at least 4 characters.");
      return;
    }

    const payload: TodoCreateInput = {
      title: title.trim(),
      description: description.trim() ? description.trim() : "",
      dueDate: dueDate || null
    };

    await onCreate(payload);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Write a short task title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional details"
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Due date</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex items-center rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
};
