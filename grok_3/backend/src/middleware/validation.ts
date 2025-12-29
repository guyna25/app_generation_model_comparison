import { body } from 'express-validator';

export const validateCreateTodo = [
  body('title')
    .isLength({ min: 4, max: 100 })
    .withMessage('Title must be between 4 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value')
];

export const validateUpdateTodo = [
  body('title')
    .optional()
    .isLength({ min: 4, max: 100 })
    .withMessage('Title must be between 4 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value')
];
