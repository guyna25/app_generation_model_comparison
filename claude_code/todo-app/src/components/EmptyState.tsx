'use client';

export default function EmptyState() {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-4 text-6xl">📝</div>
      <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
        No todos yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Create your first todo to get started!
      </p>
    </div>
  );
}
