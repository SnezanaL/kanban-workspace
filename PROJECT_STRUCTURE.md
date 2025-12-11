# 📁 Pregled Ključnih Fajlova

## Shared Biblioteka (`libs/shared/`)

### Modeli
- `src/lib/models/kanban.models.ts` - TypeScript interfejsi za Board, Column, Card

### Servisi
- `src/lib/services/kanban-data.service.ts` - Mock data servis (može se proširiti sa HTTP pozivima)

### Komponente
- `src/lib/components/kanban-board/kanban-board.component.ts` - Glavni board container
- `src/lib/components/kanban-column/kanban-column.component.ts` - Kolona sa karticama
- `src/lib/components/kanban-card/kanban-card.component.ts` - Pojedinačna kartica

### Export
- `src/index.ts` - Exportuje sve javne API-je biblioteke

---

## Kanban Signal App (`apps/kanban-signal/`)

### State Management
- `src/app/store/kanban-signal.store.ts` - Signal-based store sa reactivity

### Glavna Komponenta
- `src/app/app.ts` - Root komponenta koja koristi Signal store
- `src/app/app.html` - Template sa conditional rendering
- `src/app/app.css` - Stilovi

### Config
- `src/app/app.config.ts` - Aplikaciona konfiguracija (routing, providers)

---

## Kanban NGXS App (`apps/kanban-ngxs/`)

### State Management
- `src/app/store/kanban.actions.ts` - NGXS Actions (SetBoard, AddCard, DeleteCard, MoveCard)
- `src/app/store/kanban.state.model.ts` - State model interface
- `src/app/store/kanban.state.ts` - NGXS State sa @Action i @Selector decorators

### Glavna Komponenta
- `src/app/app.ts` - Root komponenta koja dispatuje actions i selectuje state
- `src/app/app.html` - Template sa async pipe
- `src/app/app.css` - Stilovi

### Config
- `src/app/app.config.ts` - Aplikaciona konfiguracija sa NGXS provideStore

---

## Kako Sve Funkcioniše Zajedno

### Shared Biblioteka
```
libs/shared/
  ├── models/           → TypeScript tipovi
  ├── services/         → Data servisi
  ├── components/       → UI komponente
  └── index.ts          → Public API
```

### Kanban Signal (Signals pristup)
```typescript
// Store koristi signals
boardSignal = signal<KanbanBoard | null>(null);
board = this.boardSignal.asReadonly();

// U komponenti
constructor(public store: KanbanSignalStore) {}
```

### Kanban NGXS (Redux pristup)
```typescript
// Actions
this.store.dispatch(new SetBoard(board));

// Selectors
@Select(KanbanState.board) board$!: Observable<KanbanBoard | null>;

// U template-u
(board$ | async)
```

---

## Pokretanje

### Option 1: Jedna aplikacija
```powershell
npx nx serve kanban-signal   # Port 4200
# ili
npx nx serve kanban-ngxs     # Port 4200
```

### Option 2: Obe istovremeno
```powershell
# Terminal 1
npx nx serve kanban-signal --port=4200

# Terminal 2
npx nx serve kanban-ngxs --port=4201
```

---

## Dodavanje Nove Funkcionalnosti

### U Shared Biblioteku
1. Dodaj u `libs/shared/src/lib/`
2. Exportuj u `libs/shared/src/index.ts`
3. Obe aplikacije automatski dobijaju pristup

### U Signal App
1. Dodaj u `kanban-signal.store.ts` novu metodu
2. Pozovi je iz `app.ts`

### U NGXS App
1. Dodaj novu akciju u `kanban.actions.ts`
2. Dodaj handler u `kanban.state.ts` sa `@Action` decorator
3. Dispatch-uj iz `app.ts`

---

## Testiranje

```powershell
# Test pojedinačne aplikacije
npx nx test kanban-signal
npx nx test kanban-ngxs

# Test shared biblioteke
npx nx test shared

# Test sve
npx nx run-many --target=test --all
```

---

## Nx Dependency Graph

```powershell
npx nx graph
```

Prikazuje:
- `kanban-signal` → zavisi od → `shared`
- `kanban-ngxs` → zavisi od → `shared`
- `shared` → samostalna biblioteka

---

## Import Path Aliasi

Definisani u `tsconfig.base.json`:

```json
{
  "paths": {
    "@kanban-workspace/shared": ["libs/shared/src/index.ts"]
  }
}
```

Koristi se u aplikacijama:
```typescript
import { KanbanBoard, KanbanDataService } from '@kanban-workspace/shared';
```
