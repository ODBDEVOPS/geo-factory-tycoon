
export interface Resource {
  name: string;
  color: string;
  description: string;
}

export interface Machine {
  id: string;
  name: string;
  cost: number;
  tier: 'basic' | 'quantum' | 'advanced' | 'stellar';
  production: Record<string, number>;
  consumption: Record<string, number>;
  special: Record<string, any>;
  color: string;
  size: number;
  unlocked: boolean;
}

export interface Research {
  id: string;
  name: string;
  cost: number;
  prerequisites: string[];
  unlocks: string[];
  effects: Record<string, any>;
  status?: 'researched' | 'available' | 'locked';
}
