# Tasks: Todo List Application

**Input**: Design documents from `/specs/003-todo-list-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel
- **[Story]**: Maps to user stories (US1, US2, etc.)

---

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Initialize the Next.js project and configure base styles.

- [x] T001 Initialize a new Next.js application in the current directory using `npx create-next-app@latest . --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [x] T002 [P] Install Mongoose for MongoDB interactions: `npm install mongoose`
- [x] T003 [P] Clean up boilerplate: remove default content from `src/app/page.js` and `src/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Create the core data model and database service that all features will depend on.

- [x] T004 Implement the TodoItem Mongoose schema in `src/lib/models/TodoItem.js` as defined in `data-model.md`.
- [x] T005 Implement the database connection service in `src/lib/db.js`. This service should handle connecting to MongoDB.

---

## Phase 3: User Story 1 - Create a new task (Priority: P1) 🎯 MVP
**Goal**: Allow a user to add a new task to their list.
**Independent Test**: A user can open the application, fill out a form, and see their new task appear on the screen.

### Implementation for User Story 1
- [x] T006 [US1] Create a basic form component in a new file `src/app/components/AddTodoForm.js` for inputting a new task's title, description, and due date.
- [x] T007 [US1] Implement the `POST /api/todos` endpoint in `src/app/api/todos/route.js` to create a new todo item in the database, using the model from T004.
- [x] T008 [US1] Integrate the AddTodoForm with the main page at `src/app/page.js` and connect its submission to the POST API endpoint.

---

## Phase 4: User Story 2 - View the task list (Priority: P1)
**Goal**: Allow a user to see all their existing tasks.
**Independent Test**: Upon loading the application, any tasks in the database are fetched and displayed to the user.

### Implementation for User Story 2
- [x] T009 [US2] Implement the `GET /api/todos` endpoint in `src/app/api/todos/route.js` to fetch all todo items from the database.
- [x] T010 [US2] Create a `TodoList.js` component in `src/app/components/` to display a list of tasks.
- [x] T011 [US2] Create a `TodoItem.js` component in `src/app/components/` for displaying a single task with its details (title, description, due date, done checkmark).
- [x] T012 [US2] Update the main page at `src/app/page.js` to fetch data from the GET API endpoint on load and render the `TodoList.js` component.

---

## Phase 5: User Story 3 - Mark a task as complete (Priority: P2)
**Goal**: Allow a user to toggle the completion status of a task.
**Independent Test**: A user can click a checkbox on a task, and its appearance updates to reflect its 'done' status. This state persists on reload.

### Implementation for User Story 3
- [x] T013 [US3] Implement the `PUT /api/todos/{id}` logic in a new file `src/app/api/todos/[id]/route.js` to handle updating a task's `isDone` status.
- [x] T014 [US3] Add a checkbox and an event handler to the `TodoItem.js` component to call the PUT endpoint when the completion status is changed.

---

## Phase 6: User Story 4 - Edit an existing task (Priority: P2)
**Goal**: Allow a user to modify the details of a task.
**Independent Test**: A user can click an "edit" button, change a task's title in a form, save it, and see the updated title in the list.

### Implementation for User Story 4
- [x] T015 [US4] Add an "Edit" button to the `TodoItem.js` component.
- [x] T016 [US4] Create an `EditTodoForm.js` component in `src/app/components/` that is pre-populated with a task's data and allows editing.
- [x] T017 [US4] Update the `PUT /api/todos/{id}` endpoint in `src/app/api/todos/[id]/route.js` to handle updates for title, description, and due date.
- [x] T018 [US4] Implement UI logic to show/hide the edit form and handle the update submission.

---

## Phase 7: User Story 5 - Delete a task (Priority: P3)
**Goal**: Allow a user to permanently remove a task.
**Independent Test**: A user can click a "delete" button, confirm the action, and the task is removed from the list permanently.

### Implementation for User Story 5
- [x] T019 [US5] Implement the `DELETE /api/todos/{id}` endpoint in `src/app/api/todos/[id]/route.js`.
- [x] T020 [US5] Add a "Delete" button to the `TodoItem.js` component.
- [x] T021 [US5] Implement a confirmation dialog (`window.confirm`) before calling the DELETE endpoint, as per the spec clarification.

---

## Phase 8: Polish & Cross-Cutting Concerns
**Purpose**: Final improvements for user experience and robustness.

- [x] T022 [P] Implement a clean UI for the empty state (when no tasks exist) in `src/app/page.js`, as discussed during clarification.
- [x] T023 [P] Add loading indicators (e.g., spinners) that display while data is being fetched or submitted.
- [x] T024 [P] Implement user-facing error messages for API failures (e.g., "Failed to add task. Please try again.").
- [x] T025 [P] Apply basic styling to all components using Tailwind CSS to ensure the application is visually organized and user-friendly.

---

## Dependencies & Execution Order

- **Phase 1 & 2**: Must be completed before any User Story phases.
- **User Stories (Phases 3-7)**: Can be implemented sequentially as ordered. US1 and US2 are the highest priority for a functional MVP.
- **Phase 8**: Can be worked on after the core functionality is in place.

## Implementation Strategy
The recommended approach is to deliver the MVP first by completing Phases 1, 2, 3, and 4. This will result in a functional application where users can add and view tasks. Subsequent user stories (Phases 5, 6, 7) can be added incrementally.
