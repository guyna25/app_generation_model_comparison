
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import type { Todo } from '../api';
import { TodoItem } from './TodoItem';
import { AddTodo } from './AddTodo';

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTodos = async () => {
        try {
            const data = await api.getAll();
            setTodos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">My Tasks</h1>
            <AddTodo onAdd={fetchTodos} />
            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <p className="text-center text-gray-500 mt-8">No tasks yet. Add one above!</p>
                    ) : (
                        todos.map(todo => (
                            <TodoItem key={todo.id} todo={todo} onRefresh={fetchTodos} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
