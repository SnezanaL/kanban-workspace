# 📁 Key Files Overview

## Shared Library (`libs/shared/`)

### Models

- `src/lib/models/kanban.models.ts` - TypeScript interfaces for Board, Column, Card

### Services

- `src/lib/services/kanban-data.service.ts` - Mock data service (can be extended with HTTP calls)

### Components

- `src/lib/components/kanban-board/kanban-board.component.ts` - Main board container
- `src/lib/components/kanban-column/kanban-column.component.ts` - Column with cards
- `src/lib/components/kanban-card/kanban-card.component.ts` - Individual card

### Export

- `src/index.ts` - Exports all public library APIs

---

## Kanban Signal App (`apps/kanban-signal/`)

### State Management

- `src/app/store/kanban-signal.store.ts` - Signal-based store with reactivity

### Main Component

- `src/app/app.ts` - Root component that uses Signal store
- `src/app/app.html` - Template with conditional rendering
- `src/app/app.css` - Styles

### Config

- `src/app/app.config.ts` - Application configuration (routing, providers)

---

## Kanban NGXS App (`apps/kanban-ngxs/`)

### State Management

- `src/app/store/kanban.actions.ts` - NGXS Actions (SetBoard, AddCard, DeleteCard, MoveCard)
- `src/app/store/kanban.state.model.ts` - State model interface
- `src/app/store/kanban.state.ts` - NGXS State with @Action and @Selector decorators

### Main Component

- `src/app/app.ts` - Root component that dispatches actions and selects state
- `src/app/app.html` - Template with async pipe
- `src/app/app.css` - Styles

### Config

- `src/app/app.config.ts` - Application configuration with NGXS provideStore

---

## How Everything Works Together

### Shared Library

```
libs/shared/
  ├── models/           → TypeScript types
  ├── services/         → Data services
  ├── components/       → UI components
  └── index.ts          → Public API
```

### Kanban Signal (Signals approach)

```typescript
// Store uses signals
boardSignal = signal<KanbanBoard | null>(null);
board = this.boardSignal.asReadonly();

// In component
constructor(public store: KanbanSignalStore) {}
```

### Kanban NGXS (Redux approach)

```typescript
// Actions
this.store.dispatch(new SetBoard(board));

// Selectors
@Select(KanbanState.board) board$!: Observable<KanbanBoard | null>;

// In template
(board$ | async)
```

---

## Running

### Option 1: Single application

```powershell
npx nx serve kanban-signal   # Port 4200
# or
npx nx serve kanban-ngxs     # Port 4200
```

### Option 2: Both simultaneously

```powershell
# Terminal 1
npx nx serve kanban-signal --port=4200

# Terminal 2
npx nx serve kanban-ngxs --port=4201
```

---

## Adding New Features

### To Shared Library

1. Add to `libs/shared/src/lib/`
2. Export in `libs/shared/src/index.ts`
3. Both applications automatically get access

### To Signal App

1. Add new method to `kanban-signal.store.ts`
2. Call it from `app.ts`

### To NGXS App

1. Add new action to `kanban.actions.ts`
2. Add handler to `kanban.state.ts` with `@Action` decorator
3. Dispatch from `app.ts`

---

## Testing

```powershell
# Test individual application
npx nx test kanban-signal
npx nx test kanban-ngxs

# Test shared library
npx nx test shared

# Test all
npx nx run-many --target=test --all
```

---

## Nx Dependency Graph

```powershell
npx nx graph
```

Shows:

- `kanban-signal` → depends on → `shared`
- `kanban-ngxs` → depends on → `shared`
- `shared` → standalone library

---

## Import Path Aliases

Defined in `tsconfig.base.json`:

```json
{
  "paths": {
    "@kanban-workspace/shared": ["libs/shared/src/index.ts"]
  }
}
```

Used in applications:

```typescript
import { KanbanBoard, KanbanDataService } from '@kanban-workspace/shared';
```
