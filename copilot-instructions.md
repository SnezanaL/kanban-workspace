# Copilot Instructions for This Workspace

This repository uses **latest Angular features**. When generating or editing Angular code, follow these rules:

## General Angular Style

- Use **standalone components** and **standalone features** only (no NgModules). Never add new NgModules.
- **Always** inject services using the `inject()` function instead of constructor injection in new code.
- Prefer **Angular Signals** for state management when it makes sense.
- Use **OnPush-style patterns** (immutable data, pure views) even if `changeDetection` is not explicitly set everywhere.

## Inputs and Outputs

- **Do not use the old `@Input()` and `@Output()` decorators.**
- Instead, use the **new input/output functions** from `@angular/core`:
  - `input()` and `input.required()` for component inputs.
  - `output()` for component outputs.
- Example pattern:

  ```ts
  import { Component, input, output } from '@angular/core';

  @Component({
    selector: 'app-example',
    standalone: true,
    template: `...`,
  })
  export class ExampleComponent {
    readonly title = input.required<string>();
    readonly closed = output<void>();
  }
  ```

## Templates

- Always use **new Angular control flow**:
  - Use `@if () { } @else { }` instead of `*ngIf`.
  - Use `@for (item of items; track item.id) { }` instead of `*ngFor`.
  - Use `@switch` / `@case` / `@default` instead of `ngSwitch`.
- Avoid legacy structural directives (`*ngIf`, `*ngFor`, `ngSwitch`) in new code.

## Signals and Reactive State

- Prefer **signals** over RxJS `BehaviorSubject`/`Subject` for local UI state.
- Use `signal()`, `computed()`, and `effect()` from `@angular/core`.
- Example pattern for a simple local store:

  ```ts
  import { Injectable, signal, computed } from '@angular/core';

  @Injectable({ providedIn: 'root' })
  export class CounterStore {
    private readonly countSignal = signal(0);

    readonly count = this.countSignal.asReadonly();
    readonly isEven = computed(() => this.count() % 2 === 0);

    increment(): void {
      this.countSignal.update((c) => c + 1);
    }
  }
  ```

## Shared Library Usage

- Shared UI and logic live in the `libs/shared` library.
- Reuse existing models, services, and components instead of duplicating code in apps.
- Import shared symbols using the configured path alias:

  ```ts
  import { KanbanBoardComponent, KanbanDataService } from '@kanban-workspace/shared';
  ```

## Tailwind & Styling

- Use **Tailwind CSS utility classes** in templates where appropriate.
- Shared design tokens and styles are described in [TAILWIND_DESIGN_SYSTEM.md](TAILWIND_DESIGN_SYSTEM.md).
- Prefer semantic HTML with Tailwind utilities over large custom CSS files.

## Testing & Linting

- Keep existing Jest and ESLint setup; follow their rules.
- Do not introduce other test frameworks or linters.

## Things to Avoid

- No deprecated Angular APIs (`ViewEngine`, `Renderer`, old forms APIs, etc.).
- No `@Input()` / `@Output()` decorators in new code.
- No `*ngIf` / `*ngFor` / `ngSwitch` in new templates.
- Avoid creating new NgModules.

These instructions are meant to guide code generation and refactors so that all new Angular code matches the modern style used in this workspace.
