"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodoById = exports.getAllTodos = void 0;
const express_validator_1 = require("express-validator");
const Todo_1 = require("../models/Todo");
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo_1.Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllTodos = getAllTodos;
const getTodoById = async (req, res) => {
    try {
        const todo = await Todo_1.Todo.findById(req.params.id);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        res.json(todo);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getTodoById = getTodoById;
const createTodo = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { title, description, dueDate, completed } = req.body;
        const todo = new Todo_1.Todo({
            title,
            description,
            dueDate: new Date(dueDate),
            completed: completed || false
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createTodo = createTodo;
const updateTodo = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { title, description, dueDate, completed } = req.body;
        const todo = await Todo_1.Todo.findById(req.params.id);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        todo.title = title || todo.title;
        todo.description = description !== undefined ? description : todo.description;
        todo.dueDate = dueDate ? new Date(dueDate) : todo.dueDate;
        todo.completed = completed !== undefined ? completed : todo.completed;
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo_1.Todo.findById(req.params.id);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        await Todo_1.Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteTodo = deleteTodo;
//# sourceMappingURL=todoController.js.map