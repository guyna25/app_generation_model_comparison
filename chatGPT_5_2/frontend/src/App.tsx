import { useMemo, useState } from 'react';
import { ItemDisplayAsset } from './assets/ItemDisplayAsset';
import { MainScreenLayout } from './assets/MainScreenLayout';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import type { TodoItem, TodoInput } from './models/todo';
import { useLocalStorage } from './hooks/useLocalStorage';
import { validateDescription, validateTitle } from './utils/validation';

const STORAGE_KEY = 'todo-app-tasks';

const getValidationError = (payload: TodoInput) => {
  if (!validateTitle(payload.name)) {
    return 'Task title must be between 4 and 100 characters.';
  }
  if (!payload.dueDate) {
    return 'Please select a due date.';
  }
  if (!validateDescription(payload.description)) {
    return 'Description must be 500 characters or less.';
  }
  return undefined;
};

const createEmptyTodo = (): TodoInput => ({
  name: '',
  description: '',
  dueDate: '',
  done: false
});

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

function App() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>(STORAGE_KEY, []);
  const [editing, setEditing] = useState<TodoItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const completedCount = useMemo(() => todos.filter((todo) => todo.done).length, [todos]);

  const handleSave = (payload: TodoInput) => {
    const error = getValidationError(payload);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage(undefined);

    if (editing) {
      setTodos((current) =>
        current.map((todo) =>
          todo.id === editing.id
            ? { ...todo, ...payload, description: payload.description }
            : todo
        )
      );
      setEditing(null);
      return;
    }

    const next: TodoItem = {
      id: createId(),
      ...payload
    };
    setTodos((current) => [...current, next]);
  };

  const handleEdit = (todo: TodoItem) => {
    setErrorMessage(undefined);
    setEditing(todo);
  };

  const handleDelete = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
    if (editing?.id === id) {
      setEditing(null);
    }
  };

  const handleToggle = (id: string) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  };

  const formInitial = editing
    ? { name: editing.name, description: editing.description, dueDate: editing.dueDate, done: editing.done }
    : createEmptyTodo();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <MainScreenLayout />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-slate-500">Focused Tasks</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Minimal todo workspace</h1>
          <p className="max-w-3xl text-sm text-slate-400 md:text-base">
            Keep tasks local, shareable later through the API, and keep an eye on deadlines. This screen and the item
            display component were created so the interface can be extended easily.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add task</h2>
              <span className="text-xs uppercase tracking-widest text-slate-500">Local</span>
            </div>
            <TodoForm
              initial={formInitial}
              submitLabel={editing ? 'Update task' : 'Create task'}
              onSubmit={handleSave}
              onCancel={editing ? () => setEditing(null) : undefined}
              errorMessage={errorMessage}
            />
            <div className="mt-6">
              <ItemDisplayAsset />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your tasks</h2>
                <span className="text-xs text-slate-500">
                  {completedCount}/{todos.length} done
                </span>
              </div>
              <p className="text-xs text-slate-500">Changes are saved per browser via local storage.</p>
            </div>
            <TodoList todos={todos} onDelete={handleDelete} onEdit={handleEdit} onToggleDone={handleToggle} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
