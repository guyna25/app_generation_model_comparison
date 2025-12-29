import mongoose, { Document } from 'mongoose';
export interface ITodo {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITodoDocument extends ITodo, Document {
}
export declare const Todo: mongoose.Model<ITodoDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITodoDocument> & ITodoDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Todo.d.ts.map