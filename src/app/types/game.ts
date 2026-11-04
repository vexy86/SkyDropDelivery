export interface DroneSkin {
  id: string;
  name: string;
  color: string;
  unlockScore: number;
  locked: boolean;
}

export interface Obstacle {
  id: number;
  type: 'bird' | 'balloon' | 'wind';
  x: number;
  y: number;
  speed: number;
}

export interface PowerUp {
  id: number;
  type: 'slowMotion' | 'shield' | 'magnet';
  x: number;
  y: number;
  speed: number;
  collected: boolean;
}

export interface ActivePowerUp {
  type: 'slowMotion' | 'shield' | 'magnet';
  endTime: number;
}

export interface Package {
  id: number;
  x: number;
  y: number;
  velocityY: number;
}

export interface HouseData {
  id: number;
  x: number;
  chimneyX: number;
  chimneyY: number;
}