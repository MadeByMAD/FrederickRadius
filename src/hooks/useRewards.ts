import { useState, useCallback } from 'react';
import type { RewardsState } from '../types';
import { getDefaultRewards, loadRewards, saveRewards } from '../services/storage';

export function useRewards(enabled = true) {
  const [rewards, setRewards] = useState<RewardsState>(() => (
    enabled ? loadRewards() : getDefaultRewards()
  ));

  const addPoints = useCallback((points: number, description: string) => {
    if (!enabled) return;
    setRewards((prev) => {
      const next: RewardsState = {
        ...prev,
        points: prev.points + points,
        actions: [
          { type: 'points', points, timestamp: new Date().toISOString(), description },
          ...prev.actions.slice(0, 49),
        ],
      };
      saveRewards(next);
      return next;
    });
  }, [enabled]);

  const visitMunicipality = useCallback((id: string) => {
    if (!enabled) return;
    setRewards((prev) => {
      if (prev.municipalitiesVisited.includes(id)) return prev;

      const visited = [...prev.municipalitiesVisited, id];
      const badges = prev.badges.map((b) => {
        if (b.id === 'explorer' && visited.length >= 12) {
          return { ...b, earned: true, earnedAt: new Date().toISOString() };
        }
        if (b.id === 'local-expert' && visited.length >= 6) {
          return { ...b, earned: true, earnedAt: new Date().toISOString() };
        }
        return b;
      });

      const next: RewardsState = {
        ...prev,
        points: prev.points + 10,
        municipalitiesVisited: visited,
        badges,
        actions: [
          { type: 'visit', points: 10, timestamp: new Date().toISOString(), description: `Explored municipality` },
          ...prev.actions.slice(0, 49),
        ],
      };
      saveRewards(next);
      return next;
    });
  }, [enabled]);

  const earnBadge = useCallback((badgeId: string) => {
    if (!enabled) return;
    setRewards((prev) => {
      const badge = prev.badges.find((b) => b.id === badgeId);
      if (!badge || badge.earned) return prev;

      const next: RewardsState = {
        ...prev,
        points: prev.points + 25,
        badges: prev.badges.map((b) =>
          b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
        ),
        actions: [
          { type: 'badge', points: 25, timestamp: new Date().toISOString(), description: `Earned badge: ${badge.name}` },
          ...prev.actions.slice(0, 49),
        ],
      };
      saveRewards(next);
      return next;
    });
  }, [enabled]);

  return { rewards, addPoints, visitMunicipality, earnBadge };
}
