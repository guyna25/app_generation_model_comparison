import { test, expect } from '@playwright/test';

test.describe('Edit Todo (US3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/todos', {
      data: {
        title: 'Todo to Edit',
        description: 'Original description',
        dueDate: '2025-01-15T00:00:00.000Z',
      },
    });
    await page.goto('/');
  });

  test('opens edit mode when clicking edit button', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' });
    await todoItem.getByRole('button', { name: /edit/i }).click();

    // Verify edit form is visible
    const editForm = page.getByTestId('edit-form');
    await expect(editForm).toBeVisible();
  });

  test('pre-populates form with existing values', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' });
    await todoItem.getByRole('button', { name: /edit/i }).click();

    const titleInput = page.getByLabel(/title/i);
    const descriptionInput = page.getByLabel(/description/i);

    await expect(titleInput).toHaveValue('Todo to Edit');
    await expect(descriptionInput).toHaveValue('Original description');
  });

  test('updates todo with new values', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' });
    await todoItem.getByRole('button', { name: /edit/i }).click();

    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Todo Title');

    await page.getByRole('button', { name: /save/i }).click();

    // Verify the update
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Updated Todo Title' })).toBeVisible();
  });

  test('shows validation error for invalid edit', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' });
    await todoItem.getByRole('button', { name: /edit/i }).click();

    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('ab');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText(/title must be at least 4 characters/i)).toBeVisible();
  });

  test('cancels edit and preserves original values', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' });
    await todoItem.getByRole('button', { name: /edit/i }).click();

    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Changed Title');

    await page.getByRole('button', { name: /cancel/i }).click();

    // Verify original value is preserved
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' })).toBeVisible();
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Changed Title' })).not.toBeVisible();
  });

  test('persists edited values after page refresh', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Todo to Edit' });
    await todoItem.getByRole('button', { name: /edit/i }).click();

    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Persistent Update');

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Persistent Update' })).toBeVisible();

    await page.reload();

    await expect(page.getByTestId('todo-item').filter({ hasText: 'Persistent Update' })).toBeVisible();
  });
});
