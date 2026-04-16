export function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const deltaMs = Date.now() - d.getTime();
  const deltaSec = Math.round(deltaMs / 1000);
  const abs = Math.abs(deltaSec);

  if (abs < 45) return 'just now';
  if (abs < 90) return deltaSec >= 0 ? '1m ago' : 'in 1m';

  const deltaMin = Math.round(deltaSec / 60);
  if (Math.abs(deltaMin) < 60) {
    return deltaMin >= 0 ? `${deltaMin}m ago` : `in ${Math.abs(deltaMin)}m`;
  }

  const deltaHour = Math.round(deltaMin / 60);
  if (Math.abs(deltaHour) < 24) {
    return deltaHour >= 0 ? `${deltaHour}h ago` : `in ${Math.abs(deltaHour)}h`;
  }

  const deltaDay = Math.round(deltaHour / 24);
  if (Math.abs(deltaDay) === 1) return deltaDay > 0 ? 'yesterday' : 'tomorrow';
  if (Math.abs(deltaDay) < 7) return deltaDay >= 0 ? `${deltaDay}d ago` : `in ${Math.abs(deltaDay)}d`;

  return d.toLocaleDateString();
}
