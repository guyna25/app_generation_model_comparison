# Quick Start: Todo List Application

**Feature**: [Todo List Application](../spec.md)

This guide provides instructions to set up and run the project for local development.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A MongoDB database instance. For production, this will be a managed service. For local development, you can use:
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 cluster.
  - A local MongoDB server (e.g., running in [Docker](https://www.docker.com/)).

## 1. Setup

1.  **Clone the repository**:
    ```bash
    # (This step is already done if you are reading this)
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    Navigate to the project root and run:
    ```bash
    npm install
    ```
    *or*
    ```bash
    yarn install
    ```

3.  **Environment Variables**:
    Create a file named `.env.local` in the root of the project. This file will store your environment-specific variables and should not be committed to Git.

    Add the following variables to your `.env.local` file:

    ```env
    # For Production/Staging (connects to a real MongoDB instance)
    MONGODB_URI=<your-mongodb-connection-string>
    DB_NAME=<your-database-name>

    # For Local Development (set NODE_ENV to 'development')
    # The application will use a local JSON file as the database
    # when NODE_ENV is 'development', so MONGODB_URI is not needed for the basic setup.
    ```

## 2. Running the Application

### Development Mode

In development mode, the application will use the local file-based database defined in `research.md`.

1.  **Start the development server**:
    ```bash
    npm run dev
    ```
    *or*
    ```bash
    yarn dev
    ```

2.  **Open the application**:
    Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the Todo List application running. Changes you make to the code will be automatically reloaded.

### Production Mode

To run the application in a production-like environment, you must have the `MONGODB_URI` environment variable set correctly.

1.  **Build the application**:
    ```bash
    npm run build
    ```

2.  **Start the production server**:
    ```bash
    npm run start
    ```

3.  **Open the application**:
    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
