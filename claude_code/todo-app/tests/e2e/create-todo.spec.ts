import { test, expect } from '@playwright/test';

test.describe('Create Todo (US1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('creates a todo with all fields', async ({ page }) => {
    // Fill in the form
    await page.getByLabel(/title/i).fill('Buy groceries');
    await page.getByLabel(/description/i).fill('Milk, eggs, bread');
    await page.getByLabel(/due date/i).fill('2025-01-15');

    // Submit the form
    await page.getByRole('button', { name: /add todo/i }).click();

    // Verify the todo appears in the list
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Buy groceries' });
    await expect(todoItem).toBeVisible();
    await expect(todoItem).toContainText('Milk, eggs, bread');
  });

  test('creates a todo with only title', async ({ page }) => {
    await page.getByLabel(/title/i).fill('Simple task');
    await page.getByRole('button', { name: /add todo/i }).click();

    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Simple task' });
    await expect(todoItem).toBeVisible();
  });

  test('shows validation error for empty title', async ({ page }) => {
    await page.getByRole('button', { name: /add todo/i }).click();

    await expect(page.getByText(/title must be at least 4 characters/i)).toBeVisible();
  });

  test('shows validation error for title too short', async ({ page }) => {
    await page.getByLabel(/title/i).fill('ab');
    await page.getByRole('button', { name: /add todo/i }).click();

    await expect(page.getByText(/title must be at least 4 characters/i)).toBeVisible();
  });

  test('shows validation error for title too long', async ({ page }) => {
    await page.getByLabel(/title/i).fill('a'.repeat(101));
    await page.getByRole('button', { name: /add todo/i }).click();

    await expect(page.getByText(/title cannot exceed 100 characters/i)).toBeVisible();
  });

  test('clears form after successful submission', async ({ page }) => {
    await page.getByLabel(/title/i).fill('Test todo');
    await page.getByLabel(/description/i).fill('Test description');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Wait for the todo to appear
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Test todo' })).toBeVisible();

    // Verify form is cleared
    await expect(page.getByLabel(/title/i)).toHaveValue('');
    await expect(page.getByLabel(/description/i)).toHaveValue('');
  });

  test('newly created todo appears with unchecked status', async ({ page }) => {
    await page.getByLabel(/title/i).fill('New incomplete task');
    await page.getByRole('button', { name: /add todo/i }).click();

    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'New incomplete task' });
    await expect(todoItem).toBeVisible();

    const checkbox = todoItem.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
  });
});
