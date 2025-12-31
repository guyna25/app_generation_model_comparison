import { test, expect } from '@playwright/test';

test.describe('View Todo List (US5)', () => {
  test('displays empty state when no todos exist', async ({ page }) => {
    await page.goto('/');

    const emptyState = page.getByTestId('empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No todos yet');
  });

  test('displays todo list with items', async ({ page }) => {
    // Create a todo first via API
    await page.request.post('/api/todos', {
      data: {
        title: 'Test Todo Item',
        description: 'This is a test description',
        dueDate: '2025-01-15T00:00:00.000Z',
      },
    });

    await page.goto('/');

    const todoList = page.getByTestId('todo-list');
    await expect(todoList).toBeVisible();

    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem).toContainText('Test Todo Item');
    await expect(todoItem).toContainText('This is a test description');
  });

  test('displays todo item with title, description, due date, and status', async ({ page }) => {
    await page.request.post('/api/todos', {
      data: {
        title: 'Complete Todo',
        description: 'A todo with all fields',
        dueDate: '2025-01-20T00:00:00.000Z',
        completed: false,
      },
    });

    await page.goto('/');

    const todoItem = page.getByTestId('todo-item').first();

    // Check title
    await expect(todoItem.getByTestId('todo-title')).toContainText('Complete Todo');

    // Check description
    await expect(todoItem.getByTestId('todo-description')).toContainText('A todo with all fields');

    // Check due date is displayed
    await expect(todoItem.getByTestId('todo-due-date')).toBeVisible();

    // Check checkbox exists and is unchecked
    const checkbox = todoItem.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
  });

  test('displays multiple todos in a list', async ({ page }) => {
    // Create multiple todos
    await page.request.post('/api/todos', {
      data: { title: 'First Todo', description: 'First description' },
    });
    await page.request.post('/api/todos', {
      data: { title: 'Second Todo', description: 'Second description' },
    });
    await page.request.post('/api/todos', {
      data: { title: 'Third Todo', description: 'Third description' },
    });

    await page.goto('/');

    const todoItems = page.getByTestId('todo-item');
    await expect(todoItems).toHaveCount(3);
  });

  test('displays completed todo with visual indicator', async ({ page }) => {
    await page.request.post('/api/todos', {
      data: {
        title: 'Completed Task',
        description: 'This task is done',
        completed: true,
      },
    });

    await page.goto('/');

    const todoItem = page.getByTestId('todo-item').first();
    const checkbox = todoItem.getByRole('checkbox');

    await expect(checkbox).toBeChecked();
    // Check for completed styling (strikethrough or muted)
    await expect(todoItem).toHaveClass(/completed/);
  });
});
