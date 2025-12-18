import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoIconComponent } from './logo-icon.component';
import { SidebarService } from '../kanban-sidebar/sidebar.service';

@Component({
  selector: 'lib-kanban-logo',
  standalone: true,
  imports: [CommonModule, LogoIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2 dark:text-white font-bold text-black">
      <!-- Light / dark logo swap based on theme; adjust src paths to your actual SVG files -->
      <lib-logo-icon [fill]="fill()"></lib-logo-icon>
    </div>
  `,
})
export class KanbanLogoComponent {
  readonly sidebar = inject(SidebarService);

  readonly fill = computed(() => (this.sidebar.isDarkMode() ? '#ffffff' : '#000000'));
}
