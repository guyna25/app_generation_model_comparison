import { test, expect } from '@playwright/test';

test.describe('Toggle Todo Completion (US2)', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test todo
    await page.request.post('/api/todos', {
      data: {
        title: 'Toggle Test Todo',
        description: 'Test description',
        completed: false,
      },
    });
    await page.goto('/');
  });

  test('toggles incomplete todo to complete', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Toggle Test Todo' });
    const checkbox = todoItem.getByRole('checkbox');

    // Verify initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click to toggle
    await checkbox.click();

    // Verify now checked
    await expect(checkbox).toBeChecked();
  });

  test('toggles complete todo to incomplete', async ({ page }) => {
    // Create a completed todo
    await page.request.post('/api/todos', {
      data: {
        title: 'Completed Toggle Test',
        completed: true,
      },
    });

    await page.reload();

    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Completed Toggle Test' });
    const checkbox = todoItem.getByRole('checkbox');

    // Verify initially checked
    await expect(checkbox).toBeChecked();

    // Click to toggle
    await checkbox.click();

    // Verify now unchecked
    await expect(checkbox).not.toBeChecked();
  });

  test('persists toggle state after page refresh', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Toggle Test Todo' });
    const checkbox = todoItem.getByRole('checkbox');

    // Toggle the todo
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Refresh the page
    await page.reload();

    // Verify the state persisted
    const refreshedTodoItem = page.getByTestId('todo-item').filter({ hasText: 'Toggle Test Todo' });
    const refreshedCheckbox = refreshedTodoItem.getByRole('checkbox');
    await expect(refreshedCheckbox).toBeChecked();
  });

  test('applies visual styling to completed todo', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Toggle Test Todo' });
    const checkbox = todoItem.getByRole('checkbox');

    // Toggle to complete
    await checkbox.click();

    // Verify completed styling is applied
    await expect(todoItem).toHaveClass(/completed/);
  });

  test('removes visual styling when toggled back to incomplete', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Toggle Test Todo' });
    const checkbox = todoItem.getByRole('checkbox');

    // Toggle to complete
    await checkbox.click();
    await expect(todoItem).toHaveClass(/completed/);

    // Toggle back to incomplete
    await checkbox.click();
    await expect(todoItem).not.toHaveClass(/completed/);
  });
});
