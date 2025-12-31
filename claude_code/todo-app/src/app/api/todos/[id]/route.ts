import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { todoUpdateSchema } from '@/schemas/todo';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'INVALID_ID', message: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: todo }, { status: 200 });
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'INVALID_ID', message: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = todoUpdateSchema.safeParse(body);

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

    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Todo not found' },
        { status: 404 }
      );
    }

    Object.assign(todo, validation.data);
    await todo.save();

    return NextResponse.json({ data: todo }, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'INVALID_ID', message: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
