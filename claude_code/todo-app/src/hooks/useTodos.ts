'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoResponse, TodoInput } from '@/schemas/todo';

interface TodosResponse {
  data: TodoResponse[];
  count: number;
}

interface CreateTodoResponse {
  data: TodoResponse;
}

async function fetchTodos(): Promise<TodosResponse> {
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

async function createTodo(input: TodoInput): Promise<CreateTodoResponse> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create todo');
  }

  return response.json();
}

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<TodosResponse>(['todos']);

      const optimisticTodo: TodoResponse = {
        _id: `temp-${Date.now()}`,
        title: newTodo.title,
        description: newTodo.description || '',
        dueDate: newTodo.dueDate ? new Date(newTodo.dueDate).toISOString() : null,
        completed: newTodo.completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<TodosResponse>(['todos'], (old) => ({
        data: [optimisticTodo, ...(old?.data || [])],
        count: (old?.count || 0) + 1,
      }));

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

async function toggleTodo(id: string): Promise<{ data: TodoResponse }> {
  const response = await fetch(`/api/todos/${id}/toggle`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to toggle todo');
  }

  return response.json();
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<TodosResponse>(['todos']);

      queryClient.setQueryData<TodosResponse>(['todos'], (old) => ({
        data:
          old?.data.map((todo) =>
            todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
          ) || [],
        count: old?.count || 0,
      }));

      return { previousTodos };
    },
    onError: (_err, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

interface UpdateTodoParams {
  id: string;
  data: Partial<TodoInput>;
}

async function updateTodo({ id, data }: UpdateTodoParams): Promise<{ data: TodoResponse }> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update todo');
  }

  return response.json();
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<TodosResponse>(['todos']);

      queryClient.setQueryData<TodosResponse>(['todos'], (old) => ({
        data:
          old?.data.map((todo) => {
            if (todo._id !== id) return todo;
            return {
              ...todo,
              title: data.title ?? todo.title,
              description: data.description ?? todo.description,
              dueDate: data.dueDate !== undefined ? (data.dueDate ?? null) : todo.dueDate,
              completed: data.completed ?? todo.completed,
              updatedAt: new Date().toISOString(),
            };
          }) || [],
        count: old?.count || 0,
      }));

      return { previousTodos };
    },
    onError: (_err, _params, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

async function deleteTodo(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete todo');
  }

  return response.json();
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<TodosResponse>(['todos']);

      queryClient.setQueryData<TodosResponse>(['todos'], (old) => ({
        data: old?.data.filter((todo) => todo._id !== todoId) || [],
        count: (old?.count || 1) - 1,
      }));

      return { previousTodos };
    },
    onError: (_err, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
