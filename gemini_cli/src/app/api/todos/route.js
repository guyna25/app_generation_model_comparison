import { NextResponse } from 'next/server';
import { readTodos, writeTodos } from '@/lib/file-db';

export async function GET() {
  try {
    const todos = await readTodos();
    return NextResponse.json({ success: true, data: todos });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const todos = await readTodos();
    
    const newTodo = {
      _id: Date.now().toString(),
      ...body,
      isDone: false,
      createdAt: new Date().toISOString(),
      dueDate: new Date(body.dueDate).toISOString()
    };

    todos.unshift(newTodo); // Add to the beginning of the array
    await writeTodos(todos);

    return NextResponse.json({ success: true, data: newTodo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
