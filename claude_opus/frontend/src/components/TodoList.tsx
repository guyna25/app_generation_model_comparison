import React from 'react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    loading: boolean;
    onToggle: (id: string, done: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
    todos,
    loading,
    onToggle,
    onEdit,
    onDelete
}) => {
    if (loading) {
        return (
            <div className="card animate-pulse-soft">
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        <p className="text-dark-400">Loading your tasks...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-dark-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-dark-200 mb-2">No tasks yet</h3>
                    <p className="text-dark-400 max-w-sm">
                        Start by adding your first task above. Stay organized and get things done!
                    </p>
                </div>
            </div>
        );
    }

    // Sort todos: incomplete first, then by due date
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const incompleteTodos = sortedTodos.filter(t => !t.done);
    const completedTodos = sortedTodos.filter(t => t.done);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center justify-between px-2">
                <p className="text-sm text-dark-400">
                    <span className="font-medium text-dark-200">{incompleteTodos.length}</span> task{incompleteTodos.length !== 1 ? 's' : ''} remaining
                </p>
                {completedTodos.length > 0 && (
                    <p className="text-sm text-dark-400">
                        <span className="font-medium text-green-400">{completedTodos.length}</span> completed
                    </p>
                )}
            </div>

            {/* Todo Items */}
            <div className="card">
                <div className="space-y-1">
                    {incompleteTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}

                    {completedTodos.length > 0 && incompleteTodos.length > 0 && (
                        <div className="border-t border-dark-700 my-4" />
                    )}

                    {completedTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodoList;
