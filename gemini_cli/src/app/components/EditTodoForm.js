'use client';

import { useState, useEffect } from 'react';

export default function EditTodoForm({ todo, onUpdate, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      // Format date for the input type="date" which requires YYYY-MM-DD
      setDueDate(new Date(todo.dueDate).toISOString().split('T')[0]);
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Title and Due Date are required.');
      return;
    }

    try {
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate }),
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTodo = await res.json();
      if (onUpdate) {
        onUpdate(updatedTodo.data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!todo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <div className="mb-4">
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            minLength="4"
            maxLength="100"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            maxLength="500"
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            id="edit-dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
           <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
