import type { TodoItem } from '../models/todo';

type TodoListProps = {
  todos: TodoItem[];
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
};

export const TodoList = ({ todos, onEdit, onDelete, onToggleDone }: TodoListProps) => {
  if (!todos.length) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
        No tasks saved yet. Use the form to the left to add a task and it will persist locally in this browser.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <article
          key={todo.id}
          className="group rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-5 shadow-xl shadow-slate-900/40 transition hover:scale-[1.005]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Due {new Date(todo.dueDate).toLocaleDateString()}</p>
              <h3 className="text-xl font-semibold text-white">{todo.name}</h3>
            </div>
            <button
              onClick={() => onToggleDone(todo.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                todo.done
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-slate-600 text-slate-300 hover:border-slate-400'
              }`}
            >
              {todo.done ? 'Completed' : 'Mark done'}
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{todo.description || 'No additional notes yet.'}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <button
              onClick={() => onEdit(todo)}
              className="rounded-full border border-slate-700 px-3 py-1 transition hover:border-slate-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="rounded-full border border-red-500 px-3 py-1 text-red-300 transition hover:bg-red-500/10"
            >
              Delete
            </button>
            <span className="rounded-full border border-slate-800 px-3 py-1">{todo.done ? 'Done' : 'Pending'}</span>
          </div>
        </article>
      ))}
    </div>
  );
};

