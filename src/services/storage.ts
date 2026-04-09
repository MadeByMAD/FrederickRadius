import type { RewardsState, Badge } from '../types';

const REWARDS_KEY = 'frederick-radius-rewards';

const DEFAULT_BADGES: Badge[] = [
  { id: 'explorer', name: 'Explorer', description: 'Visit all 12 municipalities', icon: '🗺️', earned: false },
  { id: 'first-search', name: 'First Search', description: 'Search for your first address', icon: '🔍', earned: false },
  { id: 'weather-watcher', name: 'Weather Watcher', description: 'Check the weather forecast', icon: '🌤️', earned: false },
  { id: 'water-monitor', name: 'Water Monitor', description: 'View stream gauge data', icon: '💧', earned: false },
  { id: 'civic-minded', name: 'Civic Minded', description: 'View the meeting calendar', icon: '🏛️', earned: false },
  { id: 'data-diver', name: 'Data Diver', description: 'Toggle 5 different map layers', icon: '📊', earned: false },
  { id: 'local-expert', name: 'Local Expert', description: 'View 6 municipality profiles', icon: '⭐', earned: false },
  { id: 'cartographer', name: 'Cartographer', description: 'Explore the full county map', icon: '🧭', earned: false },
];

export function getDefaultRewards(): RewardsState {
  return {
    points: 0,
    municipalitiesVisited: [],
    badges: [...DEFAULT_BADGES],
    actions: [],
  };
}

export function loadRewards(): RewardsState {
  try {
    const stored = localStorage.getItem(REWARDS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RewardsState;
      // Merge with any new badges
      const existingIds = new Set(parsed.badges.map((b) => b.id));
      for (const badge of DEFAULT_BADGES) {
        if (!existingIds.has(badge.id)) {
          parsed.badges.push(badge);
        }
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return getDefaultRewards();
}

export function saveRewards(state: RewardsState): void {
  try {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
