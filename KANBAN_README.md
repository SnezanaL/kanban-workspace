# Kanban Workspace

Nx monorepo sa dve Angular aplikacije koje dele zajedničke komponente, servise i modele.

## 📦 Struktura Projekta

### Aplikacije

- **kanban-signal** - Angular aplikacija koja koristi Signals za state management
- **kanban-ngxs** - Angular aplikacija koja koristi NGXS za state management

### Shared Biblioteka

- **libs/shared** - Zajednička biblioteka koja sadrži:
  - **Komponente**: `KanbanBoardComponent`, `KanbanColumnComponent`, `KanbanCardComponent`
  - **Servisi**: `KanbanDataService`
  - **Modeli**: `KanbanBoard`, `KanbanColumn`, `KanbanCard`

## 🚀 Pokretanje Aplikacija

### Instalacija dependencija (ako je potrebno)

```powershell
npm install
```

### Pokretanje kanban-signal aplikacije

```powershell
npx nx serve kanban-signal
```

Aplikacija će biti dostupna na: `http://localhost:4200`

### Pokretanje kanban-ngxs aplikacije

```powershell
npx nx serve kanban-ngxs
```

Aplikacija će biti dostupna na: `http://localhost:4200`

### Pokretanje obe aplikacije istovremeno (različiti portovi)

```powershell
# Terminal 1
npx nx serve kanban-signal --port=4200

# Terminal 2 (novi terminal)
npx nx serve kanban-ngxs --port=4201
```

## 🏗️ Build Aplikacija

### Build kanban-signal

```powershell
npx nx build kanban-signal
```

### Build kanban-ngxs

```powershell
npx nx build kanban-ngxs
```

### Build sve aplikacije

```powershell
npx nx run-many --target=build --all
```

## 🧪 Testiranje

### Test kanban-signal

```powershell
npx nx test kanban-signal
```

### Test kanban-ngxs

```powershell
npx nx test kanban-ngxs
```

### Test shared biblioteke

```powershell
npx nx test shared
```

### Test sve projekte

```powershell
npx nx run-many --target=test --all
```

## 📋 Opis Funkcionalnosti

### Kanban Board Features

- **Prikaz board-a** sa kolonama (To Do, In Progress, Done)
- **Kartice** sa informacijama: naslov, opis, assignee, prioritet
- **Dodavanje novih kartica** u kolone
- **Brisanje kartica**
- **Vizuelna indikacija prioriteta** (crvena - high, narandžasta - medium, zelena - low)

### State Management

#### kanban-signal (Signals)
- Koristi Angular Signals za reaktivni state
- `KanbanSignalStore` servis sa signal-based API
- Computed values za automatski derivovane vrednosti
- Effects za side-effects

#### kanban-ngxs (NGXS)
- NGXS store pattern sa actions, state, i selectors
- Redux DevTools integracija (u dev modu)
- Observable-based API sa RxJS
- Type-safe actions i state management

## 🔧 Dodavanje Novih Funkcionalnosti

### Dodavanje nove komponente u shared biblioteku

```powershell
npx nx g @nx/angular:component --name=new-component --project=shared --directory=lib/components/new-component --standalone
```

### Dodavanje novog servisa u shared biblioteku

```powershell
npx nx g @nx/angular:service --name=new-service --project=shared --directory=lib/services
```

## 📚 Tehnologije

- **Angular 20.3** - Framework
- **Nx 22.2** - Monorepo tooling
- **TypeScript 5.9** - Programming language
- **NGXS 18** - State management (kanban-ngxs)
- **Angular Signals** - Reactive state (kanban-signal)
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **ESLint** - Linting
- **Rspack/esbuild** - Bundling

## 📖 Korisni Nx Comandи

```powershell
# Prikaži dependency graph
npx nx graph

# Pogledaj informacije o projektu
npx nx show project kanban-signal
npx nx show project kanban-ngxs
npx nx show project shared

# Pokreni lint
npx nx lint kanban-signal
npx nx lint kanban-ngxs

# Formatiraj kod
npx nx format:write

# Reset Nx cache
npx nx reset
```

## 🎯 Razlike između Aplikacija

### kanban-signal
- **State**: Signals (`signal`, `computed`, `effect`)
- **Reactivity**: Automatski change detection sa Signals
- **Store**: `KanbanSignalStore` servis
- **API**: Imperativni pristup (set, update metode)

### kanban-ngxs
- **State**: NGXS Store sa Actions
- **Reactivity**: RxJS Observables
- **Store**: `KanbanState` sa decorators (`@State`, `@Action`, `@Selector`)
- **API**: Dispatch actions, select observables
- **DevTools**: Redux DevTools podrška

## 📝 Napomene

- Obe aplikacije koriste **iste shared komponente** iz `libs/shared`
- Razlikuje se **samo state management** pristup
- Komponente su **framework agnostic** i ne zavise od state management rešenja
- Sve je **standalone** (bez NgModules)
- **OnPush** change detection za bolje performanse
