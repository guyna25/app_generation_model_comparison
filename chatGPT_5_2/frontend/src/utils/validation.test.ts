import { describe, expect, it } from 'vitest';
import { validateDescription, validateTitle } from './validation';

describe('validation utils', () => {
  it('accepts valid title lengths', () => {
    expect(validateTitle('Plan the sprint')).toBe(true);
  });

  it('rejects short titles', () => {
    expect(validateTitle('abc')).toBe(false);
  });

  it('rejects overly long titles', () => {
    expect(validateTitle('a'.repeat(120))).toBe(false);
  });

  it('rejects descriptions that are too long', () => {
    expect(validateDescription('a'.repeat(501))).toBe(false);
  });

  it('accepts empty descriptions', () => {
    expect(validateDescription('')).toBe(true);
  });
});

