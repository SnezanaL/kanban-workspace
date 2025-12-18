import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly document = inject(DOCUMENT);
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    const root = this.document?.documentElement;
    const stored = this.safeGetLocalStorage('kanban-theme');

    const initial =
      stored === 'dark'
        ? true
        : stored === 'light'
        ? false
        : root?.classList?.contains('dark') ?? false;

    this.setDarkMode(initial, false);
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  setDarkMode(isDark: boolean, persist = true): void {
    this.isDarkMode.set(isDark);

    const root = this.document?.documentElement;
    if (root) root.classList.toggle('dark', isDark);

    if (persist) this.safeSetLocalStorage('kanban-theme', isDark ? 'dark' : 'light');
  }

  private safeGetLocalStorage(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSetLocalStorage(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
}
