"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateTodo = exports.validateCreateTodo = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateTodo = [
    (0, express_validator_1.body)('title')
        .isLength({ min: 4, max: 100 })
        .withMessage('Title must be between 4 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
        .trim(),
    (0, express_validator_1.body)('dueDate')
        .isISO8601()
        .withMessage('Due date must be a valid date')
        .custom((value) => {
        if (new Date(value) < new Date()) {
            throw new Error('Due date cannot be in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean value')
];
exports.validateUpdateTodo = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 4, max: 100 })
        .withMessage('Title must be between 4 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
        .trim(),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date')
        .custom((value) => {
        if (value && new Date(value) < new Date()) {
            throw new Error('Due date cannot be in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean value')
];
//# sourceMappingURL=validation.js.map