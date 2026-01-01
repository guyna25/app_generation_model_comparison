import { NextResponse } from 'next/server';
import { readTodos, writeTodos } from '@/lib/file-db';

// GET a single todo item
export async function GET(request, { params }) {
  try {
    const todos = await readTodos();
    const todo = todos.find((t) => t._id === params.id);

    if (!todo) {
      return NextResponse.json({ success: false, message: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// UPDATE a todo item
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const todos = await readTodos();
    const todoIndex = todos.findIndex((t) => t._id === params.id);

    if (todoIndex === -1) {
      return NextResponse.json({ success: false, message: 'Todo not found' }, { status: 404 });
    }

    const updatedTodo = { ...todos[todoIndex], ...body };
    todos[todoIndex] = updatedTodo;

    await writeTodos(todos);

    return NextResponse.json({ success: true, data: updatedTodo });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE a todo item
export async function DELETE(request, { params }) {
    try {
        const todos = await readTodos();
        const filteredTodos = todos.filter((t) => t._id !== params.id);

        if (todos.length === filteredTodos.length) {
            return NextResponse.json({ success: false, message: 'Todo not found' }, { status: 404 });
        }

        await writeTodos(filteredTodos);

        return new NextResponse(null, { status: 204 }); // 204 No Content for successful deletion
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
