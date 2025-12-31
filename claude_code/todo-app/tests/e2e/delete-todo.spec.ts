import { test, expect } from '@playwright/test';

test.describe('Delete Todo (US4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/todos', {
      data: {
        title: 'Todo to Delete',
        description: 'This todo will be deleted',
      },
    });
    await page.goto('/');
  });

  test('shows delete button on todo item', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' });
    const deleteButton = todoItem.getByRole('button', { name: /delete/i });

    await expect(deleteButton).toBeVisible();
  });

  test('shows confirmation dialog when clicking delete', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' });
    await todoItem.getByRole('button', { name: /delete/i }).click();

    // Check for confirmation dialog or confirm button
    await expect(page.getByText(/are you sure|confirm/i)).toBeVisible();
  });

  test('deletes todo after confirmation', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' });
    await todoItem.getByRole('button', { name: /delete/i }).click();

    // Confirm deletion
    await page.getByRole('button', { name: /confirm|yes/i }).click();

    // Verify todo is removed
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' })).not.toBeVisible();
  });

  test('cancels deletion when clicking cancel', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' });
    await todoItem.getByRole('button', { name: /delete/i }).click();

    // Cancel deletion
    await page.getByRole('button', { name: /cancel|no/i }).click();

    // Verify todo is still visible
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' })).toBeVisible();
  });

  test('deleted todo does not reappear after refresh', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' });
    await todoItem.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /confirm|yes/i }).click();

    await expect(page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' })).not.toBeVisible();

    await page.reload();

    await expect(page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' })).not.toBeVisible();
  });

  test('shows empty state after deleting last todo', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Delete' });
    await todoItem.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /confirm|yes/i }).click();

    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
