import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '@/components/TodoForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('TodoForm', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders form with all fields', () => {
    render(<TodoForm />, { wrapper });

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    render(<TodoForm />, { wrapper });

    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 4 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for title too short', async () => {
    const user = userEvent.setup();
    render(<TodoForm />, { wrapper });

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'ab');

    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 4 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for title too long', async () => {
    render(<TodoForm />, { wrapper });

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(101) } });

    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title cannot exceed 100 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for description too long', async () => {
    render(<TodoForm />, { wrapper });

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(501) } });

    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/description cannot exceed 500 characters/i)).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          _id: '123',
          title: 'Test Todo',
          description: '',
          dueDate: null,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    });

    const user = userEvent.setup();
    render(<TodoForm />, { wrapper });

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test Todo');

    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });
});
