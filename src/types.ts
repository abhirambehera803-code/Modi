export type GameScreen =
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAMEOVER'
  | 'VICTORY'
  | 'LEVEL_SELECT'
  | 'WARDROBE'
  | 'SETTINGS'
  | 'HOW_TO_PLAY';

export type PowerUpType = 'chai' | 'namaste' | 'selfie' | 'rocket';

export interface ActivePowerUp {
  type: PowerUpType;
  duration: number; // in seconds
  timeLeft: number; // in seconds
}

export type CostumeId = 'classic' | 'royal' | 'yoga' | 'space' | 'explorer';

export interface Costume {
  id: CostumeId;
  name: string;
  tagline: string;
  kurtaColor: string;
  jacketColor: string;
  pantsColor: string;
  headwear?: 'pagri' | 'headband' | 'space_helmet' | 'safari_hat';
  headwearColor?: string;
  capeOrAccessory?: 'yoga_mat' | 'camera_strap' | 'rocket_pack' | 'tricolor_shawl';
  cost: number; // in coins to unlock
  unlocked: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  targetDistance: number; // in meters
  baseSpeed: number;
  maxSpeed: number;
  environment: 'parliament' | 'train' | 'cleancity' | 'space' | 'worldtour';
  skyColor: [string, string]; // gradient [top, bottom]
  groundColor: string;
  accentColor: string;
  unlocked: boolean;
  stars: number; // 0 - 3
  highScore: number;
  cleanBinMechanic?: boolean; // For clean city challenge
  spaceFlightMechanic?: boolean; // For space level
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type:
    | 'pothole'
    | 'monkey'
    | 'mic_tripod'
    | 'chai_cart'
    | 'train_signal'
    | 'luggage'
    | 'steam_vent'
    | 'banana_peel'
    | 'mud_puddle'
    | 'satellite_junk'
    | 'space_meteor'
    | 'monument_barrier';
  frame: number;
  passed: boolean;
}

export interface Collectible {
  x: number;
  y: number;
  width: number;
  height: number;
  type:
    | 'coin'
    | 'file_scroll'
    | 'chai_cup'
    | 'namaste_lotus'
    | 'camera_selfie'
    | 'rocket_fuel'
    | 'clean_organic' // Green apple/peel
    | 'clean_recyclable' // Blue bottle
    | 'cosmic_star';
  value: number;
  collected: boolean;
  bobOffset: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  opacity: number;
  life: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'sparkle' | 'steam';
}

export interface PlayerState {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  isJumping: boolean;
  isDucking: boolean;
  isInvincible: boolean;
  invincibleTimer: number;
  runFrame: number;
  facingDirection: 1;
}

export interface GameSettings {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  touchControls: boolean;
}
