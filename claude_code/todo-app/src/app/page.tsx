import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Todo List
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your tasks efficiently
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Add New Todo
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <TodoForm />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Your Todos
          </h2>
          <TodoList />
        </section>
      </main>
    </div>
  );
}
