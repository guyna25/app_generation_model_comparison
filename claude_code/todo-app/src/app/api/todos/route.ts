import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { todoInputSchema } from '@/schemas/todo';

export async function GET() {
  try {
    await dbConnect();

    const todos = await Todo.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        data: todos,
        count: todos.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const validation = todoInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const todo = await Todo.create(validation.data);

    return NextResponse.json(
      {
        data: todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
