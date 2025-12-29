import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { TodoInput } from '../models/todo';

type TodoFormProps = {
  initial?: TodoInput;
  onSubmit: (payload: TodoInput) => void;
  onCancel?: () => void;
  submitLabel: string;
  errorMessage?: string;
};

const EMPTY: TodoInput = {
  name: '',
  description: '',
  dueDate: '',
  done: false
};

export const TodoForm = ({
  initial = EMPTY,
  onSubmit,
  onCancel,
  submitLabel,
  errorMessage
}: TodoFormProps) => {
  const [form, setForm] = useState<TodoInput>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  const updateField = (field: keyof TodoInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value as TodoInput[typeof field] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <p className="text-sm text-red-300 bg-red-900 px-4 py-2 rounded-lg">{errorMessage}</p>
      )}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Task Title</label>
        <input
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Start writing your next task"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Description</label>
        <textarea
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="You can add context or break it down"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => updateField('dueDate', event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="flex items-end justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-2"
              checked={form.done}
              onChange={(event) => updateField('done', event.target.checked)}
            />
            Mark as done
          </label>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:opacity-90"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-100 transition hover:border-slate-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

