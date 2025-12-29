# Todo App - Fullstack

A modern fullstack Todo application built with React, TypeScript, Node.js, and MongoDB. Features local storage persistence and offline functionality.

## Features

- ✅ Add, edit, and delete todo items
- ✅ Local storage persistence (works offline)
- ✅ MongoDB integration for server-side persistence
- ✅ Real-time sync between local and server storage
- ✅ Form validation (client and server-side)
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Unit tests for backend and frontend

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- Jest + React Testing Library for testing
- Webpack for bundling

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Express Validator for validation
- Jest for testing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

   This command will install dependencies for the root project, backend, and frontend.

3. **Set up environment variables:**

   Create a `.env` file in the `backend` directory (or copy from `.env.example`):

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todoapp
   NODE_ENV=development
   ```

   **Note:** The `.env` file is gitignored. Make sure to create it manually.

4. **Start MongoDB:**

   Make sure MongoDB is running locally, or update the `MONGODB_URI` to point to your MongoDB Atlas cluster.

## Running the Application

### Development Mode (with hot reload)

```bash
npm run dev
```

This will start both the backend server (http://localhost:5000) and frontend dev server (http://localhost:3000) simultaneously.

### Production Mode

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the application:**
   ```bash
   npm run start
   ```

## Available Scripts

### Root Level Scripts
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run test` - Run tests for both frontend and backend
- `npm run test:watch` - Run tests in watch mode

### Backend Scripts (in `backend/` directory)
- `npm run dev` - Start development server with ts-node-dev
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run backend tests

### Frontend Scripts (in `frontend/` directory)
- `npm run dev` - Start webpack dev server
- `npm run build` - Build for production
- `npm run test` - Run frontend tests

## Project Structure

```
todo-app-fullstack/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── index.tsx      # React entry point
│   ├── public/            # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── webpack.config.js
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

### Todos API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

### Todo Schema

```typescript
{
  _id?: string;
  title: string;        // 4-100 characters
  description: string;  // 0-500 characters, optional
  dueDate: string;      // ISO date string
  completed: boolean;   // Default: false
  createdAt?: string;
  updatedAt?: string;
}
```

## Validation Rules

### Frontend Validation
- Title: Required, 4-100 characters
- Description: Optional, max 500 characters
- Due Date: Required, cannot be in the past

### Backend Validation
- Same rules as frontend, enforced server-side
- Additional sanitization and security checks

## Offline Functionality

The app works offline using localStorage:
- Todos are stored locally when offline
- Changes sync with server when connection is restored
- Visual indicator shows online/offline status
- Graceful error handling for network issues

## Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### All Tests
```bash
npm run test
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

ISC License

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Check your `MONGODB_URI` in the `.env` file
- For MongoDB Atlas, whitelist your IP address

### Port Conflicts
- Backend runs on port 5000 by default
- Frontend dev server runs on port 3000
- Change ports in `.env` or webpack config if needed

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `npm run clean` (if available)
- Check Node.js version compatibility

### Test Failures
- Ensure MongoDB is running for backend tests
- Check that all dependencies are installed
- Run tests individually to isolate issues
