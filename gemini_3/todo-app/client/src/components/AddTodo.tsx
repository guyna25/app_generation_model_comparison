
import React, { useState } from 'react';
import { api } from '../api';

interface AddTodoProps {
    onAdd: () => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.length < 4 || title.length > 100) {
            setError('Title must be between 4 and 100 characters');
            return;
        }
        if (description.length > 500) {
            setError('Description must be less than 500 characters');
            return;
        }

        try {
            await api.create({ title, description, done: false });
            setTitle('');
            setDescription('');
            setError('');
            onAdd();
        } catch (e) {
            setError('Failed to add todo');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Task title"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Optional description"
                    rows={3}
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
            >
                Add Task
            </button>
        </form>
    );
};
