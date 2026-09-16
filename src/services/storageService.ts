import { Costume, CostumeId, LevelConfig } from '../types';

const STORAGE_KEYS = {
  COINS: 'mission_delhi_coins',
  SELECTED_COSTUME: 'mission_delhi_selected_costume',
  UNLOCKED_COSTUMES: 'mission_delhi_unlocked_costumes',
  LEVEL_PROGRESS: 'mission_delhi_level_progress',
  SETTINGS: 'mission_delhi_settings',
};

export const INITIAL_COSTUMES: Costume[] = [
  {
    id: 'classic',
    name: 'Classic Saffron',
    tagline: 'The iconic traditional orange vest & pristine white kurta',
    kurtaColor: '#f8fafc',
    jacketColor: '#ea580c',
    pantsColor: '#f1f5f9',
    cost: 0,
    unlocked: true,
  },
  {
    id: 'royal',
    name: 'Royal Bandhgala',
    tagline: 'Majestic navy blazer with a royal festive Rajasthani pagri',
    kurtaColor: '#1e293b',
    jacketColor: '#0f172a',
    pantsColor: '#334155',
    headwear: 'pagri',
    headwearColor: '#e11d48',
    cost: 150,
    unlocked: false,
  },
  {
    id: 'yoga',
    name: 'Yoga Peacekeeper',
    tagline: 'Zen white activewear with athletic sweatband & mat',
    kurtaColor: '#ffffff',
    jacketColor: '#38bdf8',
    pantsColor: '#ffffff',
    headwear: 'headband',
    headwearColor: '#f59e0b',
    capeOrAccessory: 'yoga_mat',
    cost: 300,
    unlocked: false,
  },
  {
    id: 'space',
    name: 'Gaganyaan Astronaut',
    tagline: 'High-tech galactic spacesuit ready for cosmic exploration',
    kurtaColor: '#e2e8f0',
    jacketColor: '#2563eb',
    pantsColor: '#94a3b8',
    headwear: 'space_helmet',
    headwearColor: '#fbbf24',
    capeOrAccessory: 'rocket_pack',
    cost: 500,
    unlocked: false,
  },
  {
    id: 'explorer',
    name: 'World Explorer',
    tagline: 'Khaki safari adventure jacket and stylish sun explorer hat',
    kurtaColor: '#d97706',
    jacketColor: '#78350f',
    pantsColor: '#b45309',
    headwear: 'safari_hat',
    headwearColor: '#92400e',
    capeOrAccessory: 'camera_strap',
    cost: 750,
    unlocked: false,
  },
];

export const INITIAL_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Parliament Dash',
    subtitle: 'Mission: Central Avenue',
    description: 'Sprint through the cartoon capital avenue! Dodge rolling chai carts, stray news microphones, and bouncy monkeys.',
    targetDistance: 500, // 500 meters to complete
    baseSpeed: 5.5,
    maxSpeed: 8.5,
    environment: 'parliament',
    skyColor: ['#fef08a', '#fdba74'],
    groundColor: '#451a03',
    accentColor: '#f97316',
    unlocked: true,
    stars: 0,
    highScore: 0,
  },
  {
    id: 2,
    name: 'Train Rush',
    subtitle: 'Mission: Superfast Vande Express',
    description: 'Jump along vibrant express train roofs! Dodge high signal gantries, loose luggage stacks, and steam bursts while collecting gold.',
    targetDistance: 600,
    baseSpeed: 6.2,
    maxSpeed: 9.5,
    environment: 'train',
    skyColor: ['#67e8f9', '#bae6fd'],
    groundColor: '#1e293b',
    accentColor: '#0284c7',
    unlocked: false,
    stars: 0,
    highScore: 0,
  },
  {
    id: 3,
    name: 'Clean City Challenge',
    subtitle: 'Mission: Green & Clean Streets',
    description: 'Help keep the fictional city sparkling! Collect clean recyclables and drop items into green and blue bins for massive eco bonuses.',
    targetDistance: 650,
    baseSpeed: 5.8,
    maxSpeed: 9.0,
    environment: 'cleancity',
    skyColor: ['#bbf7d0', '#86efac'],
    groundColor: '#14532d',
    accentColor: '#16a34a',
    unlocked: false,
    stars: 0,
    highScore: 0,
    cleanBinMechanic: true,
  },
  {
    id: 4,
    name: 'Space Mission',
    subtitle: 'Mission: Gaganyaan Cosmos',
    description: 'Blast into orbit! Steer the cartoon rocket through glowing asteroid belts, space samosas, and cosmic star rings.',
    targetDistance: 700,
    baseSpeed: 7.0,
    maxSpeed: 10.5,
    environment: 'space',
    skyColor: ['#0f172a', '#312e81'],
    groundColor: '#1e1b4b',
    accentColor: '#818cf8',
    unlocked: false,
    stars: 0,
    highScore: 0,
    spaceFlightMechanic: true,
  },
  {
    id: 5,
    name: 'World Tour',
    subtitle: 'Mission: Global Friendship Dash',
    description: 'Travel through fictional world landmarks! Collect international friendship badges and make your grand return to Delhi!',
    targetDistance: 800,
    baseSpeed: 7.5,
    maxSpeed: 11.0,
    environment: 'worldtour',
    skyColor: ['#f472b6', '#fed7aa'],
    groundColor: '#831843',
    accentColor: '#db2777',
    unlocked: false,
    stars: 0,
    highScore: 0,
  },
];

