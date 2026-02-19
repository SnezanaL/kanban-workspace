# Kanban Board Angular Portfolio Project

A full-featured Kanban board application built as a portfolio project to demonstrate modern Angular architecture, state management patterns, and UI engineering skills. The workspace contains **two fully functional apps** that share the same UI library but use completely different state management approaches making the comparison explicit and educational.

---

## Design Challenge

UI/UX design is based on the **[Kanban Task Management Web App](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB)** challenge from [Frontend Mentor](https://www.frontendmentor.io).

The design files (Figma) were used as the reference for layout, spacing, typography, color palette, dark/light mode, and component behavior. The implementation follows the design as closely as possible while extending it with additional engineering decisions (Nx monorepo, two state management approaches, animated sidebar, custom Angular dropdowns).

---

## Live Demo

| App             | State Management   | Port |
| --------------- | ------------------ | ---- |
| `kanban-signal` | Angular Signals    | 4200 |
| `kanban-ngxs`   | NGXS (Redux-style) | 4201 |

---

## What Was Built

### Full Kanban Board UX

- **Multiple boards** create, rename, delete, switch between boards
- **Columns** dynamic columns per board, add new columns
- **Task cards** create, edit, delete tasks with title, description, subtasks, status, assignee and priority
- **Subtask tracking** checklist with progress bar per card
- **Move tasks between columns** inline status dropdown on every card with smooth UX
- **Per-column vertical scroll** each column scrolls independently; board scrolls horizontally when columns overflow

### UI & Design

- Pixel-accurate implementation of the [Frontend Mentor Kanban board challenge](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB) design
- **Dark / Light mode** toggle with `localStorage` persistence
- **Collapsible sidebar** animated slide in/out with smooth CSS `width` transition, state persisted to `localStorage`
- **Custom status dropdown** fully custom Angular dropdown (no native `<select>`) with per-column color coding
- **Custom scrollbar styling** themed scrollbar colors for light and dark mode (Firefox + WebKit)
- **SVG icons with `fill="currentColor"`** icons respond to hover and active state color changes via CSS
- Horizontal board scroll when columns exceed the viewport width
- `OnPush` change detection throughout for optimal performance

### Architecture

- **Nx monorepo** two apps share one shared library (`libs/shared`)
- **Shared library** exports all UI components, models, and services zero code duplication between apps
- **Standalone Angular components** throughout no NgModules
- **REST backend** JSON Server with full CRUD; data persisted to `db.json`
- **`KanbanApiService`** pure HTTP service (no state) shared by both apps; all board/column/task mutation helpers live in one place
- **`KanbanBackendService`** `rxResource`-powered reactive data layer for the Signals app

---

## State Management Comparison

This is the core of the project the same UI, two completely different state solutions.

### `kanban-signal` Angular Signals

```
App Component
   KanbanSignalStore  (service-based store)
         KanbanBackendService  (rxResource + computed signals)
               KanbanApiService  (pure HTTP)
```

- `rxResource()` for reactive HTTP automatic loading/error states, re-fetches on param change
- `computed()` signals derived from server data no manual subscriptions
- Clean imperative store API: `selectBoard()`, `createBoard()`, `addTask()`, etc.
- No boilerplate state updates are transparent and co-located

### `kanban-ngxs` NGXS (Redux pattern)

```
App Component
   Store.dispatch(Action)
         KanbanState  (@State + @Action handlers)
               KanbanApiService  (pure HTTP)
```

- Strict **action handler selector** flow
- NGXS v20 constraint handled: `ctx.patchState()` is only allowed synchronously async results are dispatched via private inner action classes (`_SetBoards`, `_SetBoard`) to stay compliant with the framework enforcement
- **Redux DevTools** integration in dev mode
- `store.selectSignal()` used in components signals-compatible API even with NGXS
- Type-safe selectors with `@Selector()` decorators

---

## Project Structure

```
kanban-workspace/
 apps/
    kanban-signal/            Angular app  Signals state
       src/app/
           store/
               kanban-signal.store.ts
    kanban-ngxs/              Angular app  NGXS state
        src/app/
            store/
                kanban.actions.ts
                kanban.state.ts
                kanban.state.model.ts
 libs/
    shared/                   Shared library (used by both apps)
        src/lib/
            components/
               kanban-board/
               kanban-card/
               kanban-column/
               kanban-sidebar/
               kanban-header/
               kanban-task-modal/
               kanban-board-modal/
               kanban-confirm-dialog/
            services/
               kanban-api.service.ts       Pure HTTP layer
               kanban-backend.service.ts   Signals + rxResource
            models/
               kanban.models.ts
            styles/
                kanban-theme.css            Global design tokens
 backend/
     db.json                   Persisted JSON data
     server.js                 JSON Server
```

---

## Tech Stack

| Technology          | Role                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Angular 20**      | Framework standalone components, signals, `viewChild.required()`, `input.required()` |
| **TypeScript**      | Strict mode throughout                                                               |
| **NGXS 20**         | Redux-style state management                                                         |
| **Angular Signals** | Fine-grained reactive state (`signal`, `computed`, `rxResource`)                     |
| **RxJS**            | Async orchestration, HTTP chains                                                     |
| **TailwindCSS**     | Utility-first styling, dark mode via `class` strategy                                |
| **Nx Monorepo**     | Workspace manager, project graph, build caching                                      |
| **Rspack**          | Fast bundler (replaces Webpack)                                                      |
| **JSON Server**     | REST API backend with file-based persistence                                         |
| **Jest**            | Unit tests                                                                           |
| **Playwright**      | End-to-end tests                                                                     |
| **ESLint**          | Linting with shared base config across apps                                          |

---

## Running the Project

### 1. Install dependencies

```sh
npm install
```

### 2. Start the backend

```sh
cd backend
node server.js
# REST API running on http://localhost:3001
```

### 3. Serve an app

```sh
# Signals app (port 4200)
npx nx serve kanban-signal

# NGXS app (port 4201)
npx nx serve kanban-ngxs
```

### 4. Run tests

```sh
npx nx test kanban-signal
npx nx test kanban-ngxs
npx nx e2e kanban-signal-e2e
npx nx e2e kanban-ngxs-e2e
```

---

## Key Engineering Decisions

**Why two apps sharing one UI library?**
To prove that the UI layer is truly decoupled from state management. Both apps render identically only the data flow differs. This is a realistic pattern for migrating a large codebase from one state solution to another without touching the UI.

**Why `KanbanApiService` as a separate layer?**
To avoid duplicating HTTP logic between the Signals backend service and the NGXS state class. Both consume the same pure HTTP service any endpoint or data-shape change is made once.

**Why the NGXS inner action pattern (`_SetBoards`, `_SetBoard`)?**
NGXS v20 enforces at the TypeScript level that `ctx.patchState(val)` can only be called in a synchronous `@Action` handler body not inside RxJS `tap`/`switchMap` callbacks. Private inner action classes dispatched via `ctx.dispatch()` allow async chains to trigger synchronous state mutations correctly, without fighting the framework.

**Why `host: { style: 'display:block; height:100%' }` on the board component?**
Angular custom elements are `display:inline` by default. Without an explicit host block context, `h-full` inside the template has no containing block to measure against breaking both horizontal and vertical scroll. Declaring it at the component level is more reliable than relying on every parent template to add the correct classes.
