'use client';

import { useState } from 'react';
import EditTodoForm from '@/app/components/EditTodoForm';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  // Format date for better readability
  const formattedDueDate = new Date(todo.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleToggleComplete = async () => {
    try {
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDone: !todo.isDone }),
      });

      if (!res.ok) {
        throw new Error('Failed to update task status');
      }

      const updatedTodo = await res.json();
      if (onUpdate) {
        onUpdate(updatedTodo.data);
      }
    } catch (error) {
      console.error(error);
      // In a real app, revert the checkbox state and show an error
    }
  };

  const handleUpdate = (updatedTodo) => {
    if (onUpdate) {
      onUpdate(updatedTodo);
    }
    setIsEditing(false); // Hide form on successful update
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        const res = await fetch(`/api/todos/${todo._id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete task');
        }

        if (onDelete) {
          onDelete(todo._id);
        }
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md border flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={handleToggleComplete}
            className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <div className="ml-4">
            <h3 className={`text-lg font-medium ${todo.isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`text-sm ${todo.isDone ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end sm:justify-start space-x-4">
          <div className="text-right sm:text-left">
            <p className="text-sm text-gray-500">Due: {formattedDueDate}</p>
          </div>
          <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
              <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditTodoForm 
          todo={todo}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