export class StorageService {
  public static getCoins(): number {
    const val = localStorage.getItem(STORAGE_KEYS.COINS);
    return val ? parseInt(val, 10) : 50; // Give 50 starting coins for fun!
  }

  public static addCoins(amount: number): number {
    const current = this.getCoins();
    const updated = Math.max(0, current + amount);
    localStorage.setItem(STORAGE_KEYS.COINS, updated.toString());
    return updated;
  }

  public static getSelectedCostume(): CostumeId {
    return (localStorage.getItem(STORAGE_KEYS.SELECTED_COSTUME) as CostumeId) || 'classic';
  }

  public static setSelectedCostume(id: CostumeId) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_COSTUME, id);
  }

  public static getUnlockedCostumes(): string[] {
    const val = localStorage.getItem(STORAGE_KEYS.UNLOCKED_COSTUMES);
    if (!val) {
      return ['classic'];
    }
    try {
      return JSON.parse(val);
    } catch {
      return ['classic'];
    }
  }

  public static unlockCostume(id: CostumeId) {
    const list = this.getUnlockedCostumes();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_COSTUMES, JSON.stringify(list));
    }
  }

  public static getLevels(): LevelConfig[] {
    const val = localStorage.getItem(STORAGE_KEYS.LEVEL_PROGRESS);
    if (!val) return INITIAL_LEVELS;
    try {
      const stored = JSON.parse(val);
      return INITIAL_LEVELS.map((lvl) => {
        const match = stored.find((s: { id: number }) => s.id === lvl.id);
        if (match) {
          return {
            ...lvl,
            unlocked: match.unlocked,
            stars: match.stars || 0,
            highScore: match.highScore || 0,
          };
        }
        return lvl;
      });
    } catch {
      return INITIAL_LEVELS;
    }
  }

  public static saveLevelProgress(levelId: number, score: number, stars: number) {
    const levels = this.getLevels();
    const currentLevel = levels.find((l) => l.id === levelId);
    if (currentLevel) {
      currentLevel.highScore = Math.max(currentLevel.highScore, score);
      currentLevel.stars = Math.max(currentLevel.stars, stars);

      // Unlock next level if won
      const nextLevel = levels.find((l) => l.id === levelId + 1);
      if (nextLevel && stars > 0) {
        nextLevel.unlocked = true;
      }

      localStorage.setItem(
        STORAGE_KEYS.LEVEL_PROGRESS,
        JSON.stringify(
          levels.map((l) => ({
            id: l.id,
            unlocked: l.unlocked,
            stars: l.stars,
            highScore: l.highScore,
          }))
        )
      );
    }
  }

  public static getSettings(): { bgm: boolean; sfx: boolean } {
    const val = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!val) return { bgm: true, sfx: true };
    try {
      return JSON.parse(val);
    } catch {
      return { bgm: true, sfx: true };
    }
  }

  public static saveSettings(settings: { bgm: boolean; sfx: boolean }) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}
