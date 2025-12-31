'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TodoResponse } from '@/schemas/todo';
import { useToggleTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';

interface TodoItemProps {
  todo: TodoResponse;
}

const editSchema = z.object({
  title: z
    .string()
    .min(4, 'Title must be at least 4 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters'),
  dueDate: z.string(),
});

type EditFormData = z.infer<typeof editSchema>;

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateForInput(dateString: string | null): string {
  if (!dateString) return '';
  return dateString.split('T')[0];
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleTodo = useToggleTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || '',
      dueDate: formatDateForInput(todo.dueDate),
    },
  });

  const handleToggle = () => {
    toggleTodo.mutate(todo._id);
  };

  const handleEdit = () => {
    reset({
      title: todo.title,
      description: todo.description || '',
      dueDate: formatDateForInput(todo.dueDate),
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  const handleSave = async (data: EditFormData) => {
    try {
      await updateTodo.mutateAsync({
        id: todo._id,
        data: {
          title: data.title,
          description: data.description || '',
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo.mutateAsync(todo._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (isEditing) {
    return (
      <div
        data-testid="todo-item"
        data-testid-edit-form="edit-form"
        className="rounded-lg border border-blue-300 bg-blue-50 p-4 dark:border-blue-600 dark:bg-blue-900/20"
      >
        <form data-testid="edit-form" onSubmit={handleSubmit(handleSave)} className="space-y-3">
          <div>
            <label htmlFor={`edit-title-${todo._id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              id={`edit-title-${todo._id}`}
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`edit-description-${todo._id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id={`edit-description-${todo._id}`}
              {...register('description')}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`edit-dueDate-${todo._id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              id={`edit-dueDate-${todo._id}`}
              type="date"
              {...register('dueDate')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updateTodo.isPending}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {updateTodo.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      data-testid="todo-item"
      className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
        todo.completed
          ? 'completed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={toggleTodo.isPending}
        className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="flex-1 min-w-0">
        <h3
          data-testid="todo-title"
          className={`font-medium ${
            todo.completed
              ? 'text-gray-500 line-through dark:text-gray-400'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {todo.title}
        </h3>

        {todo.description && (
          <p
            data-testid="todo-description"
            className={`mt-1 text-sm ${
              todo.completed
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {todo.description}
          </p>
        )}

        {todo.dueDate && (
          <p
            data-testid="todo-due-date"
            className={`mt-2 text-xs ${
              todo.completed
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Due: {formatDate(todo.dueDate)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label={`Edit "${todo.title}"`}
        >
          Edit
        </button>
        {showDeleteConfirm ? (
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Are you sure?</span>
            <button
              onClick={handleDelete}
              disabled={deleteTodo.isPending}
              className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
              aria-label="Confirm delete"
            >
              {deleteTodo.isPending ? '...' : 'Yes'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Cancel delete"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
            aria-label={`Delete "${todo.title}"`}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
