import mongoose, { Schema } from 'mongoose';
const TodoSchema = new Schema({
    clientId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    done: { type: Boolean, default: false },
});
// Avoid recompiling model if hot-reloading
const TodoModel = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
export class MongoStore {
    async init() {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
            console.log('Connected to MongoDB at', uri);
        }
    }
    map(doc) {
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            dueDate: doc.dueDate,
            done: doc.done,
        };
    }
    async getAll(clientId) {
        const docs = await TodoModel.find({ clientId });
        return docs.map(this.map);
    }
    async create(clientId, todo) {
        const doc = await TodoModel.create({ ...todo, clientId });
        return this.map(doc);
    }
    async update(clientId, id, todo) {
        const doc = await TodoModel.findOneAndUpdate({ _id: id, clientId }, { $set: todo }, { new: true });
        return doc ? this.map(doc) : null;
    }
    async delete(clientId, id) {
        const result = await TodoModel.deleteOne({ _id: id, clientId });
        return result.deletedCount === 1;
    }
}
//# sourceMappingURL=mongo.js.map