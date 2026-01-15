# 🧩 Kanban Workspace (Nx + Angular)

A Kanban workspace built with Nx monorepo, showcasing two Angular applications that share common components, services, and models, while using different state management approaches.

## 📦 Project Structure

### Applications

- **kanban-signal** – Angular app using Angular Signals for state management
- **kanban-ngxs** – Angular app using NGXS for state management

### Shared Library

`libs/shared`

- **Components**: KanbanBoard, KanbanColumn, KanbanCard
- **Services**: KanbanDataService
- **Models**: KanbanBoard, KanbanColumn, KanbanCard

All UI components are standalone, reusable, and independent of the state solution.

## 🚀 Running the Apps

```sh
npm install

npx nx serve kanban-signal

npx nx serve kanban-ngxs
```

Run both apps simultaneously:

```sh
npx nx serve kanban-signal --port=4200
npx nx serve kanban-ngxs --port=4201
```

## 📋 Features

- Kanban board with columns (To Do, In Progress, Done)
- Task cards with title, description, assignee, and priority
- Add and delete cards
- Visual priority indicators (high / medium / low)

## 🧠 State Management Comparison

### kanban-signal

- Angular Signals (signal, computed, effect)
- Service-based store (KanbanSignalStore)
- Imperative API
- Automatic reactivity

### kanban-ngxs

- NGXS store with actions, state, and selectors
- RxJS observable-based API
- Redux DevTools integration (dev mode)
- Type-safe state management

## 🧪 Tooling & Quality

- Unit tests with Jest
- E2E tests with Playwright
- ESLint for linting
- Rspack / esbuild for fast builds
- OnPush change detection

## 🛠 Tech Stack

- Angular 20
- Nx Monorepo
- TypeScript
- Angular Signals
- NGXS
- Jest & Playwright

## 🎯 Key Idea

Both applications share the same UI layer and business models.
The only difference is the state management approach, making this project a clear comparison between Signals-based and Redux-style state handling in Angular.
