import React, { useState, useEffect } from 'react';
import { Todo, UpdateTodoInput, ValidationError } from '../types/todo';
import { validateUpdateInput, getFieldError } from '../utils/validation';

interface EditTodoProps {
    todo: Todo;
    onSave: (id: string, input: UpdateTodoInput) => Promise<void>;
    onClose: () => void;
}

export const EditTodo: React.FC<EditTodoProps> = ({ todo, onSave, onClose }) => {
    const [name, setName] = useState(todo.name);
    const [description, setDescription] = useState(todo.description);
    const [dueDate, setDueDate] = useState(todo.dueDate.split('T')[0]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const input: UpdateTodoInput = { name, description, dueDate };
        const validationErrors = validateUpdateInput(input);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(todo.id, input);
            onClose();
        } catch (error) {
            console.error('Failed to update todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg card animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-dark-100">Edit Task</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-700 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-dark-300 mb-2">
                            Task Name *
                        </label>
                        <input
                            id="edit-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="What needs to be done?"
                            className={`input-field ${getFieldError(errors, 'name') ? 'input-error' : ''}`}
                            autoFocus
                            data-testid="edit-todo-name"
                        />
                        {getFieldError(errors, 'name') && (
                            <p className="mt-1.5 text-sm text-red-400">{getFieldError(errors, 'name')}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-dark-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add some details (optional)"
                            rows={3}
                            className={`input-field resize-none ${getFieldError(errors, 'description') ? 'input-error' : ''}`}
                            data-testid="edit-todo-description"
                        />
                        {getFieldError(errors, 'description') && (
                            <p className="mt-1.5 text-sm text-red-400">{getFieldError(errors, 'description')}</p>
                        )}
                        <p className="mt-1 text-xs text-dark-500">{description.length}/500 characters</p>
                    </div>

                    <div>
                        <label htmlFor="edit-dueDate" className="block text-sm font-medium text-dark-300 mb-2">
                            Due Date *
                        </label>
                        <input
                            id="edit-dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={`input-field ${getFieldError(errors, 'dueDate') ? 'input-error' : ''}`}
                            data-testid="edit-todo-due-date"
                        />
                        {getFieldError(errors, 'dueDate') && (
                            <p className="mt-1.5 text-sm text-red-400">{getFieldError(errors, 'dueDate')}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                            data-testid="edit-todo-submit"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTodo;
