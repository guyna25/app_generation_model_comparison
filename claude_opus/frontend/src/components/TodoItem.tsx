import React from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, done: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
    const dueDate = new Date(todo.dueDate);
    const now = new Date();
    const isOverdue = !todo.done && dueDate < now;
    const isDueSoon = !todo.done && !isOverdue &&
        dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            className={`todo-item todo-enter ${todo.done ? 'opacity-60' : ''}`}
            data-testid="todo-item"
        >
            <div className="flex items-start gap-4">
                {/* Custom Checkbox */}
                <button
                    onClick={() => onToggle(todo.id, !todo.done)}
                    className={`checkbox-custom flex-shrink-0 mt-0.5 ${todo.done ? 'checked' : ''}`}
                    aria-label={todo.done ? 'Mark as incomplete' : 'Mark as complete'}
                    data-testid="todo-checkbox"
                >
                    {todo.done && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3
                        className={`text-lg font-medium text-dark-100 ${todo.done ? 'line-through text-dark-400' : ''}`}
                        data-testid="todo-name"
                    >
                        {todo.name}
                    </h3>

                    {todo.description && (
                        <p
                            className={`mt-1 text-sm text-dark-400 ${todo.done ? 'line-through' : ''}`}
                            data-testid="todo-description"
                        >
                            {todo.description}
                        </p>
                    )}

                    <div className="mt-2 flex items-center gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg
                ${isOverdue
                                    ? 'bg-red-500/20 text-red-400'
                                    : isDueSoon
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-dark-700 text-dark-400'
                                }`}
                            data-testid="todo-due-date"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(todo.dueDate)}
                            {isOverdue && ' (Overdue)'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(todo)}
                        className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700/50 rounded-lg transition-colors"
                        aria-label="Edit todo"
                        data-testid="todo-edit-btn"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(todo.id)}
                        className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Delete todo"
                        data-testid="todo-delete-btn"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodoItem;
