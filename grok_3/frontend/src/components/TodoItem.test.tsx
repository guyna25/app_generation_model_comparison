import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

const mockTodo: Todo = {
  _id: '1',
  title: 'Test Todo',
  description: 'Test description',
  dueDate: '2024-12-31',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockOnUpdate = jest.fn();
const mockOnDelete = jest.fn();

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo information correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Due: 12/31/2024')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('shows completed styling when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(
      <TodoItem
        todo={completedTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toHaveClass('line-through');
    expect(screen.getByText('Test description')).toHaveClass('line-through');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onUpdate when checkbox is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnUpdate).toHaveBeenCalledWith('1', { completed: true });
  });

  it('enters edit mode when edit button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('✏️');
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
  });

  it('calls onUpdate with correct data when save is clicked', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('✏️');
    fireEvent.click(editButton);

    // Change title
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

    // Save changes
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', {
        title: 'Updated Todo',
        description: 'Test description',
        dueDate: '2024-12-31T00:00:00.000Z',
      });
    });
  });

  it('shows validation errors for invalid title', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('✏️');
    fireEvent.click(editButton);

    // Enter invalid title (too short)
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Hi' } });

    // Try to save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText('Title must be at least 4 characters')).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('shows validation errors for past due date', async () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('✏️');
    fireEvent.click(editButton);

    // Enter past date
    const dateInput = screen.getByDisplayValue('2024-12-31');
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];
    fireEvent.change(dateInput, { target: { value: pastDateString } });

    // Try to save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText('Due date cannot be in the past')).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('🗑️');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('cancels edit mode when cancel button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('✏️');
    fireEvent.click(editButton);

    // Change title
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Changed Title' } });

    // Cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Should be back to original state
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
});
