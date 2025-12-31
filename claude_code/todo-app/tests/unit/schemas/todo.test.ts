import { todoInputSchema, todoUpdateSchema, todoResponseSchema } from '@/schemas/todo';

describe('todoInputSchema', () => {
  describe('title validation', () => {
    it('accepts valid title with minimum length', () => {
      const result = todoInputSchema.safeParse({ title: 'Test' });
      expect(result.success).toBe(true);
    });

    it('accepts valid title with maximum length', () => {
      const title = 'a'.repeat(100);
      const result = todoInputSchema.safeParse({ title });
      expect(result.success).toBe(true);
    });

    it('rejects title shorter than 4 characters', () => {
      const result = todoInputSchema.safeParse({ title: 'abc' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title must be at least 4 characters');
      }
    });

    it('rejects title longer than 100 characters', () => {
      const title = 'a'.repeat(101);
      const result = todoInputSchema.safeParse({ title });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title cannot exceed 100 characters');
      }
    });

    it('trims whitespace from title', () => {
      const result = todoInputSchema.safeParse({ title: '  Test Todo  ' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Todo');
      }
    });

    it('rejects whitespace-only title', () => {
      const result = todoInputSchema.safeParse({ title: '    ' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title cannot be only whitespace');
      }
    });

    it('rejects missing title', () => {
      const result = todoInputSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    it('accepts empty description', () => {
      const result = todoInputSchema.safeParse({ title: 'Test', description: '' });
      expect(result.success).toBe(true);
    });

    it('defaults description to empty string when not provided', () => {
      const result = todoInputSchema.safeParse({ title: 'Test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe('');
      }
    });

    it('accepts description at max length', () => {
      const description = 'a'.repeat(500);
      const result = todoInputSchema.safeParse({ title: 'Test', description });
      expect(result.success).toBe(true);
    });

    it('rejects description longer than 500 characters', () => {
      const description = 'a'.repeat(501);
      const result = todoInputSchema.safeParse({ title: 'Test', description });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description cannot exceed 500 characters');
      }
    });
  });

  describe('dueDate validation', () => {
    it('accepts valid ISO date string', () => {
      const result = todoInputSchema.safeParse({
        title: 'Test',
        dueDate: '2025-01-15T00:00:00.000Z',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBe('2025-01-15T00:00:00.000Z');
      }
    });

    it('accepts null dueDate', () => {
      const result = todoInputSchema.safeParse({ title: 'Test', dueDate: null });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBeNull();
      }
    });

    it('defaults dueDate to undefined when not provided', () => {
      const result = todoInputSchema.safeParse({ title: 'Test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBeUndefined();
      }
    });

    it('rejects invalid date format', () => {
      const result = todoInputSchema.safeParse({ title: 'Test', dueDate: 'invalid-date' });
      expect(result.success).toBe(false);
    });
  });

  describe('completed validation', () => {
    it('accepts boolean true', () => {
      const result = todoInputSchema.safeParse({ title: 'Test', completed: true });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(true);
      }
    });

    it('accepts boolean false', () => {
      const result = todoInputSchema.safeParse({ title: 'Test', completed: false });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(false);
      }
    });

    it('defaults completed to false when not provided', () => {
      const result = todoInputSchema.safeParse({ title: 'Test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(false);
      }
    });

    it('rejects non-boolean completed value', () => {
      const result = todoInputSchema.safeParse({ title: 'Test', completed: 'yes' });
      expect(result.success).toBe(false);
    });
  });
});

describe('todoUpdateSchema', () => {
  it('allows partial updates with just title', () => {
    const result = todoUpdateSchema.safeParse({ title: 'Updated' });
    expect(result.success).toBe(true);
  });

  it('allows partial updates with just description', () => {
    const result = todoUpdateSchema.safeParse({ description: 'New description' });
    expect(result.success).toBe(true);
  });

  it('allows partial updates with just completed', () => {
    const result = todoUpdateSchema.safeParse({ completed: true });
    expect(result.success).toBe(true);
  });

  it('allows empty object for no changes', () => {
    const result = todoUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still validates title constraints when provided', () => {
    const result = todoUpdateSchema.safeParse({ title: 'ab' });
    expect(result.success).toBe(false);
  });
});

describe('todoResponseSchema', () => {
  it('accepts valid todo response', () => {
    const result = todoResponseSchema.safeParse({
      _id: '507f1f77bcf86cd799439011',
      title: 'Test Todo',
      description: 'Test description',
      dueDate: '2025-01-15T00:00:00.000Z',
      completed: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('accepts todo response with null dueDate', () => {
    const result = todoResponseSchema.safeParse({
      _id: '507f1f77bcf86cd799439011',
      title: 'Test Todo',
      description: '',
      dueDate: null,
      completed: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects response missing required fields', () => {
    const result = todoResponseSchema.safeParse({
      title: 'Test Todo',
    });
    expect(result.success).toBe(false);
  });
});
