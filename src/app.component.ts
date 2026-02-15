
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  gameState = inject(GameStateService);

  activeModal = signal<'none' | 'research' | 'drones' | 'time'>('none');
  isSidebarVisible = signal(false);

  researchTreeArray = computed(() => Object.values(this.gameState.researchTree()));

  openModal(modalName: 'research' | 'drones' | 'time'): void {
    this.activeModal.set(modalName);
    this.isSidebarVisible.set(false);
  }

  closeModal(): void {
    this.activeModal.set('none');
  }

  toggleSidebar(): void {
    this.isSidebarVisible.update(v => !v);
  }

  getMachineIcon(id: string): string {
    const icons: Record<string, string> = {
      quantum_processor: '🧠',
      antimatter_reactor: '💥',
      teleporter_pad: '🌀',
      drone_hub: '🛰️',
      weather_controller: '🌦️',
      bio_fabricator: '🌿',
      gravity_well: '🕳️',
      nano_assembler: '🔬',
      reality_anchor: '⚓',
      chrono_loop: '⏳',
    };
    return icons[id] || '⚙️';
  }

  getResearchStatusColor(status: 'researched' | 'available' | 'locked' | undefined): string {
    switch (status) {
      case 'researched': return 'border-cyan-400';
      case 'available': return 'border-green-500';
      case 'locked': return 'border-red-500';
      default: return 'border-gray-600';
    }
  }

  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }
}
