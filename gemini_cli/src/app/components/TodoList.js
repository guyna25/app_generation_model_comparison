import TodoItem from '@/app/components/TodoItem';

export default function TodoList({ todos, onUpdate, onDelete }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center p-8 border-dashed border-2 border-gray-300 rounded-lg">
        <p className="text-gray-500">Your todo list is empty.</p>
        <p className="text-gray-400 text-sm">Add a new task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
