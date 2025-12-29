import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoDocument extends ITodo, Document {}

const TodoSchema = new Schema<ITodoDocument>({
  title: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
    trim: true
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
    default: '',
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Todo = mongoose.model<ITodoDocument>('Todo', TodoSchema);
