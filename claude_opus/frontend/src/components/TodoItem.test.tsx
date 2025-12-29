import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/todo';

const mockTodo: Todo = {
    id: 'test-123',
    name: 'Test Todo Item',
    description: 'This is a test description',
    dueDate: '2025-12-31',
    done: false,
    browserId: 'browser-123',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
};

describe('TodoItem', () => {
    it('renders todo item correctly', () => {
        render(
            <TodoItem
                todo={mockTodo}
                onToggle={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
            />
        );

        expect(screen.getByTestId('todo-name')).toHaveTextContent('Test Todo Item');
        expect(screen.getByTestId('todo-description')).toHaveTextContent('This is a test description');
        expect(screen.getByTestId('todo-due-date')).toBeInTheDocument();
    });

    it('calls onToggle when checkbox is clicked', () => {
        let toggleCalled = false;
        let toggleArgs: [string, boolean] = ['', false];

        render(
            <TodoItem
                todo={mockTodo}
                onToggle={(id, done) => {
                    toggleCalled = true;
                    toggleArgs = [id, done];
                }}
                onEdit={() => { }}
                onDelete={() => { }}
            />
        );

        const checkbox = screen.getByTestId('todo-checkbox');
        fireEvent.click(checkbox);

        expect(toggleCalled).toBe(true);
        expect(toggleArgs[0]).toBe('test-123');
        expect(toggleArgs[1]).toBe(true);
    });

    it('calls onEdit when edit button is clicked', () => {
        let editCalled = false;
        let editTodo: Todo | null = null;

        render(
            <TodoItem
                todo={mockTodo}
                onToggle={() => { }}
                onEdit={(todo) => {
                    editCalled = true;
                    editTodo = todo;
                }}
                onDelete={() => { }}
            />
        );

        const editBtn = screen.getByTestId('todo-edit-btn');
        fireEvent.click(editBtn);

        expect(editCalled).toBe(true);
        expect(editTodo).toEqual(mockTodo);
    });

    it('calls onDelete when delete button is clicked', () => {
        let deleteCalled = false;
        let deleteId = '';

        render(
            <TodoItem
                todo={mockTodo}
                onToggle={() => { }}
                onEdit={() => { }}
                onDelete={(id) => {
                    deleteCalled = true;
                    deleteId = id;
                }}
            />
        );

        const deleteBtn = screen.getByTestId('todo-delete-btn');
        fireEvent.click(deleteBtn);

        expect(deleteCalled).toBe(true);
        expect(deleteId).toBe('test-123');
    });

    it('shows strikethrough when todo is done', () => {
        const doneTodo = { ...mockTodo, done: true };

        render(
            <TodoItem
                todo={doneTodo}
                onToggle={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
            />
        );

        const name = screen.getByTestId('todo-name');
        expect(name).toHaveClass('line-through');
    });
});
