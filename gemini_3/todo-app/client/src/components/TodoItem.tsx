
import React, { useState } from 'react';
import { api } from '../api';
import type { Todo } from '../api';

interface TodoItemProps {
    todo: Todo;
    onRefresh: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description || '');

    const handleToggle = async () => {
        await api.update(todo.id!, { done: !todo.done });
        onRefresh();
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this task?')) {
            await api.delete(todo.id!);
            onRefresh();
        }
    };

    const handleUpdate = async () => {
        if (title.length < 4 || title.length > 100) return alert('Title must be 4-100 chars');
        await api.update(todo.id!, { title, description });
        setIsEditing(false);
        onRefresh();
    };

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md mb-3 border-l-4 border-blue-500">
                <input
                    className="w-full mb-2 p-2 border rounded"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full mb-2 p-2 border rounded"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Save</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white p-4 rounded-lg shadow-md mb-3 flex items-center justify-between border-l-4 ${todo.done ? 'border-green-500 bg-gray-50' : 'border-yellow-500'}`}>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={handleToggle}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <h3 className={`text-lg font-semibold ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.title}
                    </h3>
                </div>
                {todo.description && (
                    <p className={`mt-1 text-gray-600 ml-7 ${todo.done ? 'text-gray-400' : ''}`}>{todo.description}</p>
                )}
            </div>
            <div className="flex gap-2 ml-4">
                <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    );
};
