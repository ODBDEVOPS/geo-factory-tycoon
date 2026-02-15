
import { Injectable, signal, computed } from '@angular/core';
import { Machine, Research } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  // --- STATE SIGNALS ---
  resources = signal<Record<string, number>>({
    credits: 100000,
    quantum_data: 120,
    antimatter: 50,
    drones: 5,
    energy: 5000,
    raw_ore: 2500,
    refined_metal: 1000,
    time_crystals: 10,
  });

  machines = signal<Record<string, Machine>>(this.getInitialMachines());
  researchTree = signal<Record<string, Research>>(this.getInitialResearch());

  // --- COMPUTED SIGNALS ---
  basicMachines = computed(() => Object.values(this.machines()).filter(m => m.tier === 'basic'));
  quantumMachines = computed(() => Object.values(this.machines()).filter(m => m.tier === 'quantum'));
  advancedMachines = computed(() => Object.values(this.machines()).filter(m => m.tier === 'advanced'));

  constructor() {
    this.updateResearchStatus();
  }

  // --- DATA INITIALIZATION ---
  private getInitialMachines(): Record<string, Machine> {
    return {
      QUANTUM_PROCESSOR: { id: 'quantum_processor', name: 'Processeur Quantique', cost: 25000, tier: 'quantum', production: { 'quantum_data': 10, 'credits': 50 }, consumption: { 'energy': 100, 'refined_metal': 5 }, special: { type: 'data_processing', efficiency_boost: 1.5 }, color: '#00e5ff', size: 2, unlocked: true },
      ANTIMATTER_REACTOR: { id: 'antimatter_reactor', name: 'Réacteur à Antimatière', cost: 50000, tier: 'quantum', production: { 'energy': 500, 'antimatter': 1 }, consumption: { 'quantum_data': 5, 'refined_metal': 20 }, special: { type: 'power_generation', explosion_risk: 0.01 }, color: '#ff1744', size: 3, unlocked: false },
      TELEPORTER_PAD: { id: 'teleporter_pad', name: 'Plaque de Téléportation', cost: 30000, tier: 'advanced', production: {}, consumption: { 'energy': 200, 'quantum_data': 3 }, special: { type: 'transport', range: 10, instant_transfer: true }, color: '#7b1fa2', size: 2, unlocked: true },
      DRONE_HUB: { id: 'drone_hub', name: 'Hub de Drones', cost: 15000, tier: 'advanced', production: { 'drones': 1 }, consumption: { 'energy': 50, 'refined_metal': 10 }, special: { type: 'logistics', drone_capacity: 10, auto_transport: true }, color: '#00c853', size: 2, unlocked: true },
      WEATHER_CONTROLLER: { id: 'weather_controller', name: 'Contrôleur Météo', cost: 35000, tier: 'advanced', production: { 'weather_data': 5, 'energy': 100 }, consumption: { 'quantum_data': 2 }, special: { type: 'environment', weather_effects: ['sunny', 'rain', 'storm'], production_boost: 1.3 }, color: '#ff9100', size: 2, unlocked: false },
      BIO_FABRICATOR: { id: 'bio_fabricator', name: 'Bio-Fabricateur', cost: 20000, tier: 'advanced', production: { 'organic_matter': 15, 'credits': 25 }, consumption: { 'energy': 75, 'raw_ore': 10 }, special: { type: 'bio_production', self_replicating: true, growth_rate: 1.1 }, color: '#1de9b6', size: 2, unlocked: true },
      GRAVITY_WELL: { id: 'gravity_well', name: 'Puits Gravitationnel', cost: 45000, tier: 'quantum', production: { 'gravitational_lens': 2, 'raw_ore': 50 }, consumption: { 'energy': 300, 'antimatter': 0.5 }, special: { type: 'extraction', area_effect: 3, extraction_multiplier: 2.0 }, color: '#3d5afe', size: 3, unlocked: false },
      NANO_ASSEMBLER: { id: 'nano_assembler', name: 'Assembleur Nano', cost: 40000, tier: 'quantum', production: { 'nano_components': 8, 'refined_metal': 20 }, consumption: { 'energy': 150, 'raw_ore': 5 }, special: { type: 'manufacturing', precision: 0.999, waste_reduction: 0.9 }, color: '#ffea00', size: 2, unlocked: false },
      REALITY_ANCHOR: { id: 'reality_anchor', name: 'Ancre de Réalité', cost: 60000, tier: 'quantum', production: { 'reality_shards': 1 }, consumption: { 'quantum_data': 10, 'antimatter': 1 }, special: { type: 'stabilization', stability_boost: 2.0, prevents_events: true }, color: '#f5f5f5', size: 2, unlocked: false },
      CHRONO_LOOP: { id: 'chrono_loop', name: 'Boucle Chrono', cost: 75000, tier: 'quantum', production: { 'time_crystals': 0.5 }, consumption: { 'energy': 400, 'quantum_data': 5 }, special: { type: 'temporal', time_dilation: 1.5, production_speed: 2.0 }, color: '#18ffff', size: 3, unlocked: false }
    };
  }
  
  private getInitialResearch(): Record<string, Research> {
    return {
      QUANTUM_COMPUTING: { id: 'quantum_computing', name: 'Informatique Quantique', cost: 10000, prerequisites: [], unlocks: ['QUANTUM_PROCESSOR'], effects: { 'quantum_data_production': 1.5 }, status: 'researched' },
      ANTIMATTER_HARVESTING: { id: 'antimatter_harvesting', name: 'Récolte d\'Antimatière', cost: 25000, prerequisites: ['QUANTUM_COMPUTING'], unlocks: ['ANTIMATTER_REACTOR'], effects: { 'energy_production': 2.0 } },
      TELEPORTATION_TECH: { id: 'teleportation_tech', name: 'Technologie de Téléportation', cost: 15000, prerequisites: ['QUANTUM_COMPUTING'], unlocks: ['TELEPORTER_PAD'], effects: { 'transport_speed': 10 } },
      DRONE_SWARMS: { id: 'drone_swarms', name: 'Essaims de Drones', cost: 12000, prerequisites: [], unlocks: ['DRONE_HUB'], effects: { 'logistics_efficiency': 1.8 }, status: 'researched' },
      WEATHER_MANIPULATION: { id: 'weather_manipulation', name: 'Manipulation Météorologique', cost: 20000, prerequisites: ['DRONE_SWARMS'], unlocks: ['WEATHER_CONTROLLER'], effects: { 'production_stability': 1.5 } },
      BIO_SYNTHESIS: { id: 'bio_synthesis', name: 'Synthèse Biologique', cost: 18000, prerequisites: [], unlocks: ['BIO_FABRICATOR'], effects: { 'organic_production': 2.0 }, status: 'researched' },
      GRAVITY_CONTROL: { id: 'gravity_control', name: 'Contrôle Gravitationnel', cost: 35000, prerequisites: ['ANTIMATTER_HARVESTING'], unlocks: ['GRAVITY_WELL'], effects: { 'extraction_rate': 3.0 } },
      NANO_TECHNOLOGY: { id: 'nanotechnology', name: 'Nanotechnologie', cost: 30000, prerequisites: ['QUANTUM_COMPUTING'], unlocks: ['NANO_ASSEMBLER'], effects: { 'manufacturing_precision': 0.99 } },
      REALITY_STABILIZATION: { id: 'reality_stabilization', name: 'Stabilisation de la Réalité', cost: 50000, prerequisites: ['GRAVITY_CONTROL', 'NANO_TECHNOLOGY'], unlocks: ['REALITY_ANCHOR'], effects: { 'factory_stability': 2.5 } },
      TEMPORAL_MANIPULATION: { id: 'temporal_manipulation', name: 'Manipulation Temporelle', cost: 75000, prerequisites: ['REALITY_STABILIZATION'], unlocks: ['CHRONO_LOOP'], effects: { 'time_compression': 2.0 } }
    };
  }

  private updateResearchStatus() {
    this.researchTree.update(tree => {
      const researchedIds = new Set(Object.values(tree).filter(r => r.status === 'researched').map(r => r.id));
      for (const tech of Object.values(tree)) {
        if (tech.status !== 'researched') {
           const prereqsMet = tech.prerequisites.every(p => researchedIds.has(p.toLowerCase()));
           tech.status = prereqsMet ? 'available' : 'locked';
        }
      }
      return tree;
    });
  }
}
