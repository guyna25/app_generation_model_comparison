import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITodo {
  title: string;
  description: string;
  dueDate: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoDocument extends ITodo, Document {}

const todoSchema = new Schema<ITodoDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [4, 'Title must be at least 4 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return v.trim().length >= 4;
        },
        message: 'Title cannot be only whitespace',
      },
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo: Model<ITodoDocument> =
  mongoose.models.Todo || mongoose.model<ITodoDocument>('Todo', todoSchema);

export default Todo;
