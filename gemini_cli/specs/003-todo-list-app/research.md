# Research: Local Database for Todo List App

**Date**: 2026-01-01
**Feature**: [Todo List Application](../spec.md)

## 1. Requirement

The plan requires a "localDB" for development purposes to complement the use of MongoDB in production. This local database should be lightweight and easy to set up for a developer running the Next.js application on their machine.

## 2. Research & Analysis

Several options were considered for the local database.

### Option A: Simple JSON File
- **Description**: A single `.json` file in the project's temporary or data directory that acts as the database. A simple data access layer (e.g., a couple of functions in a `db.js` file) would handle reading from and writing to this file.
- **Pros**:
    - Zero external dependencies.
    - No setup required; it works out of the box.
    - Very easy to inspect the data by just opening the file.
- **Cons**:
    - Not suitable for concurrent writes (not an issue for single-user local development).
    - Performance can degrade with a very large amount of data (not expected for this project's scope).

### Option B: SQLite
- **Description**: A file-based SQL database engine.
- **Pros**:
    - Robust and well-tested.
    - Supports full SQL capabilities.
- **Cons**:
    - Requires a native dependency (`sqlite3`), which can sometimes complicate setup across different operating systems.
    - Introduces a different database paradigm (SQL) than the production database (NoSQL - MongoDB), which could lead to inconsistencies in queries or data models.

### Option C: Local MongoDB Instance (e.g., via Docker)
- **Description**: Running a full MongoDB instance locally.
- **Pros**:
    - Perfect parity with the production environment.
- **Cons**:
    - Higher resource usage.
    - Requires Docker to be installed and running, increasing setup complexity for a quick start.

## 3. Decision & Rationale

**Decision**: **Option A: Simple JSON File**

**Rationale**:
For the stated goal of a lightweight, easy-to-use local development database, a simple JSON file is the most pragmatic choice. It aligns with the "start simple" and YAGNI (You Ain't Gonna Need It) principles. The overhead of setting up SQLite or a local MongoDB instance is not justified for the current scale and scope of the todo list application. Using a JSON file ensures that a developer can clone the repository, install dependencies, and run the application with zero database configuration. The data access layer will be designed to be easily swappable with the MongoDB connection for production builds.
