"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todoController_1 = require("../controllers/todoController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// GET /api/todos - Get all todos
router.get('/', todoController_1.getAllTodos);
// GET /api/todos/:id - Get single todo
router.get('/:id', todoController_1.getTodoById);
// POST /api/todos - Create new todo
router.post('/', validation_1.validateCreateTodo, todoController_1.createTodo);
// PUT /api/todos/:id - Update todo
router.put('/:id', validation_1.validateUpdateTodo, todoController_1.updateTodo);
// DELETE /api/todos/:id - Delete todo
router.delete('/:id', todoController_1.deleteTodo);
exports.default = router;
//# sourceMappingURL=todos.js.map