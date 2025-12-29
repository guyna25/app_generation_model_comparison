import React, { useState } from 'react';
import { CreateTodoInput, ValidationError } from '../types/todo';
import { validateTodoInput, getFieldError } from '../utils/validation';

interface AddTodoProps {
    onAdd: (input: CreateTodoInput) => Promise<void>;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const input: CreateTodoInput = { name, description, dueDate };
        const validationErrors = validateTodoInput(input);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onAdd(input);
            // Reset form
            setName('');
            setDescription('');
            setDueDate('');
            setErrors([]);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to add todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setName('');
        setDescription('');
        setDueDate('');
        setErrors([]);
        setIsOpen(false);
    };

    // Get today's date for min date constraint
    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full card hover:shadow-glow transition-shadow duration-300 group"
                data-testid="add-todo-btn"
            >
                <div className="flex items-center justify-center gap-3 py-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                        flex items-center justify-center shadow-lg shadow-primary-500/25
                        group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-shadow">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-lg font-medium text-dark-200 group-hover:text-primary-400 transition-colors">
                        Add New Task
                    </span>
                </div>
            </button>
        );
    }

    return (
        <div className="card animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
                        Task Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What needs to be done?"
                        className={`input-field ${getFieldError(errors, 'name') ? 'input-error' : ''}`}
                        autoFocus
                        data-testid="add-todo-name"
                    />
                    {getFieldError(errors, 'name') && (
                        <p className="mt-1.5 text-sm text-red-400">{getFieldError(errors, 'name')}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-dark-300 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add some details (optional)"
                        rows={3}
                        className={`input-field resize-none ${getFieldError(errors, 'description') ? 'input-error' : ''}`}
                        data-testid="add-todo-description"
                    />
                    {getFieldError(errors, 'description') && (
                        <p className="mt-1.5 text-sm text-red-400">{getFieldError(errors, 'description')}</p>
                    )}
                    <p className="mt-1 text-xs text-dark-500">{description.length}/500 characters</p>
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-dark-300 mb-2">
                        Due Date *
                    </label>
                    <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={today}
                        className={`input-field ${getFieldError(errors, 'dueDate') ? 'input-error' : ''}`}
                        data-testid="add-todo-due-date"
                    />
                    {getFieldError(errors, 'dueDate') && (
                        <p className="mt-1.5 text-sm text-red-400">{getFieldError(errors, 'dueDate')}</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSubmitting}
                        data-testid="add-todo-submit"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Adding...
                            </span>
                        ) : (
                            'Add Task'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTodo;
