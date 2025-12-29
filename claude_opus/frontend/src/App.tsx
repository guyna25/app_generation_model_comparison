import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput } from './types/todo';
import { TodoList, AddTodo, EditTodo } from './components';
import todoApi from './services/api';

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = useCallback(async () => {
        try {
            const data = await todoApi.getAll();
            setTodos(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch todos:', err);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleAdd = async (input: CreateTodoInput) => {
        const newTodo = await todoApi.create(input);
        setTodos(prev => [...prev, newTodo]);
    };

    const handleToggle = async (id: string, done: boolean) => {
        const updated = await todoApi.update(id, { done });
        setTodos(prev => prev.map(t => t.id === id ? updated : t));
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
    };

    const handleSave = async (id: string, input: UpdateTodoInput) => {
        const updated = await todoApi.update(id, input);
        setTodos(prev => prev.map(t => t.id === id ? updated : t));
    };

    const handleDelete = async (id: string) => {
        await todoApi.delete(id);
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-orbs">
            {/* Header */}
            <header className="pt-12 pb-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                            Todo App
                        </h1>
                        <p className="text-dark-400 text-lg">
                            Stay organized, get things done
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-16">
                <div className="max-w-2xl mx-auto px-4 space-y-6">
                    {/* Add Todo Section */}
                    <AddTodo onAdd={handleAdd} />

                    {/* Error Message */}
                    {error && (
                        <div className="card bg-red-500/10 border-red-500/30">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-400">{error}</p>
                                <button
                                    onClick={fetchTodos}
                                    className="ml-auto text-sm text-red-400 hover:text-red-300 underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Todo List */}
                    <TodoList
                        todos={todos}
                        loading={loading}
                        onToggle={handleToggle}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 inset-x-0 py-4">
                <div className="text-center text-sm text-dark-500">
                    Built with React, TypeScript & Tailwind CSS
                </div>
            </footer>

            {/* Edit Modal */}
            {editingTodo && (
                <EditTodo
                    todo={editingTodo}
                    onSave={handleSave}
                    onClose={() => setEditingTodo(null)}
                />
            )}
        </div>
    );
}

export default App;
