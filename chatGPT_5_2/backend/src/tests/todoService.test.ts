import {
  ValidationError,
  validateTodoCreation,
  validateTodoUpdate
} from '../services/todoService';

describe('todo validation', () => {
  it('accepts valid creation payload', () => {
    expect(() =>
      validateTodoCreation({
        name: 'Write code',
        dueDate: new Date().toISOString(),
        description: 'Sample task'
      })
    ).not.toThrow();
  });

  it('rejects short names', () => {
    expect(() =>
      validateTodoCreation({
        name: 'abc',
        dueDate: new Date().toISOString()
      })
    ).toThrow(ValidationError);
  });

  it('rejects invalid due dates', () => {
    expect(() =>
      validateTodoCreation({
        name: 'Valid name',
        dueDate: 'not-a-date'
      })
    ).toThrow(ValidationError);
  });

  it('rejects updates with invalid description length', () => {
    expect(() =>
      validateTodoUpdate({
        description: 'a'.repeat(501)
      })
    ).toThrow(ValidationError);
  });

  it('allows partial updates with valid data', () => {
    expect(() =>
      validateTodoUpdate({
        name: 'Updated name'
      })
    ).not.toThrow();
  });
});

