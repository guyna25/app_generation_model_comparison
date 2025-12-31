import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    todo.completed = !todo.completed;
    await todo.save();

    return NextResponse.json({ data: todo }, { status: 200 });
  } catch (error) {
    console.error('Error toggling todo:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
