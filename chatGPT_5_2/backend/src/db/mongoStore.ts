import mongoose, { Document, LeanDocument, Schema } from 'mongoose';
import { Todo, TodoCreation } from '../models/todo';
import { TodoRepository } from '../services/todoService';

interface TodoDocument extends Document {
  name: string;
  description: string;
  dueDate: string;
  done: boolean;
}

const todoSchema = new Schema<TodoDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const TodoModel = mongoose.models.Todo ?? mongoose.model<TodoDocument>('Todo', todoSchema);

const toTodo = (doc: TodoDocument | LeanDocument<TodoDocument>): Todo => ({
  id: doc._id.toString(),
  name: doc.name,
  description: doc.description,
  dueDate: doc.dueDate,
  done: doc.done
});

export class MongoTodoStore implements TodoRepository {
  private connected = false;

  constructor(private uri: string) {}

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }
    await mongoose.connect(this.uri);
    this.connected = true;
  }

  async list(): Promise<Todo[]> {
    const docs = await TodoModel.find().lean();
    return docs.map((doc) => toTodo(doc as TodoDocument));
  }

  async find(id: string): Promise<Todo | null> {
    const doc = await TodoModel.findById(id).lean();
    return doc ? toTodo(doc as TodoDocument) : null;
  }

  async create(payload: TodoCreation): Promise<Todo> {
    const doc = await TodoModel.create({
      name: payload.name,
      description: payload.description ?? '',
      dueDate: payload.dueDate,
      done: payload.done ?? false
    });
    return toTodo(doc);
  }

  async update(id: string, payload: Partial<TodoCreation>): Promise<Todo | null> {
    const doc = await TodoModel.findByIdAndUpdate(id, payload, { new: true });
    return doc ? toTodo(doc) : null;
  }

  async remove(id: string): Promise<boolean> {
    const doc = await TodoModel.findByIdAndDelete(id);
    return doc !== null;
  }
}

